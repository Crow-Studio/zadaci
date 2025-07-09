export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')
    const taskId = getRouterParam(event, 'taskId')

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (typeof workspaceId !== 'string' || !workspaceId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid workspace ID!' })
    }

    if (!projectId || typeof projectId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'ProjectID is required!',
      })
    }

    if (!taskId || typeof taskId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'taskID is required!',
      })
    }

    // Verify that the project exists
    const project = await useDrizzle().query.projectTable.findFirst({
      where: table => and(
        eq(table.id, projectId),
        eq(table.workspace_id, workspaceId),
      ),
    })

    if (!project) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Project!',
      })
    }

    // check if task already exists
    const existingTask = await useDrizzle().query.tasksTable.findFirst({
      where: table => and(
        eq(table.id, taskId),
        eq(table.project_id, projectId),
      ),
    })

    if (!existingTask) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Task not found!',
      })
    }

    // delete task
    await useDrizzle().delete(tables.tasksTable).where(
      and(
        eq(tables.tasksTable.id, taskId),
        eq(tables.tasksTable.project_id, projectId),
      ),
    )

    return {
      message: 'Task deleted successfully',
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Create Task error: ${errorMessage}!`,
    })
  }
})
