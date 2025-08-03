<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import SvgBackgroundPattern from '~/components/svgs/SvgBackgroundPattern.vue'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

const { params, query } = useRoute()

definePageMeta({
  layout: 'auth',
})

const { data: workspace, error, status } = await useAsyncData('workspace_invite', () => useRequestFetch()(`/api/workspace/invite/${params.inviteCode}/details?email=${query.email}`))

const isDeclineInvite = ref(false)
const isAcceptInvite = ref(false)
const declineMessage = ref('')
const acceptMessage = ref('')

const onAcceptInvite = async () => {
  try {
    isAcceptInvite.value = true

    const res = await $fetch(`/api/workspace/invite/${params.inviteCode}/accept`, {
      method: 'POST',
      body: {
        email: query.email,
      },
    })
    acceptMessage.value = res.message
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isAcceptInvite.value = false
  }
}

const onDeclineInvite = async () => {
  try {
    isDeclineInvite.value = true

    const res = await $fetch(`/api/workspace/invite/${params.inviteCode}/decline`, {
      method: 'DELETE',
      body: {
        email: query.email,
      },
    })

    declineMessage.value = res.message
  }
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.statusMessage
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isDeclineInvite.value = false
  }
}
</script>

<template>
  <div class="relative flex h-screen w-full flex-col overflow-hidden">
    <div class="relative size-full overflow-hidden">
      <div class="h-screen w-full overflow-hidden">
        <div class="relative h-screen w-screen overflow-hidden">
          <div class="absolute inset-0 z-0 dark:hidden">
            <SvgBackgroundPattern class="size-full" />
          </div>
          <div class="relative z-10 flex h-screen w-screen flex-col overflow-hidden overflow-y-auto">
            <div
              class="container mx-auto flex h-[100vh-60px] max-w-lg grow flex-col justify-center px-10 transition-all lg:px-5"
            >
              <div
                v-if="status ==='idle' || status ==='pending'"
                class="relative flex flex-col items-center"
              >
                <Loader2 class="size-10 animate-spin" />
                <p class="animate-pulse">
                  Loading...!
                </p>
              </div>
              <div
                v-else-if="error"
                class="relative flex flex-col items-center space-y-4"
              >
                <NuxtLink
                  to="/"
                  class="flex items-center gap-x-2.5"
                >
                  <SvgsZadaci class="w-[3rem] h-auto" />
                  <h1 class="text-5xl mt-1 font-semibold font-bebas-neue">Zadaci</h1>
                </NuxtLink>
                <div class="text-center">
                  <h3 class="text-3xl font-bold">
                    Whoops..!
                  </h3>
                  <p class="max-w-lg text-balance">
                    {{ error.statusMessage }}
                  </p>
                </div>
                <NuxtLink to="/">
                  <Button class="inline-flex text-sm font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2 w-full group hover:translate-y-0.5 duration-300 ease-in-out cursor-pointer">
                    Continue to Zadaci
                    <Icon
                      name="lucide-arrow-right"
                      class="-rotate-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      size="15"
                    />
                  </Button>
                </nuxtlink>
              </div>
              <div
                v-else-if="acceptMessage"
                class="relative flex flex-col items-center space-y-4"
              >
                <NuxtLink
                  to="/"
                  class="flex items-center gap-x-2.5"
                >
                  <SvgsZadaci class="w-[3rem] h-auto" />
                  <h1 class="text-5xl mt-1 font-semibold font-bebas-neue">Zadaci</h1>
                </NuxtLink>
                <div class="text-center">
                  <p class="max-w-lg text-balance">
                    {{ acceptMessage }}
                  </p>
                </div>
                <NuxtLink to="/auth/signin">
                  <Button class="inline-flex text-sm font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2 w-full group hover:translate-y-0.5 duration-300 ease-in-out cursor-pointer">
                    Signin to Zadaci
                    <Icon
                      name="lucide-arrow-right"
                      class="-rotate-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      size="15"
                    />
                  </Button>
                </nuxtlink>
              </div>
              <div
                v-else-if="declineMessage"
                class="relative flex flex-col items-center space-y-4"
              >
                <NuxtLink
                  to="/"
                  class="flex items-center gap-x-2.5"
                >
                  <SvgsZadaci class="w-[3rem] h-auto" />
                  <h1 class="text-5xl mt-1 font-semibold font-bebas-neue">Zadaci</h1>
                </NuxtLink>
                <div class="text-center">
                  <p class="max-w-lg text-balance">
                    {{ declineMessage }}
                  </p>
                </div>
                <NuxtLink to="/">
                  <Button class="inline-flex text-sm font-medium items-center justify-center rounded-lg transition-colors focus:ring-4 focus:outline-none h-max disabled:cursor-not-allowed border border-transparent bg-brand text-white hover:bg-primary-secondary disabled:shadow-xs disabled:hover:shadow-xs shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(249,129,99,1)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_#F97452_inset] hover:shadow-[0rem_-0.0625rem_0rem_0.0625rem_rgba(252,199,185,0.8)_inset,_0rem_0rem_0rem_0.0625rem_#F97452_inset,_0rem_0.03125rem_0rem_0.09375rem_hsla(0,_0%,_100%,_0.25)_inset] px-4 py-2 w-full group hover:translate-y-0.5 duration-300 ease-in-out cursor-pointer">
                    Continue to Zadaci
                    <Icon
                      name="lucide-arrow-right"
                      class="-rotate-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      size="15"
                    />
                  </Button>
                </nuxtlink>
              </div>
              <div
                v-else-if="workspace && status ==='success'"
                class="relative flex flex-col space-y-6"
              >
                <div class="space-y-4 text-center">
                  <Avatar class="size-16 rounded-md mx-auto">
                    <AvatarImage
                      :src="workspace.image_url"
                      :alt="workspace.name"
                    />
                    <AvatarFallback class="rounded-md">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <h3 class="text-3xl font-bold text-brand dark:text-primary">
                    You've been invited to join the <br>
                    {{ workspace.name }} Workspace in <NuxtLink
                      to="/"
                      target="_blank"
                      class="hover:underline"
                    >Zadaci</NuxtLink>.
                  </h3>
                  <div class="space-y-0.5 rounded-xl border py-3">
                    <h4>Managed by:</h4>
                    <div class="flex items-center justify-center gap-x-2">
                      <Avatar>
                        <AvatarImage
                          :src="workspace.owner.profile_picture_url!"
                          :alt="workspace.owner.username!"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div class="text-start">
                        <h5 class="text-sm">
                          {{ workspace.owner.username }}
                        </h5>
                        <p class="text-xs text-muted-foreground">
                          {{ workspace.owner.email }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="grid gap-2">
                    <Button
                      :disabled="isDeclineInvite || isAcceptInvite"
                      class="w-full gap-2 bg-brand hover:bg-brand-secondary dark:text-primary"
                      @click="onAcceptInvite"
                    >
                      <Loader2
                        v-if="isAcceptInvite"
                        class="size-4 animate-spin"
                      />
                      Join Workspace
                    </Button>
                    <Button
                      variant="ghost"
                      class="w-full gap-2"
                      :disabled="isDeclineInvite || isAcceptInvite"
                      @click="onDeclineInvite"
                    >
                      <Loader2
                        v-if="isDeclineInvite"
                        class="size-4 animate-spin"
                      />
                      No thanks
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
