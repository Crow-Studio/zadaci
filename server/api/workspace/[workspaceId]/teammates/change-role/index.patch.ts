import { and, eq, inArray } from 'drizzle-orm'
import { tables, useDrizzle } from '~/server/utils/drizzle'

interface ITeammate {
  id: string
  role: 'OWNER' | 'MEMBER' | 'GUEST'
}

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { workspaceId } = event.context.params as { workspaceId: string }
    const { teammates } = await readBody(event) as { teammates: ITeammate[] }

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'WorkspaceId is required!' })
    }

    if (!Array.isArray(teammates) || teammates.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'At least one teammate is required.' })
    }

    const actor = await useDrizzle().query.workspaceMembersTable.findFirst({
      where: and(
        eq(tables.workspaceMembersTable.user_id, session.user.id),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
      ),
    })

    if (!actor || actor.role !== 'OWNER') {
      throw createError({ statusMessage: 'Only workspace owners can update teammate roles!', statusCode: 400 })
    }

    const teammateIds = teammates.map(t => t.id)

    const existingRoles = await useDrizzle().query.workspaceMembersTable.findMany({
      where: and(
        inArray(tables.workspaceMembersTable.user_id, teammateIds),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
      ),
      columns: {
        user_id: true,
        role: true,
      },
    })

    const ownerBeingUpdated = existingRoles.find(t => t.role === 'OWNER')
    if (ownerBeingUpdated) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot update the role of an OWNER.',
      })
    }

    await Promise.all(
      teammates.map((teammate) => {
        if (teammate.role === 'OWNER') {
          throw createError({
            statusCode: 400,
            statusMessage: 'You cannot assign the OWNER role.',
          })
        }

        return useDrizzle().update(tables.workspaceMembersTable)
          .set({ role: teammate.role, updated_at: new Date() })
          .where(and(
            eq(tables.workspaceMembersTable.user_id, teammate.id),
            eq(tables.workspaceMembersTable.workspace_id, workspaceId),
          ))
      }),
    )

    return {
      message: `Successfully updated roles for ${teammates.length} teammate${teammates.length > 1 ? 's' : ''}.`,
    }
  }
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusMessage: errorMessage,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
