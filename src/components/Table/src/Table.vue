<script lang="ts" setup>
import type { VNode } from 'vue'
import Draggable from 'vuedraggable'
import type {
  DataTableSortState,
  DropdownOption,
  FormInst,
  FormRules,
  PaginationProps,
} from 'naive-ui'
import type { TAddEditTable, TCheckbox, TDataColumn } from '../types'
import { useMobile } from '@/hooks/useDevice'
import { renderIcon } from '@/utils/tools'

export interface ITableProps<T = any> {
  /**
   * 是否隐藏默认header
   */
  hiddenHeader?: boolean
  /**
   * 是否隐藏头部搜索组件
   */
  hiddenHeaderSearch?: boolean
  /**
   * 是否隐藏头部操作组件
   */
  hiddenHeaderHandle?: boolean
  /**
   * 需要展示的列
   */
  columns: TDataColumn<T>[]
  /**
   * 需要展示的数据
   */
  data: T[]
  /**
   * 分页选项
   */
  pagination?: PaginationProps
  /**
   * 是否开启虚拟列表,默认开启
   */
  virtualScroll?: boolean
  /**
   * 是否展示loading
   */
  tableLoading?: boolean
  /**
   * 排序事件
   * @param options 排序选项(DataTableSortState)
   */
  sortEvent?: (options: DataTableSortState) => void
  /**
   * 单元行点击事件
   * @param rowData 当前rowCell的数据(数据type)
   * @param rowIndex 当前索引(number)
   */
  rowCellClickEvent?: (rowData: T, rowIndex: number) => void
  /**
   * 单元行删除事件
   * @param rowIndex 当前索引
   */
  rowCellDeleteEvent?: (rowIndex: number) => void
  /**
   * 添加或编辑确认事件
   * @param type 类型
   * @param data 最终数据(数据type)
   * @param index 编辑状态的索引
   */
  addEditSureEvent?: <U extends TAddEditTable['type']>(
    type: U,
    data: T,
    index: Extract<TAddEditTable, { type: U }>['index']
  ) => Promise<boolean>
  /**
   * 刷新事件
   */
  refreshEvent?: () => void
  /**
   * 搜索事件
   * @param query 搜索参数
   */
  searchEvent?: (query: T) => void
}

const props = withDefaults(defineProps<ITableProps>(), {
  virtualScroll: true,
  hiddenHeader: false,
  hiddenHeaderSearch: false,
  hiddenHeaderHandle: false,
})

const isAdd = ref(true)
const modal = ref(false)

// 排序
const handleSorterChange = (options: DataTableSortState) => {
  if (!props.sortEvent) {
    console.warn('请传递sortEvent参数')
    return
  }
  props.sortEvent?.(options)
}

// 数据
const chooseColumnsRaw = ref<TCheckbox[]>(
  props.columns.map(item => ({
    label: item.title,
    value: item.key,
    checked: true,
    fixed: item.fixed,
  }) as TCheckbox),
)
const columns = computed((): TDataColumn[] => {
  return chooseColumnsRaw.value
    .filter(item => item.checked)
    .map((item) => {
      const target = props.columns.find(
        columnItem => columnItem.key === item.value,
      ) as TDataColumn
      return {
        ...target,
        fixed: item.fixed,
      }
    })
})
const data = ref(props.data)

// header事件
const cardRef = ref<HTMLElement>()
const { isFullscreen: tableFullscreen, toggle: tableToggle }
  = useFullscreen(cardRef)

const handleAddEvent = () => {
  isAdd.value = true
  modal.value = true
}

// 固定column
const { isMobile } = useMobile()
const tableRef = ref<any>()
const scrollX = ref(0)
const handleScrollX = () => {
  const scrollWidth = tableRef.value.$el.scrollWidth
  const columnWidth = columns.value.reduce((pre, val) => {
    return pre + (val.width ? Number(val.width) : 200)
  }, 0)
  if (columnWidth > scrollWidth)
    scrollX.value = columnWidth
  else scrollX.value = scrollWidth
}

