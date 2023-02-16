# 中后台系统管理模版

> 项目持续开发中...

## 项目采用技术

- 基于 naive-ui
- Vue3 Typescript pinia vueuse
- 采用 vite-plugin-pages vite-plugin-vue-layouts 自动加载路由

## 功能点

- [x] 暗黑主题切换
- [x] 登录页
- [x] 左侧菜单和顶部菜单
- [ ] 底部菜单
- [ ] 封装表单组件
  - [ ] 表头
    - [x] 添加
    - [ ] 导出 xlsx
    - [x] 设置
    - [x] 全屏
  - [ ] 表格
    - [x] 右键编辑和删除
    - [x] 排序
  - [ ] 尾部
    - [x] 预留插槽

### pnpm 报依赖错误
```shell
rm -rf $(pnpm store path)
```
