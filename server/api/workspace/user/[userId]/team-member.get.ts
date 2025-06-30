import { and, desc, eq, exists } from 'drizzle-orm'
import { tables, useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.params as { userId: string }

    const workspace = await useDrizzle().query.workspaceTable.findFirst({
      where: workspace =>
        exists(
          useDrizzle()
            .select()
            .from(tables.workspaceMembersTable)
            .where(
              and(
                eq(tables.workspaceMembersTable.workspace_id, workspace.id),
                eq(tables.workspaceMembersTable.user_id, userId),
              ),
            ),
        ),
      with: {
        members: true,
      },
      orderBy: table => desc(table.created_at),
    })

    return workspace
  }
  catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
