<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import type { IAuthProvider } from '~/types'

const oauthStore = useOauthStore()
const lastUsedMethod = ref<'email' | 'google' | 'github' | null>(null)

const oauth = computed(() => {
  return oauthStore?.oauth
})

const onSigninWith = (provider: IAuthProvider) => {
  oauthStore?.onSigninWithOauthProvider({
    isSigninWithOauth: true,
    provider,
  })
  lastUsedMethod.value = provider
  localStorage.setItem('lastUsedMethod', provider)
  window.location.href = `/api/auth/signin/${provider}`
}

onMounted(() => {
  const stored = localStorage.getItem('lastUsedMethod')
  if (stored) lastUsedMethod.value = stored as any
})
</script>

<template>
  <div class="grid gap-2 overflow-hidden">
    <div class="flex h-[42px] items-center !overflow-hidden relative">
      <button
        :disabled="oauth.isSigninWithOauth"
        :class="cn(
          'flex h-[42px] w-full items-center justify-center gap-2 rounded border px-2 text-sm font-medium duration-300 hover:border-orange-200',
          oauth.isSigninWithOauth ? 'cursor-not-allowed' : 'cursor-pointer',
        )"
        @click="onSigninWith('google')"
      >
        <Loader2
          v-if="oauth.isSigninWithOauth && oauth.provider ==='google'"
          class="size-4 animate-spin"
        />
        <Icon
          v-else
          name="devicon:google"
          class="size-4"
        />
        Continue with Google
        <span
          v-if="lastUsedMethod === 'google'"
          class="absolute right-2 top-2 rounded px-2 py-0.5 text-xs font-semibold border bg-background"
        >Last used</span>
      </button>
    </div>
  </div>
</template>
