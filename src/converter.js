let currentRate = 0;

/**
 * @param {number} rate
 */
export function startConversion(rate) {
  currentRate = rate;
  convertDOM(document.body);

  const observer = new MutationObserver((mutations) => {
    /** @type {Set<HTMLElement>} */
    const wrappersToReconvert = new Set();

    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        for (let node of mutation.addedNodes) {
          // 우리가 추가한 KRW span은 무시 (무한루프 방지)
          if (node.nodeType === Node.ELEMENT_NODE && !/** @type {HTMLElement} */(node).dataset.krw) {
            convertDOM(/** @type {Element} */(node));
          }
        }
      } else if (mutation.type === 'characterData') {
        // 텍스트 노드가 변경됐을 때, 이미 변환된 price wrapper인지 조상을 타고 올라가서 확인
        let parent = /** @type {Node | null} */(mutation.target.parentNode);
        while (parent && parent !== document.body) {
          if (/** @type {HTMLElement} */(parent).dataset?.converted) {
            wrappersToReconvert.add(/** @type {HTMLElement} */(parent));
            break;
          }
          parent = parent.parentNode;
        }
      }
    }

    // 변경된 price wrapper들을 재변환
    wrappersToReconvert.forEach(wrapper => reconvert(wrapper));
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true, // 텍스트 노드 내용 변경 감지 (옵션 선택 시 가격 교체 등)
  });
}

/**
 * 이미 변환된 wrapper의 KRW 표시를 지우고 새 가격으로 재변환합니다.
 * @param {HTMLElement} priceWrapper
 */
function reconvert(priceWrapper) {
  // 기존 KRW span 제거
  const existingKrwSpan = priceWrapper.querySelector('[data-krw="true"]');
  if (existingKrwSpan) existingKrwSpan.remove();

  // 변환 완료 꼬리표 제거
  delete priceWrapper.dataset.converted;

  // 재변환 (convertSingleWrapper 직접 호출)
  convertSingleWrapper(priceWrapper);
}

/**
 * @param {any} rootNode
 */
function convertDOM(rootNode) {
  if (!rootNode.querySelectorAll) return;

  // TreeWalker로 'US $' 텍스트를 가진 노드 찾기
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
  let node;
  /** @type {Node[]} */
  const nodesToModify = [];

  while ((node = walker.nextNode())) {
    if (node.nodeValue && (node.nodeValue.includes('US $') || node.nodeValue.trim() === '$')) {
      nodesToModify.push(node);
    }
  }

  nodesToModify.forEach(/** @param {Node} n */ n => {
    // n은 'US $' 글자 자체. n.parentNode는 그걸 감싼 span 태그
    const currencySpan = n.parentNode;
    if (!currencySpan) return;

    // 가격 전체(숫자와 소수점 등)를 감싸고 있는 진짜 부모 div 찾기
    const priceWrapper = /** @type {HTMLElement} */(currencySpan.parentNode);

    // 부모가 없거나 이미 우리가 변환을 마친 요소면 패스
    if (!priceWrapper || priceWrapper.dataset.converted) return;

    convertSingleWrapper(priceWrapper);
  });
}

/**
 * priceWrapper 하나를 변환합니다. (신규 및 재변환 공통 로직)
 * @param {HTMLElement} priceWrapper
 */
function convertSingleWrapper(priceWrapper) {
  // 이미 변환됐으면 패스
  if (priceWrapper.dataset.converted) return;

  // 쪼개진 태그들 안의 텍스트를 하나로 합치기 (예: "US $119.88")
  // 단, 우리가 추가한 KRW span 텍스트는 제외
  const fullText = Array.from(priceWrapper.childNodes)
    .filter(n => !(n.nodeType === Node.ELEMENT_NODE && /** @type {HTMLElement} */(n).dataset.krw))
    .map(n => n.textContent ?? '')
    .join('');

  if (!fullText) return;

  // 합쳐진 텍스트에서 숫자만 빼오기
  const regex = /(?:US\s*)?\$?\s*([0-9,.]+)/;
  const match = fullText.match(regex);

  if (match && match[1]) {
    const usd = parseFloat(match[1].replace(/,/g, ''));

    if (!isNaN(usd)) {
      const krw = Math.round(usd * currentRate).toLocaleString('ko-KR');

      // 원화를 띄워줄 새로운 span 만들기
      const krwSpan = document.createElement('span');
      krwSpan.textContent = ` (₩${krw})`;
      krwSpan.style.color = '#ff5000';
      krwSpan.style.fontSize = '0.9em';
      krwSpan.style.marginLeft = '4px';
      krwSpan.style.fontWeight = 'bold';
      krwSpan.dataset.krw = 'true'; // 식별자: reconvert 시 이 span만 정확히 제거하기 위함

      // 전체 가격 요소의 맨 마지막에 원화 달아주기
      priceWrapper.appendChild(krwSpan);

      // 변환 완료 꼬리표 달기 (중복 변환 방지용)
      priceWrapper.dataset.converted = 'true';
    }
  }
}