import { v4 as uuidv4 } from 'uuid'
import { eq, and, inArray } from 'drizzle-orm'
import { type Priority, type Status, validStatuses, validPriorities, type ProjectMembers, appLink } from '~/types'
import { sendProjectAssignmentEmail } from '~/server/utils/emails/actions/send-project-assignment'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')

    const { title, status, dueDate, description, priority, members } = await readBody(event) as {
      description: string
      dueDate: Date | undefined
      title: string
      status: Status
      priority: Priority
      members: ProjectMembers[]
    }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (typeof workspaceId !== 'string' || !workspaceId) {
      throw createError({
        statusMessage: 'Invalid workspaceId!',
        statusCode: 400,
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

    if (dueDate !== undefined && typeof dueDate !== 'string') {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'At least one member is required!' })
    }

    for (const member of members) {
      if (!member || typeof member !== 'object')
        throw createError({ statusMessage: 'Invalid member format!', statusCode: 400 })
      if (typeof member.member_id !== 'string' || !member.member_id)
        throw createError({ statusMessage: 'Each member must have a valid id!', statusCode: 400 })
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined

    if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
      throw createError({
        statusMessage: 'Invalid due date!',
        statusCode: 400,
      })
    }

    const memberIds = members.map(m => m.member_id)

    // 🔍 Validate that all members exist in workspace_members of the same workspace
    const validMembers = await useDrizzle().query.workspaceMembersTable.findMany({
      where: and(
        inArray(tables.workspaceMembersTable.id, memberIds),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
      ),
      columns: { id: true },
    })

    const validIds = validMembers.map(m => m.id)
    const invalid = memberIds.filter(id => !validIds.includes(id))
    if (invalid.length) {
      throw createError({ statusCode: 400, statusMessage: `Invalid members (not in workspace): ${invalid.join(', ')}` })
    }

    let projectId: string | null = null

    await useDrizzle().transaction(async (tx) => {
      // Create the new project
      const [project] = await tx.insert(tables.projectTable).values({
        id: uuidv4(),
        title,
        description,
        due_date: parsedDueDate,
        priority,
        status,
        workspace_id: workspaceId,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning()

      if (members && members.length > 0) {
        const now = new Date()
        const newMembers = members.map(m => ({
          id: uuidv4(),
          project_id: project.id,
          member_id: m.member_id,
          created_at: now,
          updated_at: now,
        }))

        await tx.insert(tables.projectMembers).values(newMembers)
      }

      projectId = project.id

      // Fetch user details for each member to send emails
      const users = await tx.query.workspaceMembersTable.findMany({
        where: inArray(tables.workspaceMembersTable.id, memberIds),
        with: {
          user: true,
        },
      })

      const workspace = await useDrizzle().query.workspaceTable.findFirst({
        where: table => eq(table.id, workspaceId),
      })

      if (!workspace) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid workspace!',
        })
      }

      for (const user of users) {
        if (!user.user?.email || user.user_id === session.user.id) continue

        await sendProjectAssignmentEmail({
          email: user.user.email,
          user: user.user.username,
          addedBy: session.user.username,
          project: title,
          workspace: workspace.name,
          link: `${appLink}/workspace/${workspaceId}/projects/${project.id}`,
        })
      }
    })

    return {
      message: 'Project created successfully!',
      projectId: projectId ? projectId : null,
    }
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Workspace new project error: ${errorMessage}!`,
    })
  }
})
