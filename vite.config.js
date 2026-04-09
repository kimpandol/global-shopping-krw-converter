import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    svelte(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'Global KRW Converter (Taobao & Ali)',
        namespace: 'npm/vite-plugin-monkey',
        match: [
          '*://*.taobao.com/*',
          '*://*.tmall.com/*',
          '*://*.aliexpress.com/*'
        ],
        grant: ['GM_xmlhttpRequest', 'GM_getValue', 'GM_setValue'],
      },
    }),
  ],
});