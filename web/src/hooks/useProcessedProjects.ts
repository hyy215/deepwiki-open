'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProcessedProject {
    id: string
    owner: string
    repo: string
    name: string
    repo_type: string
    submittedAt: number
    language: string
}

export function useProcessedProjects() {
    const [projects, setProjects] = useState<ProcessedProject[] | undefined>()

    const fetchProjects = useCallback(async () => {
        const response = await fetch('/api/wiki/projects')
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.error) {
            throw new Error(data.error)
        }

        return data;
    }, []);

    const initialize = useCallback(async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (e: unknown) {
            console.error('Failed to load projects from API:', e)
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [])

    return projects;
}
