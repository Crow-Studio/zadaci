import { and, eq, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const { workspaceId } = event.context.params as { workspaceId: string }
    const { emails } = await readBody(event) as { emails: string[] }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'WorkspaceId is required!',
      })
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one email is required for removal.',
      })
    }

    await useDrizzle()
      .delete(tables.workspaceInviteRequest)
      .where(
        and(
          eq(tables.workspaceInviteRequest.workspace_id, workspaceId),
          inArray(tables.workspaceInviteRequest.email, emails),
        ),
      )

    return {
      message: `Successfully deleted ${emails.length} invite request${emails.length > 1 ? 's' : ''}.`,
    }
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ?? 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
