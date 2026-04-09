#  Global KRW Converter (Taobao & AliExpress)

A lightweight userscript that automatically converts product prices on **Taobao (CNY)** and **AliExpress (USD)** into **South Korean Won (KRW)** using real-time exchange rates.

##  Features
- **Real-time Exchange Rates:** Fetches the latest rates from [ER-API](https://www.exchangerate-api.com/) every 12 hours.
- **Smart Site Detection:** Automatically detects whether you are on Taobao/Tmall or AliExpress and applies the correct conversion (CNY ➔ KRW or USD ➔ KRW).
- **Svelte-powered UI:** Displays a clean, non-intrusive floating widget at the bottom-right of the screen showing the current exchange rate.
- **Dynamic Content Support:** Uses `MutationObserver` to ensure prices are converted even when new items are loaded via infinite scroll.

##  Installation
1. Install a userscript manager like **Violentmonkey** or **Tampermonkey** on your browser.
2. Click [https://github.com/kimpandol/global-shopping-krw-converter/blob/main/dist/taobao-ali-krw-converter.user.js] to install the script.
3. Refresh Taobao or AliExpress, and you'll see the KRW prices right next to the original currency!

##  Tech Stack
- **Framework:** Svelte 5
- **Build Tool:** Vite + `vite-plugin-monkey`
- **Language:** JavaScript with JSDoc for type safety

##  License
This project is open-source and available under the [MIT License](LICENSE).
<br><br><br><br>
#  Global KRW Converter (Taobao & AliExpress)

타오바오(위안화)와 알리익스프레스(달러) 가격을 실시간 환율을 반영하여 **한국 원화(KRW)**로 변환해 주는 유저스크립트입니다.

##  주요 기능
- **실시간 환율 반영:** [ER-API](https://www.exchangerate-api.com/)를 사용하여 12시간마다 최신 환율을 가져옵니다.
- **자동 사이트 감지:** 타오바오(Taobao/Tmall)와 알리익스프레스(AliExpress)를 자동으로 인식하여 각각 CNY, USD를 KRW로 변환합니다.
- **Svelte 기반 위젯:** 화면 우측 하단에서 현재 적용 중인 환율 정보를 깔끔하게 보여줍니다.

##  설치 방법
1. 브라우저에 **Violentmonkey** 또는 **Tampermonkey** 확장 프로그램을 설치합니다.
2. [https://github.com/kimpandol/global-shopping-krw-converter/blob/main/dist/taobao-ali-krw-converter.user.js] 스크립트를 설치합니다.
3. 타오바오나 알리익스프레스에 접속하면 자동으로 원화 가격이 표시됩니다.

##  기술 스택
- **Framework:** Svelte 5
- **Build Tool:** Vite + vite-plugin-monkey
- **Language:** JavaScript (JSDoc for Type checking)

##  License
This project is open-source and available under the [MIT License](LICENSE).
