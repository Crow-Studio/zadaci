import { eq, and } from 'drizzle-orm'
import { isToday, isTomorrow, isThisWeek } from 'date-fns'
import type { DueItem } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const db = useDrizzle()

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    const workspaceId = getRouterParam(event, 'workspaceId') as string
    const userId = session.user.id

    const rows = await db
      .select({
        projectId: tables.projectTable.id,
        projectTitle: tables.projectTable.title,
        projectDue: tables.projectTable.due_date,
        projectPriority: tables.projectTable.priority,
        projectDesc: tables.projectTable.description,

        taskId: tables.tasksTable.id,
        taskTitle: tables.tasksTable.name,
        taskDue: tables.tasksTable.due_date,
        taskPriority: tables.tasksTable.priority,
        taskDesc: tables.tasksTable.description,

        memberId: tables.workspaceMembersTable.id,
        userId: tables.userTable.id,
        username: tables.userTable.username,
        avatar: tables.userTable.profile_picture_url,
        workspaceId: tables.workspaceTable.id,
      })
      .from(tables.workspaceMembersTable)
      .innerJoin(
        tables.workspaceTable,
        eq(tables.workspaceMembersTable.workspace_id, tables.workspaceTable.id),
      )
      .innerJoin(
        tables.userTable,
        eq(tables.workspaceMembersTable.user_id, tables.userTable.id),
      )
      .innerJoin(
        tables.projectMembers,
        eq(tables.workspaceMembersTable.id, tables.projectMembers.member_id),
      )
      .innerJoin(
        tables.projectTable,
        eq(tables.projectMembers.project_id, tables.projectTable.id),
      )
      .leftJoin(
        tables.tasksTable,
        eq(tables.tasksTable.project_id, tables.projectTable.id),
      )
      .where(
        and(
          eq(tables.workspaceTable.id, workspaceId),
          eq(tables.workspaceMembersTable.user_id, userId),
        ),
      )

    const items: DueItem[] = rows.flatMap((row) => {
      const res: DueItem[] = []

      if (row.projectId && row.projectDue) {
        if (isToday(row.projectDue) || isTomorrow(row.projectDue) || isThisWeek(row.projectDue)) {
          res.push({
            id: row.projectId,
            projectId: row.projectId,
            type: 'project',
            title: row.projectTitle,
            dueDate: row.projectDue,
            assignee: row.username,
            avatar: row.avatar,
            priority: row.projectPriority,
            description: row.projectDesc,
            workspaceId: row.workspaceId,
          })
        }
      }

      if (row.taskId && row.taskDue) {
        if (isToday(row.taskDue) || isTomorrow(row.taskDue) || isThisWeek(row.taskDue)) {
          res.push({
            id: row.taskId,
            projectId: row.projectId,
            type: 'task',
            title: row.taskTitle as string,
            dueDate: row.taskDue,
            assignee: row.username,
            avatar: row.avatar,
            priority: row.taskPriority,
            description: row.taskDesc,
            workspaceId: row.workspaceId,
          })
        }
      }

      return res
    })

    return items
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Failed to fetch due items: ${errorMessage}!`,
    })
  }
})
