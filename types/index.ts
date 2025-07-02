import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref } from 'vue'

export const waitlistSchema = toTypedSchema(z.object({
  email: z.string().email({
    message: 'Invalid email!',
  }),
}))

export const sendUniqueCodeSchema = toTypedSchema(z.object({
  email: z.string().email('Email is invalid!'),
}))

export const onboardingProfileSchema = toTypedSchema(z.object({
  first_name: z.string().min(1, {
    message: 'First name is required!',
  }),
  last_name: z.string().min(1, {
    message: 'Last name is required!',
  }),
}))

export const onboardingWorkspaceSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Name is required!'),
}))

export const signinFormSchema = toTypedSchema(z.object({
  code: z.string().max(8, {
    message: 'Code shouldn\'t be more than 8 characters.',
  }).min(8, {
    message: 'Code shouldn\'t be less than 8 characters.',
  }),
}))

export const twoFactorSetupSchema = toTypedSchema(z.object({
  code: z.array(z.coerce.string()).length(6, {
    message: 'Code shouldn\'t be less than 6 characters',
  }),
}))

export const registerSecurityKeysSchema = toTypedSchema(z.object({
  name: z.string().max(32, {
    message: 'Maximum name length 32 chars!',
  }).min(3, {
    message: 'Minimum name length 3 chars!',
  }),
}))

