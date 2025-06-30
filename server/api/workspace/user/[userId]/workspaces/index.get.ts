import { and, desc, eq } from 'drizzle-orm'
import { tables, useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.params as { userId: string }

    const workspaces = await useDrizzle()
      .select({
        id: tables.workspaceTable.id,
        name: tables.workspaceTable.name,
        imageUrl: tables.workspaceTable.image_url,
        inviteCode: tables.workspaceTable.invite_code,
        userRole: tables.workspaceMembersTable.role,
        createdAt: tables.workspaceTable.created_at,
        updatedAt: tables.workspaceTable.updated_at,
      })
      .from(tables.workspaceTable)
      .innerJoin(
        tables.workspaceMembersTable,
        and(
          eq(tables.workspaceMembersTable.workspace_id, tables.workspaceTable.id),
          eq(tables.workspaceMembersTable.user_id, userId),
        ),
      )
      .orderBy(desc(tables.workspaceTable.created_at))

    return workspaces
  }
  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
