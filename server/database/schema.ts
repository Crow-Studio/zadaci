import { type InferSelectModel, relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['OWNER', 'MEMBER', 'GUEST'])
export const statusEnum = pgEnum('status', ['IDEA', 'TODO', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED', 'ABANDONED'])
export const priorityEnum = pgEnum('priority', ['HIGH', 'MEDIUM', 'LOW', 'NONE'])
export const subscriptionPlanEnum = pgEnum('plan', ['FREE', 'PRO'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['INACTIVE', 'ACTIVE'])

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  password: text('password'),
  email_verified: boolean('email_verified').notNull().default(false),
  registered_2fa: boolean('registered_2fa').notNull().default(false),
  recovery_code: text('recovery_code').notNull(),
  profile_picture_url: text('profile_picture_url'),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const uniqueCodeTable = pgTable('unique_code_request', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const workspaceTable = pgTable('workspace', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image_url: text('image_url').notNull(),
  invite_code: text('invite_code').notNull().unique(),
  user_id: text('user_id').notNull().references(() => userTable.id),
  subscription_plan: subscriptionPlanEnum('subscription_plan').default('FREE'),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const polarCustomers = pgTable('polar_customers', {
  id: uuid('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  organizationId: uuid('organization_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const subscriptionTable = pgTable('subscription', {
  id: text('id').primaryKey(),
  workspace_id: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  subscription_status: subscriptionStatusEnum('subscription_status').default('INACTIVE'),
  expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const billingEventsTable = pgTable('billing_events', {
  id: text('id').primaryKey(),
  workspace_id: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  event_type: varchar('event_type', { length: 255 }),
  payload: jsonb('payload').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const workspaceMembersTable = pgTable('workspace_members', {
  id: text('id').primaryKey(),
  role: userRoleEnum('role').notNull().default('MEMBER'),
  user_id: text('user_id').notNull().references(() => userTable.id),
  workspace_id: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const sessionTable = pgTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  two_factor_verified: boolean('two_factor_verified').notNull().default(false),
  ip_address: varchar('ip_address', { length: 100 }),
  location: text('location'),
  device: text('device'),
  browser: text('browser'),
  os: text('os'),
})

export const passwordResetSession = pgTable('password_reset_session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }).notNull(),
  expires_at: integer('expires_at').notNull(),
  email_verified: boolean('email_verified').notNull().default(false),
  two_factor_verified: boolean('two_factor_verified').notNull().default(false),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const totpCredential = pgTable('totp_credential', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: text('user_id').notNull().unique().references(() => userTable.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const passkeysTable = pgTable('passkeys', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  public_key: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  backed_up: boolean('backed_up').notNull().default(false),
  transports: text('transports').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const workspaceInviteRequest = pgTable('workspace_invite_request', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('MEMBER'),
  workspace_id: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  invited_by: varchar('invited_by', { length: 255 }).notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const oauthAccountTable = pgTable('oauth_account', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  provider_user_id: text('provider_user_id').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
}, table => ({
  providerUserIndex: index('provider_user_unique').on(table.provider, table.provider_user_id),
}))

export const cronJobTable = pgTable('cron_jobs', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  message: text('message'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
})

export const projectTable = pgTable('project', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').default('IDEA').notNull(),
  priority: priorityEnum('priority').default('NONE').notNull(),
  workspace_id: text('workspace_id').notNull().references(() => workspaceTable.id, { onDelete: 'cascade' }),
  due_date: timestamp('due_date', { mode: 'date' }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const projectMembers = pgTable('project_members', {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
  member_id: text('member_id').notNull().references(() => workspaceMembersTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const tasksTable = pgTable('tasks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: statusEnum('status').default('IDEA').notNull(),
  priority: priorityEnum('priority').default('NONE').notNull(),
  project_id: text('project_id').notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
  due_date: timestamp('due_date', { mode: 'date' }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

export const taskAssigneesTable = pgTable('task_assignees', {
  id: text('id').primaryKey(),
  task_id: text('task_id').notNull().references(() => tasksTable.id, { onDelete: 'cascade' }),
  member_id: text('member_id').notNull().references(() => workspaceMembersTable.id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at', { mode: 'date', precision: 3 }).notNull(),
})

export const tasksActivityTable = pgTable('tasks_activity', {
  id: text('id').primaryKey(),
  status: statusEnum('status').default('IDEA').notNull(),
  task_id: text('task_id').notNull().references(() => tasksTable.id, { onDelete: 'cascade' }),
  changed_by: text('changed_by').notNull().references(() => workspaceMembersTable.id),
  changed_at: timestamp('changed_at', { mode: 'date', precision: 3 }).notNull(),
})

export const subtasksTable = pgTable('subtasks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  task_id: text('task_id').notNull().references(() => tasksTable.id, { onDelete: 'cascade' }),
  is_completed: boolean('is_completed').default(false).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).notNull(),
})

// Relations
export const userRelations = relations(userTable, ({ many }) => ({
  credentials: many(passkeysTable),
  owned_workspaces: many(workspaceTable),
  workspaces: many(workspaceMembersTable),
  oauth_accounts: many(oauthAccountTable),
  password_reset_sessions: many(passwordResetSession),
}))

export const workspaceRelations = relations(workspaceTable, ({ one, many }) => ({
  owner: one(userTable, { fields: [workspaceTable.user_id], references: [userTable.id] }),
  members: many(workspaceMembersTable),
  projects: many(projectTable),
  subscription: one(subscriptionTable, {
    fields: [workspaceTable.id],
    references: [subscriptionTable.workspace_id],
  }),
  billingEvents: many(billingEventsTable),
  customers: many(polarCustomers),
}))

export const polarCustomerRelations = relations(polarCustomers, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [polarCustomers.workspaceId],
    references: [workspaceTable.id],
  }),
}))

export const subscriptionRelations = relations(subscriptionTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [subscriptionTable.workspace_id],
    references: [workspaceTable.id],
  }),
}))

export const billingEventsRelations = relations(billingEventsTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [billingEventsTable.workspace_id],
    references: [workspaceTable.id],
  }),
}))

export const workspaceMembersRelations = relations(workspaceMembersTable, ({ one, many }) => ({
  user: one(userTable, { fields: [workspaceMembersTable.user_id], references: [userTable.id] }),
  workspace: one(workspaceTable, { fields: [workspaceMembersTable.workspace_id], references: [workspaceTable.id] }),
  tasks: many(taskAssigneesTable),
  activities: many(tasksActivityTable),
  project_memberships: many(projectMembers),
}))

export const projectsRelations = relations(projectTable, ({ one, many }) => ({
  workspace: one(workspaceTable, { fields: [projectTable.workspace_id], references: [workspaceTable.id] }),
  tasks: many(tasksTable),
  members: many(projectMembers),
}))

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projectTable, { fields: [projectMembers.project_id], references: [projectTable.id] }),
  member: one(workspaceMembersTable, { fields: [projectMembers.member_id], references: [workspaceMembersTable.id] }),
}))

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  project: one(projectTable, { fields: [tasksTable.project_id], references: [projectTable.id] }),
  subtasks: many(subtasksTable),
  activities: many(tasksActivityTable),
  assignees: many(taskAssigneesTable),
}))

export const taskAssigneesRelations = relations(taskAssigneesTable, ({ one }) => ({
  task: one(tasksTable, { fields: [taskAssigneesTable.task_id], references: [tasksTable.id] }),
  member: one(workspaceMembersTable, { fields: [taskAssigneesTable.member_id], references: [workspaceMembersTable.id] }),
}))

export const subtasksRelations = relations(subtasksTable, ({ one }) => ({
  task: one(tasksTable, { fields: [subtasksTable.task_id], references: [tasksTable.id] }),
}))

export const tasksActivityRelations = relations(tasksActivityTable, ({ one }) => ({
  task: one(tasksTable, { fields: [tasksActivityTable.task_id], references: [tasksTable.id] }),
  member: one(workspaceMembersTable, { fields: [tasksActivityTable.changed_by], references: [workspaceMembersTable.id] }),
}))

export const passkeysRelations = relations(passkeysTable, ({ one }) => ({
  user: one(userTable, { fields: [passkeysTable.user_id], references: [userTable.id] }),
}))

export const oauthAccountRelations = relations(oauthAccountTable, ({ one }) => ({
  user: one(userTable, { fields: [oauthAccountTable.user_id], references: [userTable.id] }),
}))

export const passwordResetSessionRelations = relations(passwordResetSession, ({ one }) => ({
  user: one(userTable, { fields: [passwordResetSession.user_id], references: [userTable.id] }),
}))

export const workspaceInviteRequestRelations = relations(workspaceInviteRequest, ({ one }) => ({
  user: one(userTable, { fields: [workspaceInviteRequest.invited_by], references: [userTable.id] }),
  workspace: one(workspaceTable, { fields: [workspaceInviteRequest.workspace_id], references: [workspaceTable.id] }),
}))

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