export const newProjectSchema = toTypedSchema(z.object({
  title: z.string({
    required_error: 'Title is required!',
  }).max(100, { message: 'Title must be at most 100 characters long.' }),
  status: z.string({
    required_error: 'Status is required!',
  }),
  priority: z.string({
    required_error: 'Priority is required!',
  }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
}))

export const newTaskSchema = toTypedSchema(z.object({
  name: z.string({
    required_error: 'Name is required!',
  }).max(100, { message: 'Name must be at most 100 characters long.' }),
  status: z.string({
    required_error: 'Status is required!',
  }),
  priority: z.string({
    required_error: 'Priority is required!',
  }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  subtasks: z.array(
    z.object({
      name: z.string(),
      is_completed: z.boolean().default(false),
    }),
  ).optional(),
}))
export interface Project {
  name: string
  tagline: string
  description: string
  highlights: string[]
  stack: TechStack[]
  github: string
  color: string
  website?: string
  is_working: boolean
  image_url: string
}

export interface TechStack {
  name: string
  icon: string
}

export interface User {
  id: string
  email: string
  username: string
  emailVerified: boolean
  registeredTOTP: boolean
  registeredPasskey: boolean
  registered2FA: boolean
  avatar: string
  twoFactorVerified: boolean
}

export type ModalType = 'joinWaitlist' | 'setupAuthenticatorApp' | 'setupPasskeys' | 'setupSecurityKeys' | 'signout' | 'addNewProject' | 'addNewTask' | 'setupPassword' | 'resetPassword' | 'transferOwnership' | 'deleteWorkspace' | 'mobileSidebar' | 'inviteTeammate' | 'notificationCenter' | 'changeTeammateRole' | 'totpAuthentication' | 'deleteAccount' | 'editProject' | 'editProjectTask' | 'createWorkspace'

export interface ModalData {
  qrcode?: string
  encodedTOTPKey?: string
  encodedCredentialUserId?: string
  user?: User
  encodedCredentialIds?: string[]
  projectId?: string
  project?: DBProject | null
}

export interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  data: ModalData
}

export interface WorkspaceBreadcrumb {
  name: string
  path: string
  children: WorkspaceBreadcrumb[] | null
}

export interface IProject { id: string, title: string, status: Status, priority: Priority, dueDate: Date | null, workspaceId: string }

export interface Workspace {
  id: string
  name: string
  imageUrl: string
  inviteCode: string
  createdAt: string
  updatedAt: string
  userRole: UserRole
}

export type UserRole = 'OWNER' | 'MEMBER' | 'GUEST'

export interface WorkspaceStore {
  isOpenSidebar: boolean
  breadcrumb: WorkspaceBreadcrumb | null
  task: {
    project: IProject
    data: Task
  } | null
  onboardingWorkspaceId: string | null
  activeWorkspace: Workspace | null
}

export interface IProjectColumn {
  description: string
  name: string
  icon: string
}

export const columns = ref<IProjectColumn[]>([
  {
    name: 'Idea',
    description: 'Raw thoughts or concepts not yet acted upon.',
    icon: 'hugeicons:ai-idea',
  },
  {
    name: 'Todo',
    description: 'Planned projects that are queued and ready to start.',
    icon: 'solar:clipboard-outline',
  },
  {
    name: 'In Progress',
    description: 'Projects currently being worked on.',
    icon: 'solar:alarm-outline',
  },
  {
    name: 'In Review',
    description: 'Projects completed but pending evaluation or feedback.',
    icon: 'solar:minimalistic-magnifer-bug-outline',
  },
  {
    name: 'Completed',
    description: 'Projects fully done and verified.',
    icon: 'solar:check-circle-outline',
  },
  {
    name: 'Abandoned',
    description: 'Projects intentionally discontinued or no longer relevant.',
    icon: 'solar:trash-bin-trash-outline',
  },
])

export const taskColumns = ref<IProjectColumn[]>([
  {
    name: 'Idea',
    description: 'Raw thoughts or concepts not yet acted upon.',
    icon: 'hugeicons:ai-idea',
  },
  {
    name: 'Todo',
    description: 'Planned tasks that are queued and ready to start.',
    icon: 'solar:clipboard-outline',
  },
  {
    name: 'In Progress',
    description: 'Tasks currently being worked on.',
    icon: 'solar:alarm-outline',
  },
  {
    name: 'In Review',
    description: 'Tasks completed but pending evaluation or feedback.',
    icon: 'solar:minimalistic-magnifer-bug-outline',
  },
  {
    name: 'Completed',
    description: 'Tasks fully done and verified.',
    icon: 'solar:check-circle-outline',
  },
  {
    name: 'Abandoned',
    description: 'Tasks intentionally discontinued or no longer relevant.',
    icon: 'solar:trash-bin-trash-outline',
  },
])

export const priorityOptions = [
  { name: 'High', value: 'HIGH', color: '#ef4444' },
  { name: 'Medium', value: 'MEDIUM', color: '#f59e0b' },
  { name: 'Low', value: 'LOW', color: '#10b981' },
  { name: 'None', value: 'NONE', color: '#9ca3af' },
]

export type Status = 'IDEA' | 'TODO' | 'IN PROGRESS' | 'IN REVIEW' | 'COMPLETED' | 'ABANDONED'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'
export interface IDBProject {
  description: string | null
  status: Status
  priority: Priority
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  title: string
  dueDate: Date | null
  user: {
    avatar: string
  }
}

export const validStatuses = ['IDEA', 'TODO', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED', 'ABANDONED']
export const validPriorities = ['HIGH', 'MEDIUM', 'LOW', 'NONE']

export interface Task {
  name: string
  status: Status
  priority: Priority
  id: string
  createdAt: Date | string
  updatedAt: Date | string
  description: string | null
  dueDate: Date | null | string
  projectId: string
  subtasks: Subtask[]
}

export interface Subtask {
  name: string
  id: string
  createdAt: Date | string
  updatedAt: Date | string
  taskId: string
  is_completed: boolean
}

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export interface IOauth {
  isSigninWithOauth: boolean
  provider: 'google' | 'github' | null
}

export interface OauthStore {
  oauth: IOauth
}

export type IAuthProvider = 'google' | 'github'

export interface Teammate {
  id: string
  avatar: string
  email: string
  username: string
}

export interface DBProject {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  dueDate: Date | null
  workspaceId: string
  createdAt: Date | string
  updatedAt: Date | string
}
