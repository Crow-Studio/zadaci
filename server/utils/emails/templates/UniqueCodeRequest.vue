<script setup lang="ts">
import { Container, Font, Head, Hr, Html, Img, Tailwind, Text } from '@vue-email/components'

const props = defineProps({
  code: String,
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
              brand: '#007291',
            },
          },
        },
      }"
    >
      <Container class="mx-auto max-w-[600px] px-4 py-8">
        <Img
          src="https://res.cloudinary.com/dfa1yoc1v/image/upload/v1732631847/wmmww1qiii7eiprbwphj.png"
          alt="{workspace.name}"
          width="200"
          height="60"
          style="margin: 0 auto; object-fit: contain"
          class="rounded-md"
        />
        <Text class="text-2xl font-semibold">
          The code below is only valid for 10 minutes.
        </Text>
        <Text class="block rounded-md bg-gray-100 p-5 text-center text-3xl text-brand">
          {{ props?.code }}
        </Text>

        <Hr class="my-8 border-gray-200" />

        <Container>
          <Text class="mb-2 text-lg font-bold">
            What is useOdama?
          </Text>
          <Text class="text-base leading-6 text-gray-600">
            use-odama is a platform that provides modern restaurant solutions by simplifying daily operations and enhancing efficiency.
          </Text>
        </Container>
      </Container>
    </Tailwind>
  </Html>
</template>
