import VueDnDKitPlugin from '@vue-dnd-kit/core'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  VueDnDKitPlugin.install(nuxtApp.vueApp)
})
