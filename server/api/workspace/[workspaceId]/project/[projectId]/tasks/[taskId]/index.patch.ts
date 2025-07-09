// import { v4 as uuidv4 } from 'uuid'
import { validStatuses, type Status } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')
    const taskId = getRouterParam(event, 'taskId')

    const { status } = await readBody(event) as { status: Status }

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

    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      throw createError({
        statusMessage: 'Invalid Status!',
        statusCode: 400,
      })
    }

    // check if project exists
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

    // update task status
    await useDrizzle().update(tables.tasksTable).set({
      updated_at: new Date(),
      status,
    }).where(and(
      eq(tables.tasksTable.id, taskId),
      eq(tables.tasksTable.project_id, projectId),
    )).returning()

    // save the task activity if task is either status is changed to 'COMPLETED' or 'IN REVIEW' or 'ABANDONED'
    // if (['COMPLETED', 'IN REVIEW', 'ABANDONED'].includes(status)) {
    //   await useDrizzle().insert(tables.tasksActivityTable).values({
    //     id: uuidv4(),
    //     task_id: taskId,
    //     changed_by: session.user.id,
    //     status,
    //     changed_at: new Date(),
    //   })
    // }

    return { message: 'Task status updated successfully!' }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Update Project status: ${errorMessage}!`,
    })
  }
})
