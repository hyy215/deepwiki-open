'use client'

import { useCallback, useState } from "react"
import { useTranslations } from 'next-intl'
import { extractUrlPath, extractUrlDomain } from '@/utils/urlDecoder'

interface ParseRepositoryType {
    owner: string
    repo: string
    type: string
    fullPath?: string
    localPath?: string
}

interface HeaderFormProps {
    isSubmitting: boolean;
    showConfigModal: (props: ParseRepositoryType) => void;
}

export default function HeaderForm(props: HeaderFormProps) {
    const t = useTranslations();
    const { isSubmitting, showConfigModal } = props;

    const [repository, updateRepository] = useState('https://github.com/hyy215/deepwiki-open.git')
    const [repositoryInputError, updateRepositoryInputError] = useState<string | undefined>();

    const onRepositoryInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateRepository(e.target.value)
    }, []);

    const parseRepository = useCallback((input: string): ParseRepositoryType | null => {
        input = input.trim()

        let owner = '',
            repo = '',
            type = 'github',
            fullPath
        let localPath: string | undefined

        // Handle Windows absolute paths (e.g., C:\path\to\folder)
        const windowsPathRegex = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/
        const customGitRegex = /^(?:https?:\/\/)?([^\/]+)\/(.+?)\/([^\/]+)(?:\.git)?\/?$/

        if (windowsPathRegex.test(input)) {
            type = 'local'
            localPath = input
            repo = input.split('\\').pop() || 'local-repo'
            owner = 'local'
        } else if (input.startsWith('/')) {
            // Handle Unix/Linux absolute paths (e.g., /path/to/folder)
            type = 'local'
            localPath = input
            repo = input.split('/').filter(Boolean).pop() || 'local-repo'
            owner = 'local'
        } else if (customGitRegex.test(input)) {
            // Detect repository type based on domain
            const domain = extractUrlDomain(input)
            if (domain?.includes('github.com')) {
                type = 'github'
            } else if (domain?.includes('gitlab.com') || domain?.includes('gitlab.')) {
                type = 'gitlab'
            } else if (domain?.includes('bitbucket.org') || domain?.includes('bitbucket.')) {
                type = 'bitbucket'
            } else {
                type = 'web' // fallback for other git hosting services
            }

            fullPath = extractUrlPath(input)?.replace(/\.git$/, '')
            const parts = fullPath?.split('/') ?? []
            if (parts.length >= 2) {
                repo = parts[parts.length - 1] || ''
                owner = parts[parts.length - 2] || ''
            }
        } else {
            // Unsupported URL formats
            console.error('Unsupported URL format:', input)
            return null
        }

        if (!owner || !repo) {
            return null
        }

        // Clean values
        owner = owner.trim()
        repo = repo.trim()

        // Remove .git suffix if present
        if (repo.endsWith('.git')) {
            repo = repo.slice(0, -4)
        }

        return { owner, repo, type, fullPath, localPath }
    }, []);

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const parsedRepo = parseRepository(repository)
        if (!parsedRepo) {
            updateRepositoryInputError(
                'Invalid repository format. Use "owner/repo", GitHub/GitLab/BitBucket URL, or a local folder path like "/path/to/folder" or "C:\\path\\to\\folder".'
            )
            return
        }

        updateRepositoryInputError(undefined);
        showConfigModal(parsedRepo);
    }, []);

    return (
        <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-3 w-full max-w-3xl"
        >
            {/* Repository URL input and submit button */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <input
                        className="input-japanese block w-full pl-10 pr-3 py-2.5 border-[var(--border-color)] rounded-lg bg-transparent text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)]"
                        type="text"
                        value={repository}
                        onChange={onRepositoryInputChange}
                        placeholder={
                            t('form.repoPlaceholder') ||
                            'owner/repo, GitHub/GitLab/BitBucket URL, or local folder path'
                        }
                    />
                    {repositoryInputError && (
                        <div className="text-[var(--highlight)] text-xs mt-1">
                            {repositoryInputError}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn-japanese px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('common.processing') : t('common.generateWiki')}
                </button>
            </div>
        </form>
    )
}