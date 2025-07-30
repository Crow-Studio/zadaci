import { and, eq, ne, inArray, count } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized!' })
    }

    if (typeof workspaceId !== 'string' || !workspaceId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid workspaceId!' })
    }

    const db = useDrizzle()

    const user = await db.query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    if (!user) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid User!' })
    }

    const activeProjects = await db.select({
      id: tables.projectTable.id,
    }).from(tables.projectTable).where(and(
      eq(tables.projectTable.workspace_id, workspaceId),
      ne(tables.projectTable.status, 'COMPLETED'),
    ))

    const projectIds = activeProjects.map(p => p.id)
    const totalProjects = activeProjects.length

    const [tasksCountRow] = await db.select({
      count: count().as('count'),
    }).from(tables.tasksTable).where(
      inArray(tables.tasksTable.project_id, projectIds),
    )

    const [inProgressRow] = await db.select({
      count: count().as('count'),
    }).from(tables.tasksTable).where(and(
      inArray(tables.tasksTable.project_id, projectIds),
      eq(tables.tasksTable.status, 'IN PROGRESS'),
    ))

    const [completedRow] = await db.select({
      count: count().as('count'),
    }).from(tables.tasksTable).where(and(
      inArray(tables.tasksTable.project_id, projectIds),
      eq(tables.tasksTable.status, 'COMPLETED'),
    ))

    return {
      totalProjects,
      totalTasks: Number(tasksCountRow?.count ?? 0),
      totalTasksInProgress: Number(inProgressRow?.count ?? 0),
      totalTasksCompleted: Number(completedRow?.count ?? 0),
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Retrieve Overall Stats Error: ${errorMessage}!`,
    })
  }
})
