'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Import React explicitly
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { type PopupAd } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getActivePopup } from '@/app/admin/dashboard/popups/actions'; // Import the server action

const sanitizeHtml = (html: string) => {
    if (typeof html !== 'string') return '';
    // Basic sanitization: remove script tags
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export function PopupContainer() {
  const [popup, setPopup] = useState<PopupAd | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const popupRef = React.useRef<HTMLDivElement>(null); // Ref for the popup content

  const handleClose = useCallback(() => { // Moved and wrapped in useCallback
    setIsVisible(false);
    setIsDismissed(true);
  }, []);

  const fetchPopup = useCallback(async () => {
    const activePopup = await getActivePopup();
    if (activePopup) {
      setPopup(activePopup);
      setIsVisible(false); // Start hidden
      setIsDismissed(false); // Not dismissed initially
    } else {
      setPopup(null);
      setIsVisible(false);
      setIsDismissed(true); // No popup, so consider it dismissed
    }
  }, []);

  useEffect(() => {
    fetchPopup();
  }, [fetchPopup]);

  useEffect(() => {
    if (popup && !isDismissed) {
      const delay = popup.display_delay ? popup.display_delay * 1000 : 0;
      const duration = popup.display_duration ? popup.display_duration * 1000 : 0;

      let showTimer: NodeJS.Timeout;
      let hideTimer: NodeJS.Timeout;

      // Show popup after delay
      showTimer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      // Hide popup after duration (if duration is set)
      if (duration > 0) {
        hideTimer = setTimeout(() => {
          setIsVisible(false);
          setIsDismissed(true); // Automatically dismiss after duration
        }, delay + duration);
      }

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [popup, isDismissed]);

  // Effect for click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isVisible && !isDismissed) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, isDismissed, handleClose]);

  if (!popup || isDismissed || !isVisible) {
    return null;
  }

  const sanitizedContent = sanitizeHtml(popup.content || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card ref={popupRef} className="relative w-full max-w-md"> {/* Attach ref here */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-6">
          <h3 className="mb-4 text-xl font-semibold">{popup.name}</h3>
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </CardContent>
      </Card>
    </div>
  );
}
