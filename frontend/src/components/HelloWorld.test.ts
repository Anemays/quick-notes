import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from './HelloWorld.vue';

describe('HelloWorld', () => {
  it('renders message properly', () => {
    const msg = 'Hello Vue 3';
    const wrapper = mount(HelloWorld, {
      props: { msg },
    });

    expect(wrapper.text()).toContain(msg);
  });

  it('contains Vite and Vue 3 links', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' },
    });

    const links = wrapper.findAll('a');
    const hrefs = links.map((link) => link.attributes('href'));

    expect(hrefs).toContain('https://vite.dev/');
    expect(hrefs).toContain('https://vuejs.org/');
  });
});
