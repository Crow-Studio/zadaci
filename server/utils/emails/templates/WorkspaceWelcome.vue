<script setup lang="ts">
import { Container, Font, Head, Hr, Html, Img, Tailwind, Text, Link } from '@vue-email/components'

defineProps({
  workspace: String,
  link: String,
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
              brand: '#F97452',
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
          href="https://zadaci.vercel.app"
          class="flex items-center justify-center"
        >
          <Img
            src="https://res.cloudinary.com/dfa1yoc1v/image/upload/v1751271040/rrgh50r6tads0nqxnakg.png"
            alt="Zadaci"
            width="200"
            height="60"
            style="margin: 0 auto;"
            class="rounded-md object-contain h-16 w-auto"
          />
        </Link>
        <Container>
          <Text class="text-2xl font-semibold text-brand">
            🎉 Welcome to {{ workspace }} workspace!
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            Hi there 👋,
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            You’ve been successfully added to <strong>{{ workspace }}</strong>, and an account has been created for you.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            You can now log in and start collaborating with your team.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            If you have any questions, feel free to reach out to the workspace admin.
          </Text>
          <Link
            :href="link!"
            class="bg-brand"
            style="display: block; text-align: center; color: white; padding: 12px; border-radius: 6px; text-decoration: none; font-size: 16px; text-transform: capitalize;"
          >
            Go to Workspace
          </Link>
          <Text class="text-base leading-6 text-gray-600">
            – The Team
          </Text>
        </Container>

        <Hr class="mb-3 mt-8 border-gray-200" />

        <Container>
          <Text class="text-base leading-6 text-gray-600">
            If the button above doesn't open, you can also copy and paste the below address into your browser
          </Text>
          <Link
            :href="link!"
            class="text-sm"
          >
            {{ link }}
          </Link>
        </Container>
      </Container>
    </Tailwind>
  </Html>
</template>
