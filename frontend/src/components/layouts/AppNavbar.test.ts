import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppNavbar from './AppNavbar.vue';

describe('AppNavbar', () => {
  it('renders properly', () => {
    const wrapper = mount(AppNavbar);
    expect(wrapper.exists()).toBe(true);
  });
});
