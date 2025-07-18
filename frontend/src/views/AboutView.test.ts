import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AboutView from './AboutView.vue';

describe('AboutView', () => {
  it('renders properly', () => {
    const wrapper = mount(AboutView);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('This is an about page');
  });
});
