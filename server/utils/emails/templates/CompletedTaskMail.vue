<script setup lang="ts">
import { Container, Font, Head, Hr, Html, Img, Tailwind, Text, Link } from '@vue-email/components'

defineProps({
  user: String,
  task: String,
  project: String,
  workspace: String,
  completedBy: String,
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
            ✅ Task "{{ task }}" has been marked as completed!
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            Hi {{ user }},
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            The task <strong>{{ task }}</strong> from project <strong>{{ project }}</strong> in workspace <strong>{{ workspace }}</strong> has been marked as completed by <strong>{{ completedBy }}</strong>.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            You can view more details or continue collaborating on Zadaci.
          </Text>
          <Link
            :href="link!"
            class="bg-brand"
            style="display: block; text-align: center; color: white; padding: 12px; border-radius: 6px; text-decoration: none; font-size: 16px;"
          >
            View Project
          </Link>
        </Container>

        <Hr class="mb-3 mt-8 border-gray-200" />

        <Container>
          <Text class="text-sm text-gray-500">
            You received this because you're a member of the project {{ project }} in workspace {{ workspace }}.
          </Text>
        </Container>
      </Container>
    </Tailwind>
  </Html>
</template>
