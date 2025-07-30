import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'
import { and, between, eq, sql } from 'drizzle-orm'
import { weekDays } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const workspaceId = getRouterParam(event, 'workspaceId')
    const query = getQuery(event)

    const range = query.range

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

    if (!range || (range !== 'last' && range !== 'this')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Range! Use "last" or "this".',
      })
    }

    const user = await useDrizzle().query.userTable.findFirst({
      where: table => eq(table.id, session.user.id),
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid User!',
      })
    }

    const baseDate = new Date()
    const weekStart = range === 'last'
      ? startOfWeek(subWeeks(baseDate, 1), { weekStartsOn: 1 })
      : startOfWeek(baseDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

    const db = useDrizzle()

    const result = await db
      .select({
        day: sql`TO_CHAR(${tables.tasksActivityTable.changed_at}, 'Dy')`.as('day'),
        status: tables.tasksActivityTable.status,
        count: sql<number>`COUNT(*)`.as('count'),
      })
      .from(tables.tasksActivityTable)
      .innerJoin(
        tables.tasksTable,
        eq(tables.tasksActivityTable.task_id, tables.tasksTable.id),
      )
      .innerJoin(
        tables.projectTable,
        eq(tables.tasksTable.project_id, tables.projectTable.id),
      )
      .where(
        and(
          eq(tables.tasksActivityTable.changed_by, session.user.id),
          between(tables.tasksActivityTable.changed_at, weekStart, weekEnd),
          eq(tables.projectTable.workspace_id, workspaceId),
        ),
      )
      .groupBy(
        sql`TO_CHAR(${tables.tasksActivityTable.changed_at}, 'Dy')`,
        tables.tasksActivityTable.status,
      )

    const merged = weekDays.map((day) => {
      const dayData = result.filter(r => String(r.day).trim() === day)

      return {
        day,
        completed: dayData.find(r => r.status === 'COMPLETED')?.count ?? 0,
        inReview: dayData.find(r => r.status === 'IN REVIEW')?.count ?? 0,
        abandoned: dayData.find(r => r.status === 'ABANDONED')?.count ?? 0,
      }
    })

    return merged
  }
  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Tasks Weekly Productivity Stats Error: ${errorMessage}!`,
    })
  }
})
