import type { WorkspaceStore, WorkspaceBreadcrumb, IProject, Task, Workspace } from '~/types'

export const useWorkspaceStore = defineStore('workspaceStore', {
  state: (): WorkspaceStore => ({
    isOpenSidebar: false,
    breadcrumb: null,
    task: null,
    onboardingWorkspaceId: null,
    activeWorkspace: null,
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
    onSetOnboardingWorkspaceId(payload: string | null): void {
      this.onboardingWorkspaceId = payload
    },
    onSetActiveWorkspace(payload: Workspace | null): void {
      this.activeWorkspace = payload
    },
  },
  persist: true,
})
