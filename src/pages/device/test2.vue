<script lang="ts" setup>
import type { ITableProps } from '@/components/Table'

interface ISong {
  date: number
  name: string
  address: string
  button: string
}

const tableProps = ref<ITableProps<ISong>>({
  hiddenHeader: true,
  columns: [
    {
      title: 'No',
      key: 'date',
      align: 'center',
      width: 150,
    },
    {
      title: 'Title',
      key: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Length',
      key: 'address',
      align: 'center',
      width: 150,
    },
  ],
  data: new Array(30).fill(0).map((_, idx) => ({
    date: idx,
    name: `Tom-${idx}-${idx}`,
    address: `No.${idx}-${idx}-${idx}`,
    button: `${idx}-btn`,
  })),
  pagination: {
    page: 1,
    pageSize: 20,
    itemCount: 100,
    showSizePicker: true,
    pageSizes: [20, 50, 100],
    onChange: (page: number) => {
      tableProps.value.pagination && (tableProps.value.pagination.page = page)
    },
    onUpdatePageSize: (pageSize: number) => {
      if (tableProps.value.pagination) {
        tableProps.value.pagination.pageSize = pageSize
        tableProps.value.pagination.page = 1
      }
    },
  },
})

// const columns: DataTableColumn<ISong>[] = [
//   {
//     title: 'No',
//     key: 'date',
//     align: 'center',
//     width: 150,
//   },
//   {
//     title: 'Title',
//     key: 'name',
//     align: 'center',
//     width: 150,
//   },
//   {
//     title: 'Length',
//     key: 'address',
//     align: 'center',
//     width: 150,
//   },
// ]
// const tableData: ISong[] = new Array(100).fill(0).map((_, idx) => ({
//   date: idx,
//   name: `Tom-${idx}-${idx}`,
//   address: `No.${idx}-${idx}-${idx}`,
//   button: `${idx}-btn`,
// }))

// const pagination = reactive<PaginationProps>({
//   page: 1,
//   pageSize: 20,
//   itemCount: 100,
//   showSizePicker: true,
//   pageSizes: [20, 50, 100],
//   onChange: (page: number) => {
//     pagination.page = page
//   },
//   onUpdatePageSize: (pageSize: number) => {
//     pagination.pageSize = pageSize
//     pagination.page = 1
//   },
// })
const loading = ref(true)

setTimeout(() => {
  loading.value = false
}, 2000)
</script>

<template>
  <div class="w-full h-full">
    <n-card class="w-full h-full">
      <!-- <n-data-table
        v-loading="loading"
        class="w-full h-full"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :single-line="false"
        max-height="100%"
        flex-height
        remote
      /> -->
      <Table v-bind="tableProps" />
    </n-card>
  </div>
</template>

<style scoped>
::v-deep(.n-data-table-base-table-header) {
  overflow: hidden;
}
</style>

<route lang="yaml">
meta:
  title: test2
  order: 4
  icon: i-fa6-solid:rectangle-list
</route>
