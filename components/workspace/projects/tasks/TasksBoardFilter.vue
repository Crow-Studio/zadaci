<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Users, ChevronDown, X, Activity, AlertCircle } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { IProject, Task } from '~/types'

const props = defineProps<{
  tasks: Record<string, Task[]>
  project: IProject
}>()

const emit = defineEmits<{
  'tasks-filtered': [filteredTasks: Record<string, Task[]>]
}>()

// Filter states
const selectedDueDates = ref<string[]>([])
const selectedAssignees = ref<string[]>([])
const selectedStatuses = ref<string[]>([])
const selectedPriorities = ref<string[]>([])

// Due date options
const dueDateOptions = [
  { value: 'late', label: 'Late', icon: Calendar },
  { value: 'today', label: 'Today', icon: Calendar },
  { value: 'tomorrow', label: 'Tomorrow', icon: Calendar },
  { value: 'thisWeek', label: 'This week', icon: Calendar },
  { value: 'nextWeek', label: 'Next week', icon: Calendar },
  { value: 'future', label: 'Future', icon: Calendar },
  { value: 'noDate', label: 'No date', icon: Calendar },
]

// Status options
const statusOptions = [
  { value: 'IDEA', label: 'Idea', color: 'bg-gray-500' },
  { value: 'TODO', label: 'To Do', color: 'bg-blue-500' },
  { value: 'IN PROGRESS', label: 'In Progress', color: 'bg-yellow-500' },
  { value: 'IN REVIEW', label: 'In Review', color: 'bg-purple-500' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-500' },
  { value: 'ABANDONED', label: 'Abandoned', color: 'bg-red-500' },
]

// Priority options
const priorityOptions = [
  { value: 'HIGH', label: 'High', color: 'bg-red-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'LOW', label: 'Low', color: 'bg-green-500' },
  { value: 'NONE', label: 'None', color: 'bg-gray-500' },
]

// Get unique assignees from all tasks
const assignees = computed(() => {
  const allTasks = Object.values(props.tasks).flat()
  const uniqueAssignees = new Map()

  allTasks.forEach((task) => {
    task.assignees?.forEach((assignee) => {
      if (!uniqueAssignees.has(assignee.member_id)) {
        uniqueAssignees.set(assignee.member_id, {
          id: assignee.member_id,
          username: assignee.username,
          email: assignee.email,
          avatar: assignee.avatar,
        })
      }
    })
  })

  return Array.from(uniqueAssignees.values())
})

// Active filters count
const activeFiltersCount = computed(() => {
  return selectedDueDates.value.length + selectedAssignees.value.length + selectedStatuses.value.length + selectedPriorities.value.length
})

// Filter tasks based on selected filters
const filteredTasks = computed(() => {
  if (selectedDueDates.value.length === 0 && selectedAssignees.value.length === 0
    && selectedStatuses.value.length === 0 && selectedPriorities.value.length === 0) {
    return props.tasks
  }

  const filtered: Record<string, Task[]> = {}

  Object.entries(props.tasks).forEach(([status, tasks]) => {
    filtered[status] = tasks.filter((task) => {
      let matchesDueDate = true
      let matchesAssignee = true
      let matchesStatus = true
      let matchesPriority = true

      // Due date filter - task must match at least one selected due date
      if (selectedDueDates.value.length > 0) {
        matchesDueDate = selectedDueDates.value.some((selectedDate) => {
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)

          const startOfNextWeek = new Date(endOfWeek)
          startOfNextWeek.setDate(endOfWeek.getDate() + 1)
          const endOfNextWeek = new Date(startOfNextWeek)
          endOfNextWeek.setDate(startOfNextWeek.getDate() + 6)

          const taskDueDate = task.dueDate ? new Date(task.dueDate) : null

          switch (selectedDate) {
            case 'late':
              return taskDueDate ? taskDueDate < today : false
            case 'today':
              return taskDueDate ? taskDueDate.toDateString() === today.toDateString() : false
            case 'tomorrow':
              return taskDueDate ? taskDueDate.toDateString() === tomorrow.toDateString() : false
            case 'thisWeek':
              return taskDueDate ? taskDueDate >= startOfWeek && taskDueDate <= endOfWeek : false
            case 'nextWeek':
              return taskDueDate ? taskDueDate >= startOfNextWeek && taskDueDate <= endOfNextWeek : false
            case 'future':
              return taskDueDate ? taskDueDate > endOfNextWeek : false
            case 'noDate':
              return !taskDueDate
            default:
              return false
          }
        })
      }

      // Assignee filter - task must have at least one selected assignee
      if (selectedAssignees.value.length > 0) {
        matchesAssignee = task.assignees?.some(assignee =>
          selectedAssignees.value.includes(assignee.member_id),
        ) || false
      }

      // Status filter - task must match at least one selected status
      if (selectedStatuses.value.length > 0) {
        matchesStatus = selectedStatuses.value.includes(task.status)
      }

      // Priority filter - task must match at least one selected priority
      if (selectedPriorities.value.length > 0) {
        matchesPriority = selectedPriorities.value.includes(task.priority)
      }

      return matchesDueDate && matchesAssignee && matchesStatus && matchesPriority
    })
  })

  return filtered
})

// Watch for filter changes and emit
watch(filteredTasks, (newFilteredTasks) => {
  emit('tasks-filtered', newFilteredTasks)
}, { immediate: true })

// Clear all filters
function clearAllFilters() {
  selectedDueDates.value = []
  selectedAssignees.value = []
  selectedStatuses.value = []
  selectedPriorities.value = []
}

// Toggle due date filter
function toggleDueDateFilter(value: string) {
  const index = selectedDueDates.value.indexOf(value)
  if (index > -1) {
    selectedDueDates.value.splice(index, 1)
  }
  else {
    selectedDueDates.value.push(value)
  }
}

// Toggle assignee filter
function toggleAssigneeFilter(value: string) {
  const index = selectedAssignees.value.indexOf(value)
  if (index > -1) {
    selectedAssignees.value.splice(index, 1)
  }
  else {
    selectedAssignees.value.push(value)
  }
}

// Toggle status filter
function toggleStatusFilter(value: string) {
  const index = selectedStatuses.value.indexOf(value)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  }
  else {
    selectedStatuses.value.push(value)
  }
}

