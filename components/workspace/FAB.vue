<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { Calendar, Clock, Loader2, X } from 'lucide-vue-next'
import { isToday, isTomorrow, isThisWeek, format } from 'date-fns'
import { Badge } from '../ui/badge'
import ActionTooltip from './global/ActionTooltip.vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '~/lib/utils'

const isOpen = ref(false)
const fabRef = ref<HTMLElement | null>(null)

const workspaceStore = useWorkspaceStore()
const workspace = computed(() => workspaceStore?.activeWorkspace)

const { data: dueItems, status } = await useAsyncData(
  `workspace_user_due_items_${workspace.value?.id}`,
  () => useRequestFetch()(`/api/workspace/${workspace.value?.id}/due`),
)

const formatDueDate = (date: string | Date) => {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isThisWeek(d)) return format(d, 'EEEE')
  return format(d, 'MMM d, yyyy')
}

onMounted(() => {
  const handler = (e: MouseEvent) => {
    if (isOpen.value && fabRef.value && !fabRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})
</script>

<template>
  <div
    ref="fabRef"
    class="fixed bottom-6 right-6 z-50"
  >
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :initial="{ opacity: 0, y: 20, scale: 0.9 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 20, scale: 0.9 }"
        :transition="{ duration: 0.2 }"
        class="absolute bottom-16 right-0 w-96 bg-[#fafafa] dark:bg-[#1d1d1d] rounded-2xl shadow-2xl border border-input overflow-hidden"
      >
        <div class="flex items-center justify-between p-4 border-b bg-[#f1f1f1] dark:bg-[#343434]">
          <div>
            <h3 class="font-semibold">
              Due Items
            </h3>
            <p
              v-if="dueItems && dueItems.length > 0"
              class="text-sm text-muted-foreground"
            >
              {{ dueItems?.length }} items need attention
            </p>
            <p
              v-else
              class="text-sm text-gray-600"
            >
              No items needs your attention
            </p>
          </div>
          <button
            class="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            @click="isOpen = false"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div
          class="max-h-96 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <template v-if="dueItems?.length">
            <NuxtLink
              v-for="(item, index) in dueItems"
              :key="item.id"
              :to="`/workspace/${workspace?.id}/projects/${item.projectId}`"
              class="block"
            >
              <motion.div
                :initial="{ opacity: 0, x: -20 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ delay: index * 0.05 }"
                class="p-4 border-b hover:bg-[#f1f1f1] dark:hover:bg-[#343434] cursor-pointer transition-colors group"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <p class="font-medium truncate pr-2">
                        {{ item.title }}
                      </p>
                      <Badge
                        :class="cn(
                          'rounded text-xs gap-x-1 flex',
                          item.priority === 'MEDIUM' && 'bg-amber-100 dark:bg-amber-100 text-amber-500',
                          item.priority === 'LOW' && 'bg-purple-100 dark:bg-purple-100 text-purple-500',
                          item.priority === 'HIGH' && 'bg-rose-100 dark:bg-rose-100 text-rose-500',
                          item.priority === 'NONE' && 'bg-zinc-100 dark:bg-zinc-100 text-zinc-500',
                        )"
                      >
                        <div
                          :class="cn(
                            'rounded-full size-1.5 shrink-0',
                            item.priority === 'MEDIUM' && 'bg-amber-500',
                            item.priority === 'LOW' && 'bg-purple-500',
                            item.priority === 'HIGH' && 'bg-rose-500',
                            item.priority === 'NONE' && 'bg-zinc-500',
                          )"
                        />
                        {{ item.priority }}
                      </Badge>
                    </div>

                    <p class="text-sm text-muted-foreground mb-2">
                      {{ item.description }}
                    </p>

                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                      <div class="flex items-center space-x-1">
                        <Clock class="w-3 h-3" />
                        <span>Due {{ formatDueDate(item.dueDate) }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <ActionTooltip :label="item.assignee">
                          <Avatar class="h-6 w-6">
                            <AvatarImage
                              :src="item.avatar!"
                              alt="assignee avatar"
                            />
                            <AvatarFallback>{{ item.assignee?.[0] ?? '?' }}</AvatarFallback>
                          </Avatar>
                        </ActionTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </NuxtLink>
          </template>

          <template v-else>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <Calendar class="w-10 h-10 mb-3 text-gray-400" />
              <p class="text-sm font-medium">
                No due items
              </p>
              <p class="text-xs text-gray-400">
                You’re all caught up for now
              </p>
            </div>
          </template>
        </div>
      </motion.div>
    </AnimatePresence>

    <motion.button
      v-if="status === 'idle' || status === 'pending'"
      :class="`relative w-14 h-14 bg-brand hover:bg-brand-secondary cursor-pointer text-white rounded-full shadow-lg flex items-center justify-center ${
        isOpen ? 'rotate-45' : ''
      }`"
    >
      <Loader2
        v-if="isOpen"
        class="w-6 h-6 animate-spin"
      />
    </motion.button>

    <motion.button
      v-else
      :class="`relative w-14 h-14 bg-brand hover:bg-brand-secondary cursor-pointer text-white rounded-full shadow-lg flex items-center justify-center ${
        isOpen ? 'rotate-45' : ''
      }`"
      @click="isOpen = !isOpen"
    >
      <X
        v-if="isOpen"
        class="w-6 h-6"
      />
      <div v-else>
        <Calendar class="w-6 h-6" />
        <motion.div
          v-if="dueItems?.length"
          :initial="{ scale: 0 }"
          :animate="{ scale: 1 }"
          class="absolute -top-1 right-0 size-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {{ dueItems?.length }}
        </motion.div>
      </div>
    </motion.button>
  </div>
</template>
