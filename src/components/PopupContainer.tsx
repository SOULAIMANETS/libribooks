'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { type PopupAd } from '@/lib/types';
import { cn } from '@/lib/utils';

const sanitizeHtml = (html: string) => {
  if (typeof html !== 'string') return '';
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};


interface PopupContainerProps {
  initialAds: PopupAd[];
}

export function PopupContainer({ initialAds }: PopupContainerProps) {
  const [activeAd, setActiveAd] = useState<PopupAd | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const ad = initialAds.find(p => p.isActive);
    if (!ad) return;

    const hasSeenAd = sessionStorage.getItem(`popup_${ad.id}_seen`);
    if (hasSeenAd) return;

    const showTimeout = setTimeout(() => {
      setActiveAd(ad);
      setIsVisible(true);
      sessionStorage.setItem(`popup_${ad.id}_seen`, 'true');
    }, ad.displayDelay * 1000);

    return () => clearTimeout(showTimeout);
  }, [initialAds]);

  useEffect(() => {
    if (isVisible && activeAd) {
      const hideTimeout = setTimeout(() => {
        handleClose();
      }, activeAd.displayDuration * 1000);
      return () => clearTimeout(hideTimeout);
    }
  }, [isVisible, activeAd]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setActiveAd(null);
    }, 300);
  }

  if (!activeAd || !isVisible) {
    return null;
  }

  const sanitizedContent = sanitizeHtml(activeAd.content);

  return (
    <div className={cn(
      "fixed bottom-5 right-5 z-50 w-full max-w-sm transition-all duration-300 ease-in-out",
      isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
    )}>
      <Card className="shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 z-10"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-0">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </CardContent>
      </Card>
    </div>
  );
}
