import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WelcomeItem from './WelcomeItem.vue';

describe('WelcomeItem', () => {
  it('renders all slots properly', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        icon: '<div class="test-icon">Icon</div>',
        heading: 'Test Heading',
        default: 'Test Content',
      },
    });

    expect(wrapper.find('.test-icon').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('Test Heading');
    expect(wrapper.text()).toContain('Test Content');
  });

  it('has proper layout classes', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        default: 'Test',
      },
    });

    expect(wrapper.find('.item').exists()).toBe(true);
    expect(wrapper.find('.details').exists()).toBe(true);
  });
});
