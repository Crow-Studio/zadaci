<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Container, Font, Head, Hr, Html, Img, Tailwind, Text, Link } from '@vue-email/components'
import { formatDistance } from 'date-fns'

defineProps({
  sender: String,
  workspace: String,
  link: String,
  expiryDate: String,
})
</script>

<template>
  <Html lang="en">
    <Head>
      <Font
        font-family="Roboto"
        fallback-font-family="Verdana"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          format: 'woff2',
        }"
        :font-weight="400"
        font-style="normal"
      />
    </Head>
    <Tailwind
      :config="{
        theme: {
          extend: {
            colors: {
              brand: '#5e40ae',
            },
          },
        },
        separator: ':',
        safelist: [],
        experimental: {},
        corePlugins: {},
      }"
    >
      <Container class="mx-auto max-w-[650px] bg-gray-100 p-5">
        <Link
          href="https://use-odama.thecodingmontana.com"
          class="flex items-center justify-center"
        >
          <Img
            src="https://res.cloudinary.com/dfa1yoc1v/image/upload/v1732631847/wmmww1qiii7eiprbwphj.png"
            alt="{workspace.name}"
            width="200"
            height="60"
            style="margin: 0 auto;"
            class="rounded-md object-contain"
          />
        </Link>
        <Container>
          <Text class="text-2xl font-semibold text-brand">
            You've been invited to join {{ workspace }} Workspace on use-odama 🎉.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            {{ sender }}, invited you to join {{ workspace }} Workspace. Join now to start collaborating!
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            👉 Click the button below to accept your invitation and get started:
          </Text>
          <Link
            :href="link!"
            class="bg-brand"
            style="display: block; text-align: center; color: white; padding: 12px; border-radius: 6px; text-decoration: none; font-size: 16px; text-transform: capitalize;"
          >
            Accept invitation to join {{ workspace }} Workspace
          </Link>
          <Text class="text-base leading-6 text-gray-600">
            This invitation will expire {{ formatDistance(expiryDate!, new Date(), {
              addSuffix: true,
            }) }}, so be sure to join before then!
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            If you weren’t expecting this invite, you can safely ignore this message.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            Looking forward to having you onboard!
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            Best regards,
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            use-odama Team.
          </Text>
        </Container>

        <Hr class="mb-3 mt-8 border-gray-200" />

        <Container>
          <Text class="text-base leading-6 text-gray-600">
            If the the button above doesn't open, you can also copy and paste the below address into your browser
          </Text>
          <Link
            :href="link!"
            class="text-base"
          >
            {{ link }}
          </Link>
        </Container>
      </Container>
    </Tailwind>
  </Html>
</template>
