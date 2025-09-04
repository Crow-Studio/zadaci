<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { Calendar, Clock, X } from 'lucide-vue-next'

const isOpen = ref(false)

const dueItems = ref([
  {
    id: 1,
    type: 'project',
    title: 'ConnectBank Redesign',
    dueDate: 'Today',
    assignee: 'Sarah Chen',
    avatar: '👩‍💼',
    priority: 'high',
    description: 'Final design review and handoff',
  },
  {
    id: 2,
    type: 'task',
    title: 'Update user authentication flow',
    dueDate: 'Tomorrow',
    assignee: 'Mike Rodriguez',
    avatar: '👨‍💻',
    priority: 'medium',
    description: 'Implement new security protocols',
  },
  {
    id: 3,
    type: 'project',
    title: 'Mobile App Launch',
    dueDate: 'In 2 days',
    assignee: 'Lisa Park',
    avatar: '👩‍🎨',
    priority: 'high',
    description: 'Beta testing completion required',
  },
  {
    id: 4,
    type: 'task',
    title: 'Database optimization',
    dueDate: 'This week',
    assignee: 'Alex Johnson',
    avatar: '👨‍🔧',
    priority: 'low',
    description: 'Performance improvements needed',
  },
])

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-green-500'
    default: return 'text-gray-500'
  }
}
</script>

<template>
  <div className="fixed bottom-6 right-6 z-50">
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :initial="{ opacity: 0, y: 20, scale: 0.9 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 20, scale: 0.9 }"
        :transition="{ duration: 0.2 }"
        class="absolute bottom-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 class="font-semibold text-gray-900">
              Due Items
            </h3>
            <p class="text-sm text-gray-600">
              {{ dueItems.length }} items need attention
            </p>
          </div>
          <button
            class="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            @click="isOpen = false"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <motion.div
            v-for="(item, index) in dueItems"
            :key="item.id"
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: index * 0.05 }"
            class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div class="flex items-start space-x-3">
              <!-- {getTypeIcon(item.type)} -->

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium text-gray-900 truncate pr-2">
                    {{ item.title }}
                  </p>
                  <span :class="`text-xs px-2 py-1 rounded-full capitalize ${getPriorityColor(item.priority)} bg-current bg-opacity-10`">
                    {{ item.priority }}
                  </span>
                </div>

                <p class="text-sm text-gray-600 mb-2">
                  {{ item.description }}
                </p>

                <div class="flex items-center justify-between text-xs text-gray-500">
                  <div class="flex items-center space-x-1">
                    <Clock class="w-3 h-3" />
                    <span>Due {{ item.dueDate }}</span>
                  </div>

                  <div class="flex items-center space-x-1">
                    <span class="text-lg">{{ item.avatar }}</span>
                    <span>{{ item.assignee }}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100">
          <button class="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View all due items →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>

    <motion.button
      :class="`relative w-14 h-14 bg-brand hover:bg-brand-secondary cursor-pointer text-white rounded-full shadow-lg transition-colors flex items-center justify-center ${
        isOpen ? 'rotate-45' : ''
      }`"
      :style="{ transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out' }"
      :while-hover="{ scale: 1.05 }"
      :while-tap="{ scale: 0.95 }"
      @click="isOpen = !isOpen"
    >
      <X
        v-if="isOpen"
        class="w-6 h-6"
      />
      <div
        v-else
      >
        <Calendar class-name="w-6 h-6" />
        <motion.div
          :initial="{ scale: 0 }"
          :animate="{ scale: 1 }"
          class="absolute -top-1 right-0 size-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {{ dueItems.length }}
        </motion.div>
      </div>
    </motion.button>
  </div>
</template>