watch([isMobile, tableRef], () => {
  if (tableRef.value?.$el)
    handleScrollX()
})

const handleFixed = (fixed: 'left' | 'right' | undefined, el: TDataColumn) => {
  el.fixed = fixed
}

// table row 右键事件
const showDropdown = ref(false)
const xRef = ref(0)
const yRef = ref(0)
const editRawData = ref<{
  data: unknown
  index: number
}>()
const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit',
    icon: renderIcon('i-material-symbols:edit-square-outline'),
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete',
    icon: renderIcon('i-ep:delete color-red'),
  },
]
const onClickoutside = () => {
  showDropdown.value = false
}
const handleSelect = (key: string) => {
  showDropdown.value = false
  switch (key) {
    case 'edit':
      modal.value = true
      break
    case 'delete':
      !(props.rowCellDeleteEvent) && console.warn('请传递rowCellDeleteEvent参数')
      props.rowCellDeleteEvent?.(editRawData.value?.index || 0)
      break
    default:
      break
  }
}
const handleRowProps = (rowData: unknown, rowIdx: number) => {
  return {
    onContextmenu: async (e: MouseEvent) => {
      e.preventDefault()
      showDropdown.value = false
      await nextTick()
      showDropdown.value = true
      xRef.value = e.clientX
      yRef.value = e.clientY
      editRawData.value = {
        data: rowData,
        index: rowIdx,
      }
      isAdd.value = false
    },
    onclick: () => {
      if (!props.rowCellClickEvent) {
        console.warn('请传递rowCellClickEvent参数')
        return
      }
      props.rowCellClickEvent?.(rowData, rowIdx)
    },
  }
}
// edit or add
interface IModalData {
  label: string
  value: any
  comp?: VNode
  path: string
}
interface IFormData {
  [key: string]: any
}

const formItemOptions = ref<IModalData[]>([])
const formModelData = ref<IFormData>({})
const rawFormOptions = props.columns
  .filter(item => !(item.edit === false))
  .map(item => ({
    label: item.title as string,
    value: item.editValue || null,
    comp: item.editComp,
    path: item.key as string,
  }))
const formRules = ref<FormRules>(
  props.columns
    .filter(item => !(item.edit === false))
    .reduce((pre, item) => {
      pre[item.key] = {
        required: true,
        message: `请输入${item.title}`,
      }
      return pre
    }, {} as any),
)
const modalLoading = ref(false)
const modalTitle = ref<string>()
const modalRef = ref<HTMLElement>()
const modalFromRef = ref<FormInst | null>(null)
const { isFullscreen: modalFullscreen, toggle: modalToggle }
  = useFullscreen(modalRef)
const handleEditOrAddEvent = (e: MouseEvent) => {
  e.preventDefault()
  if (!props.addEditSureEvent) {
    console.warn('请传递addEditSureEvent参数')
    return
  }
  modalFromRef.value?.validate(async (errors) => {
    if (!errors) {
      modalLoading.value = true
      const type = isAdd.value ? 'add' : 'edit'
      const result
        = (await props.addEditSureEvent?.(
          type,
          formModelData.value,
          editRawData.value?.index || 0,
        )) || false
      result && (modal.value = false)
      modalLoading.value = false
    }
  })
}
watch(
  [modal],
  () => {
    if (isAdd.value) {
      modalTitle.value = '添加信息'
      formItemOptions.value = rawFormOptions
    }
    else {
      modalTitle.value = '编辑信息'
      formItemOptions.value = props.columns
        .filter(item => !(item.edit === false))
        .map(item => ({
          label: item.title as string,
          value: item.editComp
            ? (editRawData.value?.data as any)[item.key]
            : String((editRawData.value?.data as any)[item.key]),
          comp: item.editComp,
          path: item.key as string,
        }))
    }
    formModelData.value = formItemOptions.value.reduce((pre, item) => {
      pre[item.path] = item.value
      return pre
    }, {} as IFormData)
  },
  {
    immediate: true,
  },
)

