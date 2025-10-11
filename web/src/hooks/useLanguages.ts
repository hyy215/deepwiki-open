import { useCallback, useEffect, useState } from "react";

export function userLanguages() {
    const [locale, updateLocale] = useState<string | undefined>();
    const [messages, updateMessages] = useState<object>({});
    const [supportedLocales] = useState({
        "en": "English",
        "ja": "Japanese (日本語)",
        "zh": "Mandarin Chinese (中文)",
        "zh-tw": "Traditional Chinese (繁體中文)",
        "es": "Spanish (Español)",
        "kr": "Korean (한국어)",
        "vi": "Vietnamese (Tiếng Việt)",
        "pt-br": "Brazilian Portuguese (Português Brasileiro)",
        "fr": "Français (French)",
        "ru": "Русский (Russian)"
    });

    const getStorageLanguage = useCallback(() => {
        if (typeof window !== undefined) {
            return localStorage.getItem('language');
        }
        return;
    }, []);

    const getBrowserLanguage = useCallback(() => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return;
        }

        const browserLang: string = navigator.language || (navigator as any).userLanguage || ''
        if (!browserLang) {
            return
        }

        // Special case for Chinese variants
        if (browserLang === 'zh-TW') {
            return 'zh-tw';
        }

        // Extract the language code (first 2 characters)
        return browserLang.split('-')[0].toLowerCase();
    }, []);

    const getValidLanguage = useCallback((lang: string) => {
        if (Object.keys(supportedLocales).includes(lang)) {
            return lang;
        }

        console.warn(`This language '${lang}' is not supported, switching to 'en'.`);
        return 'en';
    }, []);

    const setLocale = useCallback(async (lang: string) => {
        try {
            lang = getValidLanguage(lang)
            const loadedMessages = (await import(`../messages/${lang}.json`)).default;

            updateLocale(lang)
            updateMessages(loadedMessages);

            // Store in localStorage (only in browser)
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', lang)
            }

            // Update HTML lang attribute (only in browser)
            if (typeof document !== 'undefined') {
                document.documentElement.lang = lang
            }
        } catch (error) {
            console.error('Failed to set language:', error)
        }
    }, []);

    // initialize language
    useEffect(() => {
        const defaultLanguage = getStorageLanguage() || getBrowserLanguage() || 'en';
        setLocale(defaultLanguage);
    }, []);

    return {
        locale,
        setLocale,
        messages,
    }
}