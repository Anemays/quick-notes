import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from './HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/notes', component: { template: '<div>Notes</div>' } },
  ],
});

describe('HomeView', () => {
  it('renders properly', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockRouter],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Quick Notes');
    expect(wrapper.text()).toContain('Simple. Fast. Organized.');
    expect(wrapper.text()).toContain('Create Notes');
    expect(wrapper.text()).toContain('Dark Mode');
    expect(wrapper.text()).toContain('Get Started');
  });
});
