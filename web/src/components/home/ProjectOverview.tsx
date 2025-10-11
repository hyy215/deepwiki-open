'use client'

import { useTranslations } from 'next-intl'
import { FaWikipediaW } from 'react-icons/fa'

export default function ProjectOverview() {
    const t = useTranslations();

    return (
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
            {/* <ProcessedProjects
                showHeader={false}
                maxItems={6}
                messages={messages}
                className="w-full"
            /> */}
        </div>
    )
}