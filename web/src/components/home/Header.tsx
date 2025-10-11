'use client'

import { useTranslations } from 'next-intl'
import { FaWikipediaW } from 'react-icons/fa'
import Link from 'next/link'
import HeaderForm from './HeaderForm';
import ConfigurationModal from './ConfigurationModal';
import { useCallback, useState } from 'react';

export default function Header() {
    const t = useTranslations();
    const [isConfigModalOpen, setConfigModalOpen] = useState(false)

    const showConfigModal = useCallback(() => {

    }, []);

    return (
        <header className="max-w-6xl mx-auto mb-6 h-fit w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--card-bg)] rounded-lg shadow-custom border border-[var(--border-color)] p-4">
                <div className="flex items-center">
                    <div className="bg-[var(--accent-primary)] p-2 rounded-lg mr-3">
                        <FaWikipediaW className="text-2xl text-white" />
                    </div>
                    <div className="mr-6">
                        <h1 className="text-xl md:text-2xl font-bold text-[var(--accent-primary)]">
                            {t('common.appName')}
                        </h1>
                        <div className="flex flex-wrap items-baseline gap-x-2 md:gap-x-3 mt-0.5">
                            <p className="text-xs text-[var(--muted)] whitespace-nowrap">
                                {t('common.tagline')}
                            </p>
                            <div className="hidden md:inline-block">
                                <Link
                                    href="/wiki/projects"
                                    className="text-xs font-medium text-[var(--accent-primary)] hover:text-[var(--highlight)] hover:underline whitespace-nowrap"
                                >
                                    {t('nav.wikiProjects')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <HeaderForm />
                <ConfigurationModal />
            </div>
        </header>
    )
}