<script setup lang="ts">
import { Minus, Plus, Search, X, XCircle } from 'lucide-vue-next'
import { AnimatePresence, motion } from 'motion-v'
import { faqData, faqsCategories } from '~/data'
import { cn } from '~/lib/utils'

interface FAQsSearchResult {
  category: string
  faq: {
    question: string
    answer: string
  }
  index: number
  id: string
}

const searchQuery = ref('')
const expandedFAQ = ref<string | null>(null)
type FAQCategory = keyof typeof faqData
const activeCategory = ref<FAQCategory>('Projects')
const searchResults = ref<FAQsSearchResult[]>([])
const isSearching = ref(false)

const handleCategoryClick = (categoryName: FAQCategory) => {
  activeCategory.value = categoryName
  expandedFAQ.value = null
  isSearching.value = false
  searchResults.value = []
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  const results: FAQsSearchResult[] = []

  Object.entries(faqData).forEach(([category, faqs]) => {
    faqs.forEach((faq, index) => {
      const questionMatch = faq.question.toLowerCase().includes(query)
      const answerMatch = faq.answer.toLowerCase().includes(query)

      if (questionMatch || answerMatch) {
        results.push({
          category,
          faq,
          index,
          id: `${category}-${index}`,
        })
      }
    })
  })

  searchResults.value = results
  isSearching.value = true
  expandedFAQ.value = null
}

const handleSearchKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleSearch()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  isSearching.value = false
  searchResults.value = []
}
</script>

<template>
  <div class="container mx-auto px-4 max-w-full mb-5 space-y-10">
    <motion.div
      :initial="{ opacity: 0, y: 30 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6 }"
      class="space-y-3"
    >
      <h2 class="text-4xl">
        Is it help you're looking for?
      </h2>
      <div class="max-w-2xl">
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <div class="relative flex-1 w-full">
            <X
              v-if="searchResults.length > 0"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
              @click="clearSearch"
            />
            <Search
              v-else
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="type your question...?"
              class="w-full pl-12 pr-4 py-4 border-input bg-[#fafafa] dark:bg-[#1d1d1d] rounded-xl placeholder-gray-400 focus:outline-none focus:border-transparent transition-all outline-none border focus:ring-input focus:ring-2"
              @keydown.enter="handleSearchKeyPress($event)"
            >
          </div>
        </div>
      </div>
    </motion.div>
    <motion.div
      v-if="isSearching"
      :initial="{ opacity: 0, y: 30 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.2 }"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-muted-foreground uppercase">
          Search Results {{ searchResults.length > 0 && `(${searchResults.length})` }}
        </h3>
        <motion.button
          :while-hover="{ scale: 1.05 }"
          :while-press="{ scale: 0.95 }"
          class="px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer uppercase text-muted-foreground font-bold"
          @click="clearSearch"
        >
          <XCircle />
          Clear Search
        </motion.button>
      </div>
      <div
        v-if="searchResults.length === 0"
        class="flex flex-col items-center py-12"
      >
        <Search class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <div class="text-center">
          <h3 class="text-xl font-medium mb-2">
            No results found
          </h3>
          <p class="text-muted-foreground max-w-sm">
            Try searching with different keywords or browse categories above.
          </p>
        </div>
      </div>
      <div
        v-else
        class="space-y-4"
      >
        <motion.div
          v-for="result in searchResults"
          :key="result.id"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          class="overflow-hidden"
        >
          <div class="py-3">
            <span class="font-medium uppercase">
              {{ result.category }} - FAQs
            </span>
          </div>
          <div class="border rounded-xl bg-brand-secondary">
            <button
              class="w-full px-6 py-4 flex items-center text-left cursor-pointer transition-colors"
              @click="() => expandedFAQ = expandedFAQ === result.id ? null : result.id"
            >
              <span class="text-lg text-white mr-4 flex-shrink-0">
                <Minus v-if="expandedFAQ === result.id" />
                <Plus v-else />
              </span>
              <span className="font-medium text-white">{{ result.faq.question }}</span>
            </button>

            <AnimatePresence>
              <motion.div
                v-if="expandedFAQ === result.id"
                :initial="{ height: 0, opacity: 0 }"
                :animate="{ height: 'auto', opacity: 1 }"
                :exit="{ height: 0, opacity: 0 }"
                :transition="{ duration: 0.3, ease: 'easeOut' }"
                class="overflow-hidden"
              >
                <div class="px-6 pb-4 text-muted-foreground border-t border-gray-700/50">
                  <p class="pt-4 text-white">
                    {{ result.faq.answer }}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
    <motion.div
      v-else
      :initial="{ opacity: 0, y: 30 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.2 }"
      class="space-y-5"
    >
      <h3 class="text-base font-bold text-muted-foreground uppercase">
        or browse by category
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          v-for="(category, index) in faqsCategories"
          :key="index"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: index * 0.2 }"
          :while-hover="{ scale: 1.02, y: -2 }"
          :class="cn(
            'border rounded-2xl cursor-pointer p-5 shadow bg-[#fafafa] dark:bg-[#1d1d1d]',
            activeCategory === category.name && 'border-2 border-brand-secondary',
          )"
          @click="handleCategoryClick(category.name as FAQCategory)"
        >
          <div class="flex flex-col items-center gap-y-2.5">
            <Icon
              :name="category.icon"
              size="40"
            />
            <p class="uppercase">
              {{ category.name }}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
    <motion.div
      v-if="!isSearching"
      :initial="{ opacity: 0, y: 30 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.4 }"
      class="space-y-2"
    >
      <div class="py-3">
        <span class="font-bold uppercase">
          {{ activeCategory }} - FAQs
        </span>
      </div>
      <motion.div
        v-for="(faq, index) in faqData[activeCategory]"
        :key="`${activeCategory}-${index}`"
        :initial="{ opacity: 0, x: -20 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ delay: index * 0.4, duration: 0.4 }"
        class="overflow-hidden"
      >
        <div class="border rounded-xl bg-brand-secondary">
          <button
            class="w-full px-6 py-4 flex items-center text-left cursor-pointer transition-colors"
            @click="() => expandedFAQ = expandedFAQ === `${activeCategory}-${index}` ? null : `${activeCategory}-${index}`"
          >
            <span class="text-lg text-white mr-4 flex-shrink-0">
              <Minus v-if="expandedFAQ === `${activeCategory}-${index}`" />
              <Plus v-else />
            </span>
            <span className="font-medium text-white">{{ faq.question }}</span>
          </button>

          <AnimatePresence>
            <motion.div
              v-if="expandedFAQ === `${activeCategory}-${index}`"
              :initial="{ height: 0, opacity: 0 }"
              :animate="{ height: 'auto', opacity: 1 }"
              :exit="{ height: 0, opacity: 0 }"
              :transition="{ duration: 0.3, ease: 'easeOut' }"
              class="overflow-hidden"
            >
              <div class="px-6 pb-4 text-muted-foreground border-t border-gray-700/50">
                <p class="pt-4 text-white">
                  {{ faq.answer }}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  </div>
</template>
