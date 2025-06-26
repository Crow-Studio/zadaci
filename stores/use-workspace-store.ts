import type { WorkspaceStore, WorkspaceBreadcrumb, IProject, Task } from '~/types'

export const useWorkspaceStore = defineStore('workspaceStore', {
  state: (): WorkspaceStore => ({
    isOpenSidebar: false,
    breadcrumb: null,
    task: null,
  }),
  actions: {
    onOpenSidebar(): void {
      this.isOpenSidebar = !this.isOpenSidebar
    },
    onSetWorkspaceBreadcrumb(payload: WorkspaceBreadcrumb): void {
      this.breadcrumb = payload
    },
    onSetTask(payload: { project: IProject, data: Task } | null): void {
      this.task = payload
    },
  },
  persist: true,
})
