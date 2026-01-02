'use client';

import { usePathname } from 'next/navigation';
import { PopupContainer } from './PopupContainer';
import React from 'react';

export function PopupConditionalRenderer() {
  const pathname = usePathname();

  // Define paths where the popup should NOT appear
  const excludedPaths = ['/admin'];

  // Define paths where the popup SHOULD appear (homepage and individual article pages)
  const shouldShowPopup = React.useMemo(() => {
    const isHomepage = pathname === '/';
    const isIndividualArticlePage = pathname.startsWith('/articles/') && pathname.length > '/articles/'.length;
    const isAdminPage = excludedPaths.some(path => pathname.startsWith(path));

    // Popup should show if it's the homepage OR an individual article page,
    // AND it's NOT an admin page.
    return (isHomepage || isIndividualArticlePage) && !isAdminPage;
  }, [pathname, excludedPaths]);

  if (!shouldShowPopup) {
    return null;
  }

  return <PopupContainer />;
}
