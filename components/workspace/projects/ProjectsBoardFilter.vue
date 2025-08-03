<!-- ProjectsBoardFilter.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar, ChevronDown, Activity, AlertCircle, Check } from 'lucide-vue-next'
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
import type { DBProject } from '~/types'

const { projects } = defineProps<{
  projects: Record<string, DBProject[]>
}>()

console.log('Projects', projects)

const emit = defineEmits<{
  'projects-filtered': [newFilteredProjects: Record<string, DBProject[]>]
}>()

// Filter states
const selectedDueDates = ref<string[]>([])
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

// Active filters count
const activeFiltersCount = computed(() => {
  return selectedDueDates.value.length + selectedStatuses.value.length + selectedPriorities.value.length
})

// Helper function to check if date falls within a range
function isDateInRange(date: Date | null, rangeType: string): boolean {
  if (!date) return rangeType === 'noDate'

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

  switch (rangeType) {
    case 'late':
      return date < today
    case 'today':
      return date.toDateString() === today.toDateString()
    case 'tomorrow':
      return date.toDateString() === tomorrow.toDateString()
    case 'thisWeek':
      return date >= startOfWeek && date <= endOfWeek
    case 'nextWeek':
      return date >= startOfNextWeek && date <= endOfNextWeek
    case 'future':
      return date > endOfNextWeek
    case 'noDate':
      return false // handled at the beginning
    default:
      return false
  }
}

// Optimized filter function with better performance
const filteredProjects = computed(() => {
  // If no filters are active, return original projects
  const hasActiveFilters = selectedDueDates.value.length > 0
    || selectedStatuses.value.length > 0
    || selectedPriorities.value.length > 0

  if (!hasActiveFilters) {
    return projects
  }

  const filtered: Record<string, DBProject[]> = {}

  // Convert filter arrays to Sets for O(1) lookup
  const dueDateSet = new Set(selectedDueDates.value)
  const statusSet = new Set(selectedStatuses.value)
  const prioritySet = new Set(selectedPriorities.value)

  Object.entries(projects).forEach(([status, workspace_projects]) => {
    filtered[status] = workspace_projects.filter((project) => {
      // Due date filter
      if (dueDateSet.size > 0) {
        const matchesDueDate = Array.from(dueDateSet).some(selectedDate =>
          isDateInRange(project.dueDate, selectedDate),
        )
        if (!matchesDueDate) return false
      }

      // Status filter
      if (statusSet.size > 0 && !statusSet.has(project.status)) {
        return false
      }

      // Priority filter
      if (prioritySet.size > 0 && !prioritySet.has(project.priority)) {
        return false
      }

      return true
    })
  })

  return filtered
})

// Watch for filter changes and emit
watch(filteredProjects, (newFilteredProjects) => {
  emit('projects-filtered', newFilteredProjects)
}, { immediate: true, deep: true })

// Clear all filters
function clearAllFilters() {
  selectedDueDates.value = []
  selectedStatuses.value = []
  selectedPriorities.value = []
}

// Toggle filter functions
function toggleDueDateFilter(value: string) {
  const index = selectedDueDates.value.indexOf(value)
  if (index > -1) {
    selectedDueDates.value.splice(index, 1)
  }
  else {
    selectedDueDates.value.push(value)
  }
}

function toggleStatusFilter(value: string) {
  const index = selectedStatuses.value.indexOf(value)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  }
  else {
    selectedStatuses.value.push(value)
  }
}

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
  <div class="gap-2 mb-4 bg-transparent flex flex-col items-end">
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
                  class="ml-auto h-4 w-4"
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
                  v-if="selectedPriorities.includes(option.value)"
                  class="ml-auto h-4 w-4"
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
                  v-if="selectedDueDates.includes(option.value)"
                  class="ml-auto h-4 w-4"
                />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
