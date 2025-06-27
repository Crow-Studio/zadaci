<script setup lang="ts">
type IAuthProvider = 'google' | 'facebook'

const onSigninWith = (provider: IAuthProvider) => {
  window.location.href = `/api/auth/signin/${provider}`
}
</script>

<template>
  <div class="grid gap-2 overflow-hidden">
    <div class="flex h-[42px] items-center !overflow-hidden">
      <button
        class="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded border px-2 text-sm font-medium duration-300 hover:border-orange-200"
        @click="onSigninWith('google')"
      >
        <Icon
          name="devicon:google"
          class="size-4"
        />
        Continue with Google
      </button>
    </div>
  </div>
</template>