// Toggle priority filter
function togglePriorityFilter(value: string) {
  const index = selectedPriorities.value.indexOf(value)
  if (index > -1) {
    selectedPriorities.value.splice(index, 1)
  }
  else {
    selectedPriorities.value.push(value)
  }
}

// Remove specific filters
function removeDueDateFilter(value: string) {
  const index = selectedDueDates.value.indexOf(value)
  if (index > -1) {
    selectedDueDates.value.splice(index, 1)
  }
}

function removeAssigneeFilter(value: string) {
  const index = selectedAssignees.value.indexOf(value)
  if (index > -1) {
    selectedAssignees.value.splice(index, 1)
  }
}

function removeStatusFilter(value: string) {
  const index = selectedStatuses.value.indexOf(value)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  }
}

function removePriorityFilter(value: string) {
  const index = selectedPriorities.value.indexOf(value)
  if (index > -1) {
    selectedPriorities.value.splice(index, 1)
  }
}

// Get options by value
function getStatusOption(value: string) {
  return statusOptions.find(option => option.value === value)
}

function getPriorityOption(value: string) {
  return priorityOptions.find(option => option.value === value)
}

// Get assignee by ID
function getAssigneeById(id: string) {
  return assignees.value.find(assignee => assignee.id === id)
}
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <!-- Filter Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          class="gap-2"
        >
          <span>Filters</span>
          <Badge
            v-if="activeFiltersCount > 0"
            variant="secondary"
            class="ml-1"
          >
            {{ activeFiltersCount }}
          </Badge>
          <ChevronDown class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <!-- Status Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Activity class="h-4 w-4 mr-2" />
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                v-for="option in statusOptions"
                :key="option.value"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedStatuses.includes(option.value) }"
                @click="toggleStatusFilter(option.value)"
              >
                <div
                  :class="option.color"
                  class="h-3 w-3 rounded-full mr-2"
                />
                <span>{{ option.label }}</span>
                <div
                  v-if="selectedStatuses.includes(option.value)"
                  class="ml-auto"
                >
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Priority Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <AlertCircle class="h-4 w-4 mr-2" />
            <span>Priority</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                v-for="option in priorityOptions"
                :key="option.value"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedPriorities.includes(option.value) }"
                @click="togglePriorityFilter(option.value)"
              >
                <div
                  :class="option.color"
                  class="h-3 w-3 rounded-full mr-2"
                />
                <span>{{ option.label }}</span>
                <div
                  v-if="selectedPriorities.includes(option.value)"
                  class="ml-auto"
                >
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Due Date Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Calendar class="h-4 w-4 mr-2" />
            <span>Due date</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                v-for="option in dueDateOptions"
                :key="option.value"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedDueDates.includes(option.value) }"
                @click="toggleDueDateFilter(option.value)"
              >
                <component
                  :is="option.icon"
                  class="h-4 w-4 mr-2"
                />
                <span>{{ option.label }}</span>
                <div
                  v-if="selectedDueDates.includes(option.value)"
                  class="ml-auto"
                >
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Assignment Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users class="h-4 w-4 mr-2" />
            <span>Assignment</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                v-for="assignee in assignees"
                :key="assignee.id"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedAssignees.includes(assignee.id) }"
                @click="toggleAssigneeFilter(assignee.id)"
              >
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    {{ assignee.username.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ assignee.username }}</span>
                </div>
                <div
                  v-if="selectedAssignees.includes(assignee.id)"
                  class="ml-auto"
                >
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Clear All Filters -->
    <Button
      v-if="activeFiltersCount > 0"
      variant="ghost"
      size="sm"
      class="text-blue-600 hover:text-blue-800"
      @click="clearAllFilters"
    >
      Clear all
    </Button>

    <!-- Active Filter Badges -->
    <div class="flex items-center gap-2 flex-wrap">
      <Badge
        v-for="statusValue in selectedStatuses"
        :key="`status-${statusValue}`"
        variant="secondary"
        class="gap-1"
      >
        <div
          :class="getStatusOption(statusValue)?.color"
          class="h-2 w-2 rounded-full"
        />
        {{ getStatusOption(statusValue)?.label }}
        <X
          class="h-3 w-3 cursor-pointer"
          @click="removeStatusFilter(statusValue)"
        />
      </Badge>

      <Badge
        v-for="priorityValue in selectedPriorities"
        :key="`priority-${priorityValue}`"
        variant="secondary"
        class="gap-1"
      >
        <div
          :class="getPriorityOption(priorityValue)?.color"
          class="h-2 w-2 rounded-full"
        />
        {{ getPriorityOption(priorityValue)?.label }}
        <X
          class="h-3 w-3 cursor-pointer"
          @click="removePriorityFilter(priorityValue)"
        />
      </Badge>

      <Badge
        v-for="dueDateValue in selectedDueDates"
        :key="`date-${dueDateValue}`"
        variant="secondary"
        class="gap-1"
      >
        {{ dueDateOptions.find(opt => opt.value === dueDateValue)?.label }}
        <X
          class="h-3 w-3 cursor-pointer"
          @click="removeDueDateFilter(dueDateValue)"
        />
      </Badge>

      <Badge
        v-for="assigneeId in selectedAssignees"
        :key="`assignee-${assigneeId}`"
        variant="secondary"
        class="gap-1"
      >
        {{ getAssigneeById(assigneeId)?.username }}
        <X
          class="h-3 w-3 cursor-pointer"
          @click="removeAssigneeFilter(assigneeId)"
        />
      </Badge>
    </div>
  </div>
</template>
