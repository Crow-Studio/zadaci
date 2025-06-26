<script setup lang="ts">
useHead({
  titleTemplate: '%s - Privacy Policy',
})

defineOgImageComponent('Zadaci', {
  title: 'Privacy Policy | Zadaci',
  description: 'Learn how Zadaci collects, uses, and protects your personal information. Your privacy matters to us.',
})
</script>

<template>
  <section class="mx-auto mt-16 max-w-6xl space-y-6 p-6">
    <h1 class="text-3xl font-bold">
      Privacy Policy
    </h1>
    <p class="text-sm text-muted-foreground">
      Last updated: 27 March 2025
    </p>

    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        1. Information We Collect
      </h2>
      <p>When you use Zadaci, we may collect: <br>(a) Account Information (name, email, profile picture via Google Sign-In); <br>(b) Restaurant Data (menus, orders, inventory, team info); <br>(c) Usage Data (analytics, device info, interaction data).</p>

      <h2 class="text-xl font-semibold">
        2. How We Use Your Information
      </h2>
      <p>We use your information to: (a) provide and improve the Service; (b) personalize your experience; (c) send account-related updates; (d) prevent fraud and abuse.</p>

      <h2 class="text-xl font-semibold">
        3. Google Sign-In
      </h2>
      <p>Zadaci uses Google Sign-In to securely log you in. We only access your name, email, and profile picture. Your Google data is not shared with third parties.</p>

      <h2 class="text-xl font-semibold">
        4. Cookies
      </h2>
      <p>We use cookies to enhance your experience. You can disable cookies in your browser, but some features may not function correctly.</p>

      <h2 class="text-xl font-semibold">
        5. Sharing of Information
      </h2>
      <p>We do not sell your information. We may share data with trusted third parties for essential services (e.g., hosting, analytics) under strict confidentiality agreements.</p>

      <h2 class="text-xl font-semibold">
        6. Data Security
      </h2>
      <p>We take appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.</p>

      <h2 class="text-xl font-semibold">
        7. Your Rights
      </h2>
      <p>You can access, update, or delete your information at any time. To request data deletion, contact us directly.</p>

      <h2 class="text-xl font-semibold">
        8. Children's Privacy
      </h2>
      <p>Zadaci is not intended for children under 18. We do not knowingly collect data from minors.</p>

      <h2 class="text-xl font-semibold">
        9. Changes to this Policy
      </h2>
      <p>We may update this policy. We'll notify you of significant changes via the Service or email.</p>

      <h2 class="text-xl font-semibold">
        10. Contact
      </h2>
      <p>
        For questions or concerns, email us at <a
          href="mailto:thecodingmontana@gmail.com"
          class="font-semibold text-brand underline hover:text-brand-secondary dark:text-primary"
        >thecodingmontana@gmail.com</a>.
      </p>
    </div>
  </section>
</template>
