'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaWikipediaW } from 'react-icons/fa'
import ConfigurationModal from '@/components/ConfigurationModal'
import ProcessedProjects from '@/components/ProcessedProjects'
import { extractUrlPath, extractUrlDomain } from '@/utils/urlDecoder'
import { useProcessedProjects } from '@/hooks/useProcessedProjects'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
    const router = useRouter()
    const { language, setLanguage, messages, supportedLanguages } = useLanguage()
    const { projects, isLoading: projectsLoading } = useProcessedProjects()

    // Create a simple translation function
    const t = (key: string, params: Record<string, string | number> = {}): string => {
        // Split the key by dots to access nested properties
        const keys = key.split('.')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any = messages

        // Navigate through the nested properties
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k]
            } else {
                // Return the key if the translation is not found
                return key
            }
        }

        // If the value is a string, replace parameters
        if (typeof value === 'string') {
            return Object.entries(params).reduce((acc: string, [paramKey, paramValue]) => {
                return acc.replace(`{${paramKey}}`, String(paramValue))
            }, value)
        }

        // Return the key if the value is not a string
        return key
    }

    const [repositoryInput, setRepositoryInput] = useState(
        'https://github.com/hyy215/deepwiki-open.git'
    )

    const REPO_CONFIG_CACHE_KEY = 'deepwikiRepoConfigCache'

    const loadConfigFromCache = (repoUrl: string) => {
        if (!repoUrl) return
        try {
            const cachedConfigs = localStorage.getItem(REPO_CONFIG_CACHE_KEY)
            if (cachedConfigs) {
                const configs = JSON.parse(cachedConfigs)
                const config = configs[repoUrl.trim()]
                if (config) {
                    setSelectedLanguage(config.selectedLanguage || language)
                    setIsComprehensiveView(
                        config.isComprehensiveView === undefined ? true : config.isComprehensiveView
                    )
                    setProvider(config.provider || '')
                    setModel(config.model || '')
                    setIsCustomModel(config.isCustomModel || false)
                    setCustomModel(config.customModel || '')
                    setSelectedPlatform(config.selectedPlatform || 'github')
                    setExcludedDirs(config.excludedDirs || '')
                    setExcludedFiles(config.excludedFiles || '')
                    setIncludedDirs(config.includedDirs || '')
                    setIncludedFiles(config.includedFiles || '')
                }
            }
        } catch (error) {
            console.error('Error loading config from localStorage:', error)
        }
    }

    const handleRepositoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRepoUrl = e.target.value
        setRepositoryInput(newRepoUrl)
        if (newRepoUrl.trim() === '') {
            // Optionally reset fields if input is cleared
        } else {
            loadConfigFromCache(newRepoUrl)
        }
    }

    useEffect(() => {
        if (repositoryInput) {
            loadConfigFromCache(repositoryInput)
        }
    }, [])

    // Provider-based model selection state
    const [provider, setProvider] = useState<string>('')
    const [model, setModel] = useState<string>('')
    const [isCustomModel, setIsCustomModel] = useState<boolean>(false)
    const [customModel, setCustomModel] = useState<string>('')

    // Wiki type state - default to comprehensive view
    const [isComprehensiveView, setIsComprehensiveView] = useState<boolean>(true)

    const [excludedDirs, setExcludedDirs] = useState('')
    const [excludedFiles, setExcludedFiles] = useState('')
    const [includedDirs, setIncludedDirs] = useState('')
    const [includedFiles, setIncludedFiles] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState<'github' | 'gitlab' | 'bitbucket'>(
        'github'
    )
    const [accessToken, setAccessToken] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<string>(language)

    // Authentication state
    const [authRequired, setAuthRequired] = useState<boolean>(false)
    const [authCode, setAuthCode] = useState<string>('')
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)

    // Sync the language context with the selectedLanguage state
    useEffect(() => {
        setLanguage(selectedLanguage)
    }, [selectedLanguage, setLanguage])

    // Fetch authentication status on component mount
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                setIsAuthLoading(true)
                const response = await fetch('/api/auth/status')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setAuthRequired(data.auth_required)
            } catch (err) {
                console.error('Failed to fetch auth status:', err)
                // Assuming auth is required if fetch fails to avoid blocking UI for safety
                setAuthRequired(true)
            } finally {
                setIsAuthLoading(false)
            }
        }

        fetchAuthStatus()
    }, [])

    // Parse repository URL/input and extract owner and repo
    const parseRepositoryInput = (
        input: string
    ): {
        owner: string
        repo: string
        type: string
        fullPath?: string
        localPath?: string
    } | null => {
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
        }
        // Handle Unix/Linux absolute paths (e.g., /path/to/folder)
        else if (input.startsWith('/')) {
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
        }
        // Unsupported URL formats
        else {
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
    }

    // State for configuration modal
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)


    const validateAuthCode = async () => {
        try {
            if (authRequired) {
                if (!authCode) {
                    return false
                }
                const response = await fetch('/api/auth/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: authCode }),
                })
                if (!response.ok) {
                    return false
                }
                const data = await response.json()
                return data.success || false
            }
        } catch {
            return false
        }
        return true
    }

    const handleGenerateWiki = async () => {
        // Check authorization code
        const validation = await validateAuthCode()
        if (!validation) {
            setError(`Failed to validate the authorization code`)
            console.error(`Failed to validate the authorization code`)
            setIsConfigModalOpen(false)
            return
        }

        // Prevent multiple submissions
        if (isSubmitting) {
            console.log('Form submission already in progress, ignoring duplicate click')
            return
        }

        try {
            const currentRepoUrl = repositoryInput.trim()
            if (currentRepoUrl) {
                const existingConfigs = JSON.parse(
                    localStorage.getItem(REPO_CONFIG_CACHE_KEY) || '{}'
                )
                const configToSave = {
                    selectedLanguage,
                    isComprehensiveView,
                    provider,
                    model,
                    isCustomModel,
                    customModel,
                    selectedPlatform,
                    excludedDirs,
                    excludedFiles,
                    includedDirs,
                    includedFiles,
                }
                existingConfigs[currentRepoUrl] = configToSave
                localStorage.setItem(REPO_CONFIG_CACHE_KEY, JSON.stringify(existingConfigs))
            }
        } catch (error) {
            console.error('Error saving config to localStorage:', error)
        }

        setIsSubmitting(true)

        // Parse repository input
        const parsedRepo = parseRepositoryInput(repositoryInput)

        if (!parsedRepo) {
            setError(
                'Invalid repository format. Use "owner/repo", GitHub/GitLab/BitBucket URL, or a local folder path like "/path/to/folder" or "C:\\path\\to\\folder".'
            )
            setIsSubmitting(false)
            return
        }

        const { owner, repo, type, localPath } = parsedRepo

        // Store tokens in query params if they exist
        const params = new URLSearchParams()
        if (accessToken) {
            params.append('token', accessToken)
        }
        // Always include the type parameter
        params.append('type', (type == 'local' ? type : selectedPlatform) || 'github')
        // Add local path if it exists
        if (localPath) {
            params.append('local_path', encodeURIComponent(localPath))
        } else {
            params.append('repo_url', encodeURIComponent(repositoryInput))
        }
        // Add model parameters
        params.append('provider', provider)
        params.append('model', model)
        if (isCustomModel && customModel) {
            params.append('custom_model', customModel)
        }
        // Add file filters configuration
        if (excludedDirs) {
            params.append('excluded_dirs', excludedDirs)
        }
        if (excludedFiles) {
            params.append('excluded_files', excludedFiles)
        }
        if (includedDirs) {
            params.append('included_dirs', includedDirs)
        }
        if (includedFiles) {
            params.append('included_files', includedFiles)
        }

        // Add language parameter
        params.append('language', selectedLanguage)

        // Add comprehensive parameter
        params.append('comprehensive', isComprehensiveView.toString())

        const queryString = params.toString() ? `?${params.toString()}` : ''

        // Navigate to the dynamic route
        router.push(`/${owner}/${repo}${queryString}`)

        // The isSubmitting state will be reset when the component unmounts during navigation
    }

    return (
        <div className="h-screen paper-texture p-4 md:p-8 flex flex-col">
            <header className="max-w-6xl mx-auto mb-6 h-fit w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--card-bg)] rounded-lg shadow-custom border border-[var(--border-color)] p-4">
                    {/* Configuration Modal */}
                    <ConfigurationModal
                        isOpen={isConfigModalOpen}
                        onClose={() => setIsConfigModalOpen(false)}
                        repositoryInput={repositoryInput}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        supportedLanguages={supportedLanguages}
                        isComprehensiveView={isComprehensiveView}
                        setIsComprehensiveView={setIsComprehensiveView}
                        provider={provider}
                        setProvider={setProvider}
                        model={model}
                        setModel={setModel}
                        isCustomModel={isCustomModel}
                        setIsCustomModel={setIsCustomModel}
                        customModel={customModel}
                        setCustomModel={setCustomModel}
                        selectedPlatform={selectedPlatform}
                        setSelectedPlatform={setSelectedPlatform}
                        accessToken={accessToken}
                        setAccessToken={setAccessToken}
                        excludedDirs={excludedDirs}
                        setExcludedDirs={setExcludedDirs}
                        excludedFiles={excludedFiles}
                        setExcludedFiles={setExcludedFiles}
                        includedDirs={includedDirs}
                        setIncludedDirs={setIncludedDirs}
                        includedFiles={includedFiles}
                        setIncludedFiles={setIncludedFiles}
                        onSubmit={handleGenerateWiki}
                        isSubmitting={isSubmitting}
                        authRequired={authRequired}
                        authCode={authCode}
                        setAuthCode={setAuthCode}
                        isAuthLoading={isAuthLoading}
                    />
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-8 pt-10 bg-[var(--card-bg)] rounded-lg shadow-custom card-japanese">
                    {/* Conditionally show processed projects or welcome content */}
                    <div className="w-full">
                        {/* Header section for existing projects */}
                        <div className="flex flex-col items-center w-full max-w-2xl mb-8 mx-auto">
                            <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-[var(--accent-primary)]/20 rounded-full blur-md"></div>
                                    <FaWikipediaW className="text-5xl text-[var(--accent-primary)] relative z-10" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-[var(--foreground)] font-serif mb-1">
                                        {t('projects.existingProjects')}
                                    </h2>
                                    <p className="text-[var(--accent-primary)] text-sm max-w-md">
                                        {t('projects.browseExisting')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Show processed projects */}
                        <ProcessedProjects
                            showHeader={false}
                            maxItems={6}
                            messages={messages}
                            className="w-full"
                        />
                    </div>

                </div>
            </main>
        </div>
    )
}
