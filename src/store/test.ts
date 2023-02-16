export interface IPerson {
  name: string
  age: number
  sex: 'male' | 'female'
}

interface ITest {
  data: IPerson[]
}

export const useTestStore = defineStore({
  id: 'test',
  state: (): ITest => ({
    data: [],
  }),
  getters: {

  },
  actions: {
    async fetchData() {
      return new Promise<void>((resolve) => {
        this.data.length = 0
        for (let index = 0; index < 20; index++) {
          this.data.push({
            name: `${Math.floor((Date.now() + index * index) / 2)}-${index}`,
            age: Date.now() + index * index,
            sex: (Date.now() + index * index) % 2 === 0 ? 'male' : 'female',
          })
        }
        setTimeout(() => {
          resolve()
        }, 250)
      })
    },
  },
})
