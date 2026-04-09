let currentRate = 0;
let currentSite = '';

/**
 * @param {number} rate 
 * @param {string} siteType 'taobao' 또는 'aliexpress'
 */
export function startConversion(rate, siteType) {
  currentRate = rate;
  currentSite = siteType;
  
  convertDOM(document.body);

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          convertDOM(node);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * @param {any} rootNode
 */
function convertDOM(rootNode) {
  if (!rootNode.querySelectorAll) return;

  if (currentSite === 'taobao') {
    convertTaobao(rootNode);
  } else if (currentSite === 'aliexpress') {
    convertAliExpress(rootNode);
  }
}

/**
 * 타오바오 전용 변환 로직
 * @param {any} rootNode
 */
function convertTaobao(rootNode) {
  const priceElements = rootNode.querySelectorAll('.price-value:not([data-converted])');
  priceElements.forEach(/** @param {HTMLElement} el */ el => {
    const text = el.textContent?.trim() || '';
    const cny = parseFloat(text.replace(/,/g, ''));

    if (!isNaN(cny)) {
      const krw = Math.round(cny * currentRate).toLocaleString('ko-KR');
      const krwSpan = document.createElement('span');
      krwSpan.textContent = ` (₩${krw})`;
      krwSpan.style.color = '#ff5000';
      krwSpan.style.fontSize = '1.1em';
      krwSpan.style.marginLeft = '4px';
      krwSpan.style.fontWeight = 'bold';

      if (el.parentNode) {
        el.parentNode.insertBefore(krwSpan, el.nextSibling);
      }
      el.dataset.converted = 'true';
    }
  });
}

/**
 * 알리익스프레스 전용 변환 로직
 * @param {any} rootNode
 */
function convertAliExpress(rootNode) {
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
    const currencySpan = n.parentNode;
    if (!currencySpan) return;
    const priceWrapper = currencySpan.parentNode;
    
    if (!priceWrapper || /** @type {HTMLElement} */(priceWrapper).dataset.converted) return;

    const fullText = priceWrapper.textContent;
    if (!fullText) return;

    const regex = /(?:US\s*)?\$?\s*([0-9,.]+)/;
    const match = fullText.match(regex);

    if (match && match[1]) {
      const usd = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(usd)) {
        const krw = Math.round(usd * currentRate).toLocaleString('ko-KR');
        const krwSpan = document.createElement('span');
        krwSpan.textContent = ` (₩${krw})`;
        krwSpan.style.color = '#ff5000';
        krwSpan.style.fontSize = '0.9em';
        krwSpan.style.marginLeft = '4px';
        krwSpan.style.fontWeight = 'bold';

        priceWrapper.appendChild(krwSpan);
        /** @type {HTMLElement} */(priceWrapper).dataset.converted = 'true';
      }
    }
  });
}