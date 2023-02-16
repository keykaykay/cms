<script lang="ts" setup>
import { NButton, NRadio, NRadioGroup, useMessage } from 'naive-ui'
import type { ITableProps } from '@/components/Table'
import type { IPerson } from '@/store/test'
import { useTestStore } from '@/store/test'
import Table from '@/components/Table'

const router = useRouter()
const message = useMessage()
const testStore = useTestStore()

const tableProps = ref<ITableProps<IPerson>>({
  tableLoading: true,
  data: testStore.data,
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
      tableProps.value.pagination && (tableProps.value.pagination.page = page)
      tableProps.value.tableLoading = true
      await testStore.fetchData()
      tableProps.value.tableLoading = false
    },
    onUpdatePageSize: async (pageSize: number) => {
      if (tableProps.value.pagination) {
        tableProps.value.pagination.pageSize = pageSize
        tableProps.value.pagination.page = 1
      }
      tableProps.value.tableLoading = true
      await testStore.fetchData()
      tableProps.value.tableLoading = false
    },
  },
  refreshEvent: async () => {
    tableProps.value.tableLoading = true
    await testStore.fetchData()
    tableProps.value.tableLoading = false
  },
  addEditSureEvent: async (type, data, idx) => {
    type === 'add' && tableProps.value.data.push(data)
    type === 'edit' && tableProps.value.data.splice(idx, 1, data)
    return true
  },
  rowCellDeleteEvent(idx) {
    tableProps.value.data.splice(idx, 1)
  },
  rowCellClickEvent(data, idx) {
    router.push('/device/detail')
  },
  sortEvent(options) {
    options.order = 'descend'
  },
  searchEvent(query) {
    tableProps.value.tableLoading = true
    console.error(query)
    setTimeout(() => {
      tableProps.value.tableLoading = false
    }, 1000)
  },
})

onMounted(async () => {
  await testStore.fetchData()
  tableProps.value.tableLoading = false
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
