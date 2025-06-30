import { and, eq, inArray, not } from 'drizzle-orm'
import { tables, useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { userIds, workspaceId } = await readBody(event) as {
      userIds: string[]
      workspaceId: string
    }

    if (
      !workspaceId
      || !Array.isArray(userIds)
      || userIds.length === 0
      || userIds.some(id => typeof id !== 'string')
    ) {
      throw createError({
        statusMessage: 'WorkspaceId and a valid userIds array are required.',
      })
    }

    // Confirm requester is OWNER
    const actor = await useDrizzle().query.workspaceMembersTable.findFirst({
      where: and(
        eq(tables.workspaceMembersTable.user_id, session.user.id),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
      ),
    })

    if (!actor || actor.role !== 'OWNER') {
      throw createError({
        statusMessage: 'Only workspace owners can remove teammates!',
      })
    }

    // Exclude OWNERS from deletion
    const removableUsers = await useDrizzle().query.workspaceMembersTable.findMany({
      where: and(
        inArray(tables.workspaceMembersTable.user_id, userIds),
        eq(tables.workspaceMembersTable.workspace_id, workspaceId),
        not(eq(tables.workspaceMembersTable.role, 'OWNER')),
      ),
      columns: {
        user_id: true,
      },
    })

    const idsToDelete = removableUsers.map(u => u.user_id)

    if (idsToDelete.length === 0) {
      throw createError({
        statusMessage: 'No removable teammates found (OWNERs cannot be removed).',
      })
    }

    await useDrizzle()
      .delete(tables.workspaceMembersTable)
      .where(
        and(
          inArray(tables.workspaceMembersTable.user_id, idsToDelete),
          eq(tables.workspaceMembersTable.workspace_id, workspaceId),
        ),
      )

    return {
      message: `Successfully removed ${idsToDelete.length} teammate${idsToDelete.length > 1 ? 's' : ''} from the workspace.`,
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
