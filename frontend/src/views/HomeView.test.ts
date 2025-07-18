import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from './HomeView.vue';
import TheWelcome from '../components/TheWelcome.vue';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          TheWelcome: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Tailwind Aktif ✔');
    expect(wrapper.findComponent(TheWelcome).exists()).toBe(true);
  });
});
