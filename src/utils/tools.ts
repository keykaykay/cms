import { RouterLink } from 'vue-router'
import { type MenuOption, NIcon } from 'naive-ui'
import type { AppRouteRecordRaw } from '@/router/types'

export const iconComp = (icon: string) => {
  return h('div', { class: icon })
}

export function renderIcon(name?: string) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('div', {
          class: name,
        }),
    })
}
export function renderLabel(name: string, path: string) {
  return () =>
    h(
      RouterLink,
      {
        to: path,
      },
      { default: () => name },
    )
}

export function renderMenuItem(menuRaw: AppRouteRecordRaw): MenuOption {
  return {
    key: menuRaw?.path,
    label: () =>
      h(
        'div',
        {
          class: 'w-100px flex items-center justify-center',
        },
        [
          h('div', { class: `${menuRaw?.meta?.icon || ''} text-xl` }),
          h('div', { class: 'ml-2' }, menuRaw?.meta?.title || ''),
        ],
      ),
  }
}
