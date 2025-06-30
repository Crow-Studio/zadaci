<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Container, Font, Head, Hr, Html, Img, Tailwind, Text, Link } from '@vue-email/components'
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
        <Img
          src="https://res.cloudinary.com/dfa1yoc1v/image/upload/v1751271040/rrgh50r6tads0nqxnakg.png"
          alt="Zadaci"
          style="margin: 0 auto; object-fit: contain"
          class="h-16 w-auto rounded-md"
        />
        <Text class="text-center text-2xl font-semibold text-brand">
          You're on the waitlist!
        </Text>
        <Container>
          <Text class="text-base leading-6 text-gray-600">
            Thanks for joining the waitlist for <Link
              href="https://zadaci.vercel.app"
              class="inline font-semibold text-brand"
            >
              Zadaci
            </Link>, an all-in-one project management platform built to help you and your team get things done faster.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            Your spot on the waitlist is officially confirmed.
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            We're currently in a private alpha, but we're onboarding more users gradually.
          </Text>
        </Container>

        <Hr class="mb-3 mt-8 border-gray-200" />

        <Container>
          <Text class="text-center text-sm leading-6 text-gray-600">
            You're receiving this email because you signup for the waitlist on
          </Text>
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
        </Container>
      </Container>
    </Tailwind>
  </Html>
</template>
