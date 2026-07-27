/**
 * @file ESLint flat configuration: typescript-eslint + JSDoc discipline +
 * stylistic rules (indent 4, max-len 120).
 */

import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['build/', 'node_modules/']),
    {
        files: ['**/*.ts'],
        extends: [
            tseslint.configs.recommended,
            jsdoc.configs['flat/recommended-typescript-error'],
        ],
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/max-len': ['error', { code: 120 }],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            curly: ['error', 'all'],
            'no-console': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            // Types are expressed in TypeScript, not JSDoc tags.
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-throws-type': 'off',
            'jsdoc/require-throws': 'error',
            'jsdoc/require-file-overview': 'error',
            'jsdoc/multiline-blocks': ['error', { noSingleLineBlocks: true }],
            'jsdoc/lines-before-block': 'error',
            'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
            'jsdoc/sort-tags': [
                'error',
                {
                    tagSequence: [
                        { tags: ['file'] },
                        { tags: ['see'] },
                        { tags: ['param'] },
                        { tags: ['returns'] },
                        { tags: ['throws'] },
                        { tags: ['example'] },
                    ],
                },
            ],
            'jsdoc/require-jsdoc': [
                'error',
                {
                    require: {
                        ClassDeclaration: true,
                        MethodDefinition: true,
                        FunctionDeclaration: true,
                    },
                    contexts: [
                        'TSInterfaceDeclaration',
                        'TSInterfaceDeclaration TSPropertySignature',
                        'TSTypeAliasDeclaration',
                        'Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
                        'Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
                    ],
                },
            ],
            'jsdoc/require-description': [
                'error',
                {
                    contexts: [
                        'ClassDeclaration',
                        'MethodDefinition',
                        'FunctionDeclaration',
                        'TSInterfaceDeclaration',
                        'TSTypeAliasDeclaration',
                    ],
                },
            ],
        },
    },
    {
        files: ['scripts/**/*.ts', 'tests/**/*.ts', 'rspack.config.ts', 'vitest.config.ts'],
        rules: {
            'no-console': 'off',
        },
    },
    {
        files: ['tests/**/*.ts'],
        rules: {
            // Vitest per-file environment pragma, e.g. happy-dom for DOM tests.
            'jsdoc/check-tag-names': ['error', { definedTags: ['vitest-environment'] }],
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-file-overview': 'off',
            'jsdoc/require-description': 'off',
        },
    },
]);
