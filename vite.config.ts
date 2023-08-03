import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetIcons, presetUno } from 'unocss'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_APP_TITLE } = env
  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true,
      }),
      Pages({
        dirs: 'src/pages',
        extensions: ['vue', 'js', 'jsx', 'tsx'],
      }),
      Layouts(),
      createHtmlPlugin({
        minify: isBuild,
        inject: {
          data: {
            title: VITE_APP_TITLE,
          },
        },
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue/macros',
          '@vueuse/core',
          'pinia',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        extensions: ['vue', 'md'],
        resolvers: [NaiveUiResolver()],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/types/components.d.ts',
      }),
      Unocss({
        presets: [
          presetUno(),
          presetIcons({
            warn: true,
          }),
        ],
        safelist: [
          'i-ic:round-space-dashboard',
          'i-ep:refresh-right',
          'i-ep:close',
          'i-ant-design:column-width-outlined',
          'i-ic:baseline-minus',
          'i-ri:upload-cloud-fill',
          'i-fa6-solid:rectangle-list',
          'hover:text-#1e90ffFF',
          'color-#70a1ffFF',
        ],
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: true,
      }),
    ],
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      },
    },
    server: {
      host: true,
      open: true,
      port: 4012,
    },
  }
}
