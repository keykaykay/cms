import { createFetch } from '@vueuse/core'
import type { CreateFetchOptions } from '@vueuse/core'
import { VITE_BASE_URL } from '@/utils/constants'

class Http {
  private instance: typeof useFetch

  constructor(config: CreateFetchOptions) {
    this.instance = createFetch({
      ...config,
      options: {
        beforeFetch({ options }) {
          console.error(options)
          return { options }
        },
      },
      fetchOptions: {},
    })
  }

  get({ url, payload }: { url: string; payload?: any }) {
    const params = new URLSearchParams(payload)
    const resultUrl = `${url}?${params.toString()}`
    return this.instance(resultUrl).get().json()
  }

  post({ url, payload }: { url: string; payload?: any }) {
    return this.instance(url).post(payload).json()
  }
}

export const httpInstance = new Http({
  baseUrl: VITE_BASE_URL,
})
