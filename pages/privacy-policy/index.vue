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
  <section class="mx-auto max-w-6xl space-y-6 p-6">
    <h1 class="text-3xl font-bold">
      Privacy Policy
    </h1>
    <p class="text-sm text-muted-foreground">
      Last updated: 6 August 2025
    </p>

    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        1. Information We Collect
      </h2>
      <p>
        When you use Zadaci, we may collect:
        <br>
        (a) Account Information – such as your name, email address, and profile picture via Google Sign-In;
        <br>
        (b) Project and Workspace Data – including tasks, subtasks, team members, activity logs, and other inputs you provide;
        <br>
        (c) Usage Data – such as device type, IP address, interaction logs, and error reports;
        <br>
        (d) GitHub Data – if you connect your GitHub account, we may access your repositories and issues to sync them with Zadaci. This is done with your explicit consent and can be revoked anytime.
      </p>

      <h2 class="text-xl font-semibold">
        2. How We Use Your Information
      </h2>
      <p>
        We use your information to:
        <br>
        (a) Provide and operate Zadaci’s features;
        <br>
        (b) Improve platform performance and usability;
        <br>
        (c) Send essential service updates (like task status or account notifications);
        <br>
        (d) Monitor and prevent abuse, fraud, or misuse.
      </p>

      <h2 class="text-xl font-semibold">
        3. Google Sign-In
      </h2>
      <p>
        Zadaci uses Google Sign-In for secure authentication. We only access your name, email, and profile picture. We never post on your behalf or access your contacts or files.
      </p>

      <h2 class="text-xl font-semibold">
        4. GitHub Integration
      </h2>
      <p>
        When you connect your GitHub account, Zadaci can read repository and issue data to let you sync tasks with GitHub Issues. We do not write to your GitHub unless you explicitly allow it in future features. You can disconnect GitHub anytime from your account settings.
      </p>

      <h2 class="text-xl font-semibold">
        5. Cookies
      </h2>
      <p>
        We use cookies and similar technologies to enhance your experience and understand usage patterns. You can manage cookie preferences in your browser settings.
      </p>

      <h2 class="text-xl font-semibold">
        6. Data Sharing
      </h2>
      <p>
        We do not sell or trade your personal data. We may share data with trusted service providers (e.g., hosting, analytics) strictly to operate Zadaci. All third parties are bound by confidentiality agreements.
      </p>

      <h2 class="text-xl font-semibold">
        7. Data Security
      </h2>
      <p>
        We implement technical and organizational measures to protect your data from unauthorized access, alteration, or loss. However, no system is 100% secure.
      </p>

      <h2 class="text-xl font-semibold">
        8. Your Rights
      </h2>
      <p>
        You can access, update, or delete your personal data at any time via your account settings. To request complete deletion of your account and all associated data, contact us directly at the email below.
      </p>

      <h2 class="text-xl font-semibold">
        9. Data Retention
      </h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide the Service. You can request permanent deletion of your data at any time.
      </p>

      <h2 class="text-xl font-semibold">
        10. Children’s Privacy
      </h2>
      <p>
        Zadaci is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
      </p>

      <h2 class="text-xl font-semibold">
        11. Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will notify you if they are significant.
      </p>

      <h2 class="text-xl font-semibold">
        12. Contact
      </h2>
      <p>
        For questions or requests regarding your data or this policy, email us at
        <a
          href="mailto:thecodingmontana@gmail.com"
          class="font-semibold text-brand underline hover:text-brand-secondary dark:text-primary"
        >
          thecodingmontana@gmail.com
        </a>.
      </p>
    </div>
  </section>
</template>
