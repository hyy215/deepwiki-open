/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl';
import { userLanguages } from '@/hooks/useLanguages';

type LanguageContextType = {
    setLocale: (lang: string) => void
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { locale, setLocale, messages } = userLanguages();

    // loading
    if (locale === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <LanguageContext.Provider value={{ setLocale }}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context;
}
