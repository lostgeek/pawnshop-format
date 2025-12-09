import eslintPluginStylistic from '@stylistic/eslint-plugin'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import pluginVue from 'eslint-plugin-vue'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt().append(
  // ********************
  // novu eslint config
  // will be displayed in the eslint inspector
  // ********************
  {
    name: 'novu eslint config start',
  },

  // ********************
  // common js/ts
  // ********************
  {
    name: 'novu common config',
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-destructuring': 'off',
      'eqeqeq': ['error', 'smart'],
      'no-undef': 'off', // done by typescript
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      'no-multi-assign': 'error',
    },
  },

  // ********************
  // vue
  // ********************
  {
    name: 'novu vue config',
    rules: {
      /**
       *  spread rules from eslint-plugin-vue, using the config directly does not work
       *
       *  Using the rules directly leads to this error in ESLint:
       *  [error] Error: ESLintFlatConfigUtils: Different instances of plugin "vue" found in multiple configs: nuxt/vue/setup, vue/base/setup. It's likely you misconfigured the merge of these configs.
       *
       *  If anyone can find out why, bring it up in the circle.
       */
      ...pluginVue.configs['flat/recommended'].reduce((acc, cfg) => ({
        ...acc,
        ...cfg.rules,
      }), {}),
      'vue/html-button-has-type': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-multiple-template-root': 'off',
    },
  },

  // ********************
  // stylistic
  // ********************
  eslintPluginStylistic.configs['recommended'],
  {
    name: 'novu stylistic config',
    rules: {
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      '@stylistic/nonblock-statement-body-position': 'error',
      '@stylistic/one-var-declaration-per-line': 'error',
      '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/no-mixed-operators': 'off',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/array-bracket-newline': ['error', { multiline: true }],
      '@stylistic/array-element-newline': [
        'error',
        {
          multiline: true,
          consistent: true,
        },
      ],
      '@stylistic/object-curly-newline': [
        'error',
        {
          multiline: true,
          consistent: true,
        },
      ],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },

  // ********************
  // vue a11y
  // ********************
  vueA11y.configs['flat/recommended'],
  {
    name: 'novu vue a11y config',
    rules: {},
  },

  // ********************
  // better-tailwindcss
  // ********************
  {
    name: 'novu better tailwind config',
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
      },
    },
    rules: {
      // enable all recommended rules to report a warning
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
    },
  },
)
