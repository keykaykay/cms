<script lang="ts" setup>
import { NButton, NRadio, NRadioGroup, useMessage } from 'naive-ui'
import type { ITableProps } from '@/components/Table'
import type { IPerson } from '@/store/test'
import { useTestStore } from '@/store/test'

const router = useRouter()
const message = useMessage()
const testStore = useTestStore()

const tableProps = reactive<ITableProps<IPerson>>({
  tableLoading: true,
  data: testStore.data,
  virtualScroll: false,
  columns: [
    {
      title: '姓名',
      key: 'name',
      align: 'center',
      sorter: true,
    },
    {
      title: '年龄',
      key: 'age',
      sorter: true,
      render(row) {
        return h(NButton, {
          type: 'info',
          onClick: (el) => {
            el.stopPropagation()
            message.success(`${row.age}`)
          },
        }, {
          default: () => row.age,
        })
      },
    },
    {
      title: '性别',
      key: 'sex',
      editComp: h(NRadioGroup, {}, {
        default: () => ([
          h(NRadio, { value: 'male', label: '男' }),
          h(NRadio, { value: 'female', label: '女' }),
        ]),
      }),
      editValue: 'male',
    },
  ],
  pagination: {
    page: 1,
    pageSize: 20,
    itemCount: 100,
    showSizePicker: true,
    pageSizes: [20, 50, 100],
    onChange: async (page: number) => {
      tableProps.pagination && (tableProps.pagination.page = page)
      tableProps.tableLoading = true
      await testStore.fetchData()
      tableProps.tableLoading = false
    },
    onUpdatePageSize: async (pageSize: number) => {
      if (tableProps.pagination) {
        tableProps.pagination.pageSize = pageSize
        tableProps.pagination.page = 1
      }
      tableProps.tableLoading = true
      await testStore.fetchData()
      tableProps.tableLoading = false
    },
  },
  refreshEvent: async () => {
    tableProps.tableLoading = true
    await testStore.fetchData()
    tableProps.tableLoading = false
  },
  addEditSureEvent: async (type, data, idx) => {
    type === 'add' && tableProps.data.push(data)
    type === 'edit' && tableProps.data.splice(idx, 1, data)
    return true
  },
  rowCellDeleteEvent(idx) {
    tableProps.data.splice(idx, 1)
  },
  rowCellClickEvent(data, idx) {
    router.push('/device/detail')
  },
  sortEvent(options) {
    options.order = 'descend'
  },
  searchEvent(query) {
    tableProps.tableLoading = true
    console.error(query)
    setTimeout(() => {
      tableProps.tableLoading = false
    }, 1000)
  },
})

onMounted(async () => {
  tableProps.tableLoading = true
  await testStore.fetchData()
  tableProps.tableLoading = false
  nextTick(async () => {
    tableProps.tableLoading = true
    // await testStore.fetchData()
    tableProps.tableLoading = false
  })
})
</script>

<template>
  <div class="w-full h-full">
    <Table v-bind="tableProps" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 设备清单
  order: 1
  icon: i-fa6-solid:rectangle-list
</route>
