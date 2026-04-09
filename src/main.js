import { mount } from 'svelte';
import App from './App.svelte';

const div = document.createElement('div');
div.id = 'svelte-global-converter-root';
document.body.appendChild(div);

mount(App, {
  target: div,
});