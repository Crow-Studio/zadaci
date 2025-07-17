import { inArray, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    const db = useDrizzle()

    // Get all workspace member IDs for this user
    const userMemberships = await db.query.workspaceMembersTable.findMany({
      where: table => eq(table.user_id, session.user.id),
    })

    const memberIds = userMemberships.map(member => member.id)

    if (memberIds.length === 0) {
      return [] // User is not in any workspace
    }

    // Get all tasks assigned to the user
    const taskAssignees = await db.query.taskAssigneesTable.findMany({
      where: table => inArray(table.member_id, memberIds),
      with: {
        task: {
          with: {
            subtasks: true,
            assignees: {
              with: {
                member: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: (table, { desc }) => desc(table.assigned_at),
    })

    const tasks = taskAssignees
      .filter(assignee => assignee.task) // Ensure task exists
      .map((assignee) => {
        const task = assignee.task
        return {
          id: task.id,
          name: task.name,
          status: task.status,
          dueDate: task.due_date ? task.due_date.toISOString() : null,
          description: task.description,
          priority: task.priority,
          createdAt: task.created_at.toISOString(),
          updatedAt: task.updated_at.toISOString(),
          projectId: task.project_id,
          subtasks: task.subtasks.map(subtask => ({
            id: subtask.id,
            name: subtask.name,
            is_completed: subtask.is_completed,
            createdAt: subtask.created_at.toISOString(),
            updatedAt: subtask.updated_at.toISOString(),
          })),
          assignees: task.assignees.map(ta => ({
            member_id: ta.member.id,
            email: ta.member.user.email,
            username: ta.member.user.username,
            avatar: ta.member.user.profile_picture_url,
          })),
        }
      })

    return tasks
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `My Tasks Error: ${errorMessage}!`,
    })
  }
})
