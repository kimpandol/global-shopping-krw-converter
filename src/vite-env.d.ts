/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />
declare module '*.svelte' {
  const component: any;
  export default component;
}