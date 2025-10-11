'use client'

import { FaWikipediaW } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import Mermaid from '@/components/Mermaid'
import { useState } from 'react';

export default function Overview() {
    const t = useTranslations();

    // Define the demo mermaid charts outside the component
    const [DEMO_FLOW_CHART] = useState(`graph TD
      A[Code Repository] --> B[DeepWiki]
      B --> C[Architecture Diagrams]
      B --> D[Component Relationships]
      B --> E[Data Flow]
      B --> F[Process Workflows]
    
      style A fill:#f9d3a9,stroke:#d86c1f
      style B fill:#d4a9f9,stroke:#6c1fd8
      style C fill:#a9f9d3,stroke:#1fd86c
      style D fill:#a9d3f9,stroke:#1f6cd8
      style E fill:#f9a9d3,stroke:#d81f6c
      style F fill:#d3f9a9,stroke:#6cd81f`
    )
    const [DEMO_SEQUENCE_CHART] = useState(`sequenceDiagram
      participant User
      participant DeepWiki
      participant GitHub
    
      User->>DeepWiki: Enter repository URL
      DeepWiki->>GitHub: Request repository data
      GitHub-->>DeepWiki: Return repository data
      DeepWiki->>DeepWiki: Process and analyze code
      DeepWiki-->>User: Display wiki with diagrams
    
      %% Add a note to make text more visible
      Note over User,GitHub: DeepWiki supports sequence diagrams for visualizing interactions`
    )

    return (
        <>
            {/* Header section */}
            <div className="flex flex-col items-center w-full max-w-2xl mb-8">
                <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-[var(--accent-primary)]/20 rounded-full blur-md"></div>
                        <FaWikipediaW className="text-5xl text-[var(--accent-primary)] relative z-10" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-[var(--foreground)] font-serif mb-1">
                            {t('home.welcome')}
                        </h2>
                        <p className="text-[var(--accent-primary)] text-sm max-w-md">
                            {t('home.welcomeTagline')}
                        </p>
                    </div>
                </div>

                <p className="text-[var(--foreground)] text-center mb-8 text-lg leading-relaxed">
                    {t('home.description')}
                </p>
            </div>

            {/* Quick Start section - redesigned for better spacing */}
            <div className="w-full max-w-2xl mb-10 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-3 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {t('home.quickStart')}
                </h3>
                <p className="text-sm text-[var(--foreground)] mb-3">
                    {t('home.enterRepoUrl')}
                </p>
                <div className="grid grid-cols-1 gap-3 text-xs text-[var(--muted)]">
                    <div className="bg-[var(--background)]/70 p-3 rounded border border-[var(--border-color)] font-mono overflow-x-hidden whitespace-nowrap">
                        https://github.com/hyy215/deepwiki-open
                    </div>
                    <div className="bg-[var(--background)]/70 p-3 rounded border border-[var(--border-color)] font-mono overflow-x-hidden whitespace-nowrap">
                        https://gitlab.com/gitlab-org/gitlab
                    </div>
                    <div className="bg-[var(--background)]/70 p-3 rounded border border-[var(--border-color)] font-mono overflow-x-hidden whitespace-nowrap">
                        AsyncFuncAI/deepwiki-open
                    </div>
                    <div className="bg-[var(--background)]/70 p-3 rounded border border-[var(--border-color)] font-mono overflow-x-hidden whitespace-nowrap">
                        https://bitbucket.org/atlassian/atlaskit
                    </div>
                </div>
            </div>

            {/* Visualization section - improved for better visibility */}
            <div className="w-full max-w-2xl mb-8 bg-[var(--background)]/70 rounded-lg p-6 border border-[var(--border-color)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5 sm:mt-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                    <h3 className="text-base font-semibold text-[var(--foreground)] font-serif">
                        {t('home.advancedVisualization')}
                    </h3>
                </div>
                <p className="text-sm text-[var(--foreground)] mb-5 leading-relaxed">
                    {t('home.diagramDescription')}
                </p>

                {/* Diagrams with improved layout */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-color)] shadow-custom">
                        <h4 className="text-sm font-medium text-[var(--foreground)] mb-3 font-serif">
                            {t('home.flowDiagram')}
                        </h4>
                        <Mermaid chart={DEMO_FLOW_CHART} />
                    </div>

                    <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-color)] shadow-custom">
                        <h4 className="text-sm font-medium text-[var(--foreground)] mb-3 font-serif">
                            {t('home.sequenceDiagram')}
                        </h4>
                        <Mermaid chart={DEMO_SEQUENCE_CHART} />
                    </div>
                </div>
            </div>
        </>
    )
}