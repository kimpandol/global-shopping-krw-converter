<script>
  import { onMount } from 'svelte';
  import { getCnyToKrwRate, getUsdToKrwRate } from './api.js';
  import { startConversion } from './converter.js';

  let displayRate = '로딩 중...';
  let isError = false;

  onMount(async () => {
    const host = window.location.hostname;

    try {
      if (host.includes('taobao.com') || host.includes('tmall.com')) {
        const rate = await getCnyToKrwRate();
        displayRate = `🇨🇳 1위안 = 🇰🇷 ${rate.toFixed(2)}원`;
        // @ts-ignore
        startConversion(rate, 'taobao');
      } 
      else if (host.includes('aliexpress.com')) {
        const rate = await getUsdToKrwRate();
        displayRate = `🇺🇸 1달러 = 🇰🇷 ${rate.toFixed(2)}원`;
        // @ts-ignore
        startConversion(rate, 'aliexpress');
      }
    } catch (err) {
      displayRate = '환율 오류';
      isError = true;
      console.error(err);
    }
  });
</script>

{#if displayRate !== '로딩 중...'}
<div class="converter-widget">
  <span>{displayRate}</span>
</div>
{/if}

<style>
  .converter-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 999999;
    pointer-events: none;
    font-family: sans-serif;
  }
</style>