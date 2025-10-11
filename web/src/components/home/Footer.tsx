'use client'

import { FaGithub } from 'react-icons/fa'
import ThemeToggle from '@/components/theme-toggle'
import { useTranslations } from 'next-intl'

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="max-w-6xl mx-auto mt-8 flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border-color)] shadow-custom">
                <p className="text-[var(--muted)] text-sm font-serif">
                    {t('footer.copyright')}
                </p>

                <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-5">
                        <a
                            href="https://github.com/hyy215/deepwiki-open"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                            <FaGithub className="text-xl" />
                        </a>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    )
}