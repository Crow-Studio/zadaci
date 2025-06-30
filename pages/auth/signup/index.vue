<script setup lang="ts">
import OauthProviders from '~/components/auth/oauth/OauthProviders.vue'
import SignupForm from '~/components/auth/signup/SignupForm.vue'
import ThemeToggle from '~/components/shared/ThemeToggle.vue'

definePageMeta({
  layout: 'auth',
})

const { loggedIn } = useUserSession()

watch(() => loggedIn.value, (loggedIn) => {
  if (loggedIn) {
    navigateTo('/workspace/dashboard')
  }
}, {
  immediate: true,
})

useHead({
  titleTemplate: '%s - Sign up',
})

defineOgImageComponent('Zadaci', {
  title: 'Create an account',
  description: 'Say Hello 👋 to Effortless Project Management',
})
</script>

<template>
  <div class="relative flex h-screen w-full flex-col overflow-hidden">
    <div class="relative size-full overflow-hidden">
      <div class="h-screen w-full overflow-hidden">
        <div class="relative h-screen w-screen overflow-hidden">
          <div class="absolute inset-0 z-0 dark:hidden">
            <SvgsSvgBackgroundPattern class="size-full" />
          </div>
          <div class="relative z-10 flex h-[80vh] w-screen flex-col overflow-hidden overflow-y-auto">
            <div
              class="flex justify-end p-5"
            >
              <ThemeToggle />
            </div>
            <div
              class="container mx-auto flex h-[100vh-60px] max-w-lg grow flex-col justify-center px-10 transition-all lg:max-w-md lg:px-5"
            >
              <div class="relative flex flex-col space-y-3">
                <div class="flex flex-col items-center gap-y-4">
                  <NuxtLink
                    to="/"
                    class="flex items-center gap-x-2.5"
                  >
                    <SvgsZadaci class="w-[3rem] h-auto" />
                    <h1 class="text-5xl mt-1 font-semibold font-bebas-neue">Zadaci</h1>
                  </NuxtLink>
                  <div class="space-y-1 text-center">
                    <h3 class="text-3xl font-bold text-brand dark:text-primary capitalize">
                      Get started now!
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Easily stay organized and on track.
                    </p>
                  </div>
                </div>
                <SignupForm />
                <div class="flex items-center">
                  <hr class="w-full">
                  <p class="mx-3 shrink-0 text-center text-sm">
                    or
                  </p>
                  <hr class="w-full">
                </div>
                <OauthProviders />
                <p class="text-center text-sm">
                  Already have an account? <NuxtLink
                    to="/auth/signin"
                    class="underline decoration-wavy cursor-pointer"
                  >Sign in</NuxtLink>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
