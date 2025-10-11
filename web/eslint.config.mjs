import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import prettierPlugin from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        plugins: {
            prettier: prettierPlugin,
        },
        extends: [
            'plugin:prettier/recommended', // 可选，如果想用官方推荐
            ...compat.extends('prettier'), // 禁用所有与 Prettier 冲突的 ESLint 规则
        ],
        rules: {
            'prettier/prettier': 'error', // 把格式问题作为错误
        },
    },
]

export default eslintConfig
