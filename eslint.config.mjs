import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    name: 'thecodingmontana/tailwind',
    rules: {
      'tailwindcss/no-custom-classname': 'off',
      'vue/no-v-html': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/require-default-prop': 'off',
    },
  },
)
