import type { VNode } from 'vue'
import { createVNode, defineComponent, h, reactive, render } from 'vue'
import Loading from './Loading.vue'

type Nullable<T> = T | null
export interface LoadingProps {
  loading: boolean
}

export function createLoading(props?: Partial<LoadingProps>, target?: HTMLElement) {
  let vm: Nullable<VNode> = null
  const data = reactive({
    loading: true,
    ...props,
  })

  const LoadingWrap = defineComponent({
    render() {
      return h(Loading, { ...data })
    },
  })

  vm = createVNode(LoadingWrap)

  render(vm, document.createElement('div'))

  function close() {
    if (vm?.el && vm.el.parentNode)
      vm.el.parentNode.removeChild(vm.el)
  }

  function open(target: HTMLElement = document.body) {
    if (!vm || !vm.el)
      return

    target.appendChild(vm.el as HTMLElement)
  }

  if (target)
    open(target)

  return {
    vm,
    close,
    open,
    setLoading: (loading: boolean) => {
      data.loading = loading
    },
    get loading() {
      return data.loading
    },
    get $el() {
      return vm?.el as HTMLElement
    },
  }
}
