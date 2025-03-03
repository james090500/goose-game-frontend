import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
    ...pluginVue.configs['flat/strongly-recommended'],
    eslintConfigPrettier,
    eslintPluginPrettier
]