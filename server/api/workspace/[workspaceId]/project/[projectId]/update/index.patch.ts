import { eq, and, inArray } from 'drizzle-orm'
import { v4 as uuidV4 } from 'uuid'
import { sendProjectCompletionMail } from '~/server/utils/emails/actions/completed-project'
import { type ProjectMembers, validPriorities, validStatuses, type Priority, type Status } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const projectId = getRouterParam(event, 'projectId')

    const { title, status, dueDate, description, priority, members } = await readBody(event) as {
      description: string
      dueDate: Date | undefined
      title: string
      status: Status
      priority: Priority
      members: ProjectMembers[]
    }

    if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized!' })
    if (!workspaceId || typeof workspaceId !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'WorkspaceID is required!' })
    if (!projectId || typeof projectId !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'ProjectID is required!' })

    if (typeof title !== 'string' || !title)
      throw createError({ statusMessage: 'Invalid title!', statusCode: 400 })
    if (typeof status !== 'string' || !validStatuses.includes(status))
      throw createError({ statusMessage: 'Invalid Status!', statusCode: 400 })
    if (typeof priority !== 'string' || !validPriorities.includes(priority))
      throw createError({ statusMessage: 'Invalid Priority!', statusCode: 400 })
    if (description !== undefined && typeof description !== 'string')
      throw createError({ statusMessage: 'Invalid description!', statusCode: 400 })
    if (dueDate != null && typeof dueDate !== 'string')
      throw createError({ statusMessage: 'Invalid due date!', statusCode: 400 })

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined
    if (parsedDueDate && isNaN(parsedDueDate.getTime()))
      throw createError({ statusMessage: 'Invalid due date!', statusCode: 400 })

    if (!members || !Array.isArray(members) || members.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'At least one member is required!' })
    }

    for (const member of members) {
      if (!member || typeof member !== 'object')
        throw createError({ statusMessage: 'Invalid member format!', statusCode: 400 })
      if (typeof member.member_id !== 'string' || !member.member_id)
        throw createError({ statusMessage: 'Each member must have a valid id!', statusCode: 400 })
    }

    const db = useDrizzle()

    const workspace = await db.query.workspaceTable.findFirst({
      where: eq(tables.workspaceTable.id, workspaceId),
    })
    if (!workspace) throw createError({ statusCode: 400, statusMessage: 'Invalid Workspace!' })

    const project = await db.query.projectTable.findFirst({
      where: and(eq(tables.projectTable.id, projectId), eq(tables.projectTable.workspace_id, workspaceId)),
    })
    if (!project) throw createError({ statusCode: 400, statusMessage: 'Invalid Project!' })

    const memberIds = members.map(m => m.member_id)

    // 🔍 Validate that all members exist in workspace_members of the same workspace
    const validMembers = await db.query.workspaceMembersTable.findMany({
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

    // 📝 All members are valid → proceed to update project and replace members
    await db.update(tables.projectTable).set({
      updated_at: new Date(),
      status,
      description,
      due_date: parsedDueDate ?? null,
      priority,
      title,
    }).where(and(eq(tables.projectTable.id, projectId), eq(tables.projectTable.workspace_id, workspaceId)))

    await db.delete(tables.projectMembers).where(eq(tables.projectMembers.project_id, projectId))

    const now = new Date()
    const newMembers = members.map(m => ({
      id: uuidV4(),
      project_id: projectId,
      member_id: m.member_id,
      created_at: now,
      updated_at: now,
    }))

    await db.insert(tables.projectMembers).values(newMembers)

    if (status === 'COMPLETED') {
      const membersToNotify = await db.query.workspaceMembersTable.findMany({
        where: inArray(tables.workspaceMembersTable.id, validIds),
        with: {
          user: true,
        },
      })

      for (const member of membersToNotify) {
        await sendProjectCompletionMail({
          workspace: workspace.name,
          user: member.user.username as string,
          project: project.title,
          completedBy: session.user.id === member.user.id ? 'You' : session.user.username,
          link: `${process.env.NUXT_PUBLIC_SITE_URL}/workspace/${workspace.id}/projects/${project.id}`,
          email: member.user.email,
        })
      }
    }

    return { message: 'Project updated successfully!' }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({ statusCode: error.statusCode ?? 500, statusMessage: `${errorMessage}!` })
  }
})
