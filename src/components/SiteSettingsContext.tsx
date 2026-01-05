
"use client";

import React, { createContext, useContext, ReactNode } from 'react';

type SiteSettings = {
    siteName: string;
    tagline?: string;
    logoUrl?: string;
    faviconUrl?: string;
    supportEmail?: string;
}

const SiteSettingsContext = createContext<SiteSettings>({
    siteName: 'libribooks.com',
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children, settings }: { children: ReactNode, settings: SiteSettings }) => {
    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
