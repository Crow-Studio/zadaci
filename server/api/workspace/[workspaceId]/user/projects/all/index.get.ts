import { eq, and, inArray } from 'drizzle-orm'
import type { ProjectMembers } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    const userId = session.user.id
    const workspaceId = getRouterParam(event, 'workspaceId')

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid workspaceId!',
      })
    }

    // First, get all projects for the user in the workspace
    const projects = await useDrizzle()
      .select({
        id: tables.projectTable.id,
        title: tables.projectTable.title,
        description: tables.projectTable.description,
        status: tables.projectTable.status,
        priority: tables.projectTable.priority,
        dueDate: tables.projectTable.due_date,
        workspaceId: tables.projectTable.workspace_id,
        createdAt: tables.projectTable.created_at,
        updatedAt: tables.projectTable.updated_at,
      })
      .from(tables.projectTable)
      .innerJoin(
        tables.projectMembers,
        eq(tables.projectMembers.project_id, tables.projectTable.id),
      )
      .innerJoin(
        tables.workspaceMembersTable,
        eq(tables.workspaceMembersTable.id, tables.projectMembers.member_id),
      )
      .where(
        and(
          eq(tables.workspaceMembersTable.user_id, userId),
          eq(tables.workspaceMembersTable.workspace_id, workspaceId),
        ),
      )

    // Remove duplicates and get unique project IDs
    const uniqueProjects = projects.reduce((acc, project) => {
      if (!acc.find(p => p.id === project.id)) {
        acc.push(project)
      }
      return acc
    }, [] as typeof projects)

    if (uniqueProjects.length === 0) {
      return []
    }

    const projectIds = uniqueProjects.map(p => p.id)

    // Get all members for these projects
    const membersRaw = await useDrizzle()
      .select({
        projectId: tables.projectMembers.project_id,
        email: tables.userTable.email,
        avatar: tables.userTable.profile_picture_url,
        username: tables.userTable.username,
        member_id: tables.workspaceMembersTable.id,
      })
      .from(tables.projectMembers)
      .innerJoin(
        tables.workspaceMembersTable,
        eq(tables.workspaceMembersTable.id, tables.projectMembers.member_id),
      )
      .innerJoin(
        tables.userTable,
        eq(tables.userTable.id, tables.workspaceMembersTable.user_id),
      )
      .where(
        and(
          eq(tables.workspaceMembersTable.workspace_id, workspaceId),
          inArray(tables.projectMembers.project_id, projectIds),
        ),
      )

    // Create a map to group members by project
    const membersByProject = new Map<string, ProjectMembers[]>()

    for (const member of membersRaw) {
      if (!membersByProject.has(member.projectId)) {
        membersByProject.set(member.projectId, [])
      }
      membersByProject.get(member.projectId)?.push({
        email: member.email,
        avatar: member.avatar,
        username: member.username,
        member_id: member.member_id,
      })
    }

    // Combine projects with their members
    const projectsWithMembers = uniqueProjects.map(project => ({
      ...project,
      members: membersByProject.get(project.id) || [],
    }))

    return projectsWithMembers
  }

  catch (error: any) {
    const errorMessage = error.error ? error.error.message : error.message
    throw createError({
      statusCode: error.statusCode ? error.statusCode : 500,
      statusMessage: `Failed to fetch projects: ${errorMessage}!`,
    })
  }
})
