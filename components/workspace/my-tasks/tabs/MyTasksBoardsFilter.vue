<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Users, ChevronDown, Activity, AlertCircle, Check } from 'lucide-vue-next'
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
import type { MyTask } from '~/types'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '~/components/ui/command'

const props = defineProps<{
  tasks: Record<string, MyTask[]>
}>()

const emit = defineEmits<{
  'tasks-filtered': [filteredTasks: Record<string, MyTask[]>]
}>()

// Filter states
const selectedDueDates = ref<string[]>([])
const selectedAssignees = ref<string[]>([])
const selectedStatuses = ref<string[]>([])
const selectedPriorities = ref<string[]>([])

// Due date options
const dueDateOptions = [
  { value: 'late', label: 'Late', icon: 'hugeicons:alert-01' },
  { value: 'today', label: 'Today', icon: 'hugeicons:calendar-01' },
  { value: 'tomorrow', label: 'Tomorrow', icon: 'hugeicons:calendar-02' },
  { value: 'thisWeek', label: 'This week', icon: 'hugeicons:calendar-03' },
  { value: 'nextWeek', label: 'Next week', icon: 'hugeicons:calendar-minus-02' },
  { value: 'future', label: 'Future', icon: 'hugeicons:calendar-love-02' },
  { value: 'noDate', label: 'No date', icon: 'hugeicons:calendar-04' },
]

// Status options
const statusOptions = [
  { value: 'IDEA', label: 'Idea', icon: 'hugeicons:ai-idea' },
  { value: 'TODO', label: 'To Do', icon: 'solar:clipboard-outline' },
  { value: 'IN PROGRESS', label: 'In Progress', icon: 'solar:alarm-outline' },
  { value: 'IN REVIEW', label: 'In Review', icon: 'solar:minimalistic-magnifer-bug-outline' },
  { value: 'COMPLETED', label: 'Completed', icon: 'solar:check-circle-outline' },
  { value: 'ABANDONED', label: 'Abandoned', icon: 'solar:trash-bin-trash-outline' },
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

  const filtered: Record<string, MyTask[]> = {}

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
</script>

<template>
  <div class="flex items-center gap-2 bg-transparent justify-end">
    <!-- Filter Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          class="gap-2 cursor-pointer"
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
      <DropdownMenuContent class="w-56 dark:bg-[#1d1d1d]">
        <DropdownMenuLabel class="flex items-center justify-between">
          <p>Filter by</p>
          <button
            v-if="activeFiltersCount > 0"
            class="cursor-pointer text-rose-600"
            @click="clearAllFilters"
          >
            Clear all
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <!-- Status Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger class="cursor-pointer">
            <Activity class="h-4 w-4 mr-2" />
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="dark:bg-[#1d1d1d] grid gap-0.5 w-48">
              <DropdownMenuItem
                v-for="option in statusOptions"
                :key="option.value"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedStatuses.includes(option.value) }"
                @click="toggleStatusFilter(option.value)"
              >
                <Icon
                  :name="option.icon"
                  class="mr-1"
                  size="18"
                />
                <span>{{ option.label }}</span>
                <Check
                  v-if="selectedStatuses.includes(option.value)"
                  class="ml-auto"
                />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Priority Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger class="cursor-pointer">
            <AlertCircle class="h-4 w-4 mr-2" />
            <span>Priority</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="dark:bg-[#1d1d1d] grid gap-0.5 w-48">
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
                <Check
                  v-if="selectedStatuses.includes(option.value)"
                  class="ml-auto"
                />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Due Date Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger class="cursor-pointer">
            <Calendar class="h-4 w-4 mr-2" />
            <span>Due date</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="dark:bg-[#1d1d1d] grid gap-0.5 w-48">
              <DropdownMenuItem
                v-for="option in dueDateOptions"
                :key="option.value"
                class="cursor-pointer"
                :class="{ 'bg-accent': selectedDueDates.includes(option.value) }"
                @click="toggleDueDateFilter(option.value)"
              >
                <Icon
                  :name="option.icon"
                  class="mr-1"
                  size="18"
                />
                <span>{{ option.label }}</span>
                <Check
                  v-if="selectedStatuses.includes(option.value)"
                  class="ml-auto"
                />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <!-- Assignment Filter -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger class="cursor-pointer">
            <Users class="h-4 w-4 mr-2" />
            <span>Assignment</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="dark:bg-[#1d1d1d] grid gap-0.5">
              <Command class="bg-transparent">
                <CommandInput placeholder="Search people.." />
                <CommandList>
                  <CommandEmpty class="p-3">
                    No results found.
                  </CommandEmpty>
                  <CommandGroup heading="Assignees">
                    <CommandItem
                      v-for="assignee in assignees"
                      :key="assignee.member_id"
                      :value="assignee"
                      class="cursor-pointer"
                      :class="{ 'bg-accent': selectedAssignees.includes(assignee.id) }"
                    >
                      <DropdownMenuItem
                        class="p-0 w-full cursor-pointer"
                        @click="toggleAssigneeFilter(assignee.id)"
                      >
                        <Avatar class="size-6">
                          <AvatarImage
                            :src="assignee.avatar"
                            :alt="assignee.username"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span class="leading-none">{{ assignee.username }}</span>
                        <Check
                          v-if="selectedAssignees.includes(assignee.id)"
                          class="ml-auto"
                        />
                      </DropdownMenuItem>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
