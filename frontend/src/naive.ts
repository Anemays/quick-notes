// src/naive.ts
import {
  create,
  NButton,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutFooter,
  NCard,
  NForm,
  NFormItem,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
} from 'naive-ui'

export function createNaiveUI() {
  return create({
    components: [
      NButton,
      NInput,
      NLayout,
      NLayoutHeader,
      NLayoutContent,
      NLayoutFooter,
      NCard,
      NForm,
      NFormItem,
      NMessageProvider,
      NNotificationProvider,
      NDialogProvider,
    ],
  })
}
