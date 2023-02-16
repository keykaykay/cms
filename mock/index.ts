import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'

export default [
  {
    url: '/api/test',
    method: 'get',
    timeout: 200,
    response: (req: any) => {
      console.log(req)
      return {
        'code|1-200': 1,
        'data|1-5': {
          token: Random.image(),
        },
      }
    },
  },
] as MockMethod[]
