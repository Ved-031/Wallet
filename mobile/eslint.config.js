// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const importPlugin = require('eslint-plugin-import');

module.exports = defineConfig([
    expoConfig,

    {
        plugins: {
            import: importPlugin,
        },

        rules: {
            'import/no-unresolved': 'error',
        },

        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },

        ignores: ['dist/*'],
    },
]);
