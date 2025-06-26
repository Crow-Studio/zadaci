import type { ModalData, ModalStore, ModalType } from '~/types'

export const useModalStore = defineStore('modalStore', {
  state: (): ModalStore => ({
    isOpen: false,
    type: null,
    data: {},
  }),
  actions: {
    onOpen(payload: ModalType): void {
      this.type = payload
    },
    onClose(): void {
      this.type = null
    },
    setIsOpen(payload: boolean): void {
      this.isOpen = payload
    },
    setModalData(payload: ModalData): void {
      this.data = payload
    },
  },
  persist: true,
})
