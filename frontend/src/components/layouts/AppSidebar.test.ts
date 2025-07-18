import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppSidebar from './AppSidebar.vue';
import { ChevronBack, ChevronForward, Home } from '@vicons/ionicons5';

const globalStubs = {
  RouterLink: {
    template: '<a><slot></slot></a>',
    props: ['to'],
  },
  NIcon: {
    template: '<span class="n-icon"><slot></slot></span>',
    props: ['size'],
  },
};

describe('AppSidebar', () => {
  it('renders properly with collapse state', () => {
    const wrapper = mount(AppSidebar, {
      props: {
        collapsed: true,
      },
      global: {
        components: { ChevronBack, ChevronForward, Home },
        stubs: globalStubs,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props('collapsed')).toBe(true);
  });

  it('emits toggle event when clicked', async () => {
    const wrapper = mount(AppSidebar, {
      props: {
        collapsed: true,
      },
      global: {
        components: { ChevronBack, ChevronForward, Home },
        stubs: globalStubs,
      },
    });

    await wrapper.find('[data-test="toggle-button"]').trigger('click');
    expect(wrapper.emitted('toggle')).toBeTruthy();
  });
});
