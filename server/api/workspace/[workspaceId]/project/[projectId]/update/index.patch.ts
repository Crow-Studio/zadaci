import { validPriorities, validStatuses, type Priority, type Status } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')

    const { title, status, dueDate, description, priority } = await readBody(event) as { description: string
      dueDate: Date | undefined
      title: string
      status: Status
      priority: Priority
    }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'WorkspaceID is required!',
      })
    }

    if (!projectId || typeof projectId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'ProjectID is required!',
      })
    }

    if (typeof title !== 'string' || !title) {
      throw createError({
        statusMessage: 'Invalid title!',
        statusCode: 400,
      })
    }

    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      throw createError({
        statusMessage: 'Invalid Status!',
        statusCode: 400,
      })
    }

    if (typeof priority !== 'string' || !validPriorities.includes(priority)) {
      throw createError({
        statusMessage: 'Invalid Priority!',
        statusCode: 400,
      })
    }

    if (description !== undefined && typeof description !== 'string') {
      throw createError({
        statusMessage: 'Invalid description!',
        statusCode: 400,
      })
    }

    if (dueDate != null && typeof dueDate !== 'string') {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined

    if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    // check if workspace exists
    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: table => eq(table.id, workspaceId),
    })

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Workspace!',
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

    // update project
    await useDrizzle().update(tables.projectTable).set({
      updated_at: new Date(),
      status,
      description,
      due_date: parsedDueDate ? parsedDueDate : null,
      priority,
      title,
    }).where(and(
      eq(tables.projectTable.id, projectId),
      eq(tables.projectTable.workspace_id, workspaceId),
    ))

    return {
      message: 'Project updated successfully!',
    }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