const searchFormModelData = ref<IFormData>(rawFormOptions.reduce((pre, item) => {
  pre[item.path] = item.value
  return pre
}, {} as IFormData))
const searchCollapsed = ref(true)
const searchFormItemOptions = computed<IModalData[]>(() => {
  if (searchCollapsed.value)
    return rawFormOptions.slice(0, 2)

  else
    return rawFormOptions
})

const handleSearchResetEvent = () => {
  searchFormModelData.value = rawFormOptions.reduce((pre, item) => {
    pre[item.path] = item.value
    return pre
  }, {} as IFormData)
  data.value = props.data
}

const handleSearchQueryEvent = () => {
  if (!props.searchEvent) {
    console.warn('请传递searchEvent参数')
    return
  }
  props.searchEvent(searchFormModelData.value)
}
</script>

<template>
  <n-card
    ref="cardRef" class="w-full h-full"
  >
    <template #header>
      <slot name="header">
        <div v-if="!hiddenHeader && (!hiddenHeaderSearch || !hiddenHeaderHandle)">
          <div v-if="!hiddenHeaderSearch">
            <n-form
              ref="modalFromRef"
              class="mb-2"
              label-placement="left"
              :label-width="100"
              :model="searchFormModelData"
            >
              <div
                class="grid gap-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 items-center"
              >
                <n-form-item
                  v-for="item in searchFormItemOptions"
                  :key="item.label"
                  class="h-10"
                  :label="item.label"
                  :path="item.path"
                >
                  <component
                    :is="item.comp"
                    v-if="item.comp"
                    v-model:value="searchFormModelData[item.path]"
                    class="w-full"
                    clearable
                  />
                  <n-input
                    v-else
                    v-model:value="searchFormModelData[item.path]"
                    :placeholder="`请输入${item.label}`"
                    clearable
                  />
                </n-form-item>
              </div>
              <div class="h-10 w-full flex justify-end">
                <div class="grid gap-3 grid-cols-3 items-center">
                  <n-button strong secondary type="tertiary" @click="handleSearchResetEvent">
                    重置
                  </n-button>
                  <n-button type="info" @click="handleSearchQueryEvent">
                    查询
                  </n-button>
                  <n-button dashed @click="searchCollapsed = !searchCollapsed">
                    展开
                    <template #icon>
                      <div :class="[searchCollapsed ? 'i-ic:baseline-keyboard-arrow-down' : 'i-ic:baseline-keyboard-arrow-up']" />
                    </template>
                  </n-button>
                </div>
              </div>
            </n-form>
            <div class="h-2 bg-gray-100" />
          </div>
          <div v-if="!hiddenHeaderHandle" class="mt-2 flex justify-between">
            <div>
              <n-button type="info" @click="handleAddEvent">
                新建
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
              </n-button>
            </div>
            <div class="grid gap-3 grid-cols-4 items-center text-22px">
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <div
                    class="cursor-pointer i-mingcute:refresh-1-line"
                    @click="refreshEvent"
                  />
                </template>
                <span>刷新</span>
              </n-tooltip>
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <div class="cursor-pointer i-bx:export" />
                </template>
                <span>导出</span>
              </n-tooltip>
              <n-popover trigger="click">
                <template #trigger>
                  <n-tooltip trigger="hover" placement="bottom">
                    <template #trigger>
                      <div class="cursor-pointer i-ic:sharp-settings" />
                    </template>
                    <span>设置</span>
                  </n-tooltip>
                </template>
                <n-scrollbar class="w-200px max-h-300px">
                  <Draggable
                    :list="chooseColumnsRaw"
                    animation="300"
                    item-key="key"
                  >
                    <template #item="{ element }">
                      <div
                        class="w-full h-6 text-xl mb-2 flex items-center justify-between hover:bg-gray-100"
                      >
                        <n-tooltip trigger="hover" placement="left">
                          <template #trigger>
                            <div class="cursor-move i-ri:drag-move-2-fill" />
                          </template>
                          <span>拖动调整顺序</span>
                        </n-tooltip>
                        <n-checkbox
                          v-model:checked="element.checked"
                          class="w-30"
                          :value="element.value"
                          :label="element.label"
                        />
                        <div class="flex justify-between w-12">
                          <n-tooltip trigger="hover" placement="bottom">
                            <template #trigger>
                              <div
                                class="cursor-pointer i-system-uicons:push-left"
                                :class="{
                                  'color-#70a1ff': element.fixed === 'left',
                                }"
                                @click="
                                  handleFixed(
                                    element.fixed === 'left' ? undefined : 'left',
                                    element,
                                  )
                                "
                              />
                            </template>
                            <span>固定左侧</span>
                          </n-tooltip>
                          <n-tooltip trigger="hover" placement="bottom">
                            <template #trigger>
                              <div
                                class="cursor-pointer i-system-uicons:push-right"
                                :class="{
                                  'color-#70a1ff': element.fixed === 'right',
                                }"
                                @click="
                                  handleFixed(
                                    element.fixed === 'right'
                                      ? undefined
                                      : 'right',
                                    element,
                                  )
                                "
                              />
                            </template>
                            <span>固定右侧</span>
                          </n-tooltip>
                        </div>
                      </div>
                    </template>
                  </Draggable>
                </n-scrollbar>
              </n-popover>
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <div
                    class="cursor-pointer"
                    :class="[
                      tableFullscreen
                        ? 'i-ic:baseline-fullscreen-exit'
                        : 'i-ic:baseline-fullscreen',
                    ]"
                    @click="tableToggle"
                  />
                </template>
                <span>{{ tableFullscreen ? '退出全屏' : '进入全屏' }}</span>
              </n-tooltip>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <template #default>
      <n-data-table
        ref="tableRef"
        v-loading="tableLoading"
        class="flex-1 w-full h-full"
        max-height="100%"
        flex-height
        :single-line="false"
        v-bind="props"
        :columns="columns"
        :data="data"
        :scroll-x="scrollX"
        :row-props="handleRowProps"
        virtual-scroll
        remote
        @update:sorter="handleSorterChange"
      />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </n-card>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
  <n-modal
    :show="modal"
    transform-origin="center"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <n-card
      ref="modalRef"
      v-loading="modalLoading"
      class="w-95/100"
      :title="modalTitle"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
    >
      <template #header-extra>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="cursor-pointer text-2xl"
              :class="[
                modalFullscreen
                  ? 'i-ic:baseline-fullscreen-exit'
                  : 'i-ic:baseline-fullscreen',
              ]"
              @click="modalToggle"
            />
          </template>
          <span>{{ modalFullscreen ? '退出全屏' : '进入全屏' }}</span>
        </n-tooltip>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="i-ic:baseline-close cursor-pointer text-2xl"
              @click="modal = false"
            />
          </template>
          <span>关闭</span>
        </n-tooltip>
      </template>
      <n-form
        ref="modalFromRef"
        label-placement="left"
        :label-width="100"
        :model="formModelData"
        :rules="formRules"
      >
        <div
          class="grid gap-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center"
        >
          <n-form-item
            v-for="item in formItemOptions"
            :key="item.label"
            :label="item.label"
            :path="item.path"
          >
            <component
              :is="item.comp"
              v-if="item.comp"
              v-model:value="formModelData[item.path]"
              class="w-full"
              clearable
            />
            <n-input
              v-else
              v-model:value="formModelData[item.path]"
              :placeholder="`请输入${item.label}`"
              clearable
            />
          </n-form-item>
        </div>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="modal = false">
            取消
          </n-button>
          <n-button type="info" @click="handleEditOrAddEvent">
            确认
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* 由于开启虚拟列表导致单元格下边框失效 */
::v-deep(.n-data-table-td) {
  border-bottom: 1px solid var(--n-merged-border-color) !important;
}
/* 禁止移动端tableheader滚动 */
::v-deep(.n-data-table-base-table-header) {
  overflow: hidden;
}
</style>
