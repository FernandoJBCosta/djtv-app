import { useEffect, useCallback, useRef } from 'react';

interface UseTVNavigationOptions {
  containerRef?: React.RefObject<HTMLElement>;
  onSelect?: () => void;
  enabled?: boolean;
}

export function useTVNavigation(options: UseTVNavigationOptions = {}) {
  const { containerRef, onSelect, enabled = true } = options;
  const focusableElements = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback(() => {
    const container = containerRef?.current || document;
    const elements = container.querySelectorAll<HTMLElement>(
      '[data-tv-focusable], .tv-focusable, button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(elements).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && !el.hasAttribute('disabled');
    });
  }, [containerRef]);

  const getCurrentFocusIndex = useCallback(() => {
    const elements = getFocusableElements();
    focusableElements.current = elements;
    const activeElement = document.activeElement as HTMLElement;
    return elements.indexOf(activeElement);
  }, [getFocusableElements]);

  const focusElement = useCallback((index: number) => {
    const elements = focusableElements.current;
    if (elements.length === 0) return;
    
    const clampedIndex = Math.max(0, Math.min(index, elements.length - 1));
    elements[clampedIndex]?.focus();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const currentIndex = getCurrentFocusIndex();
    const elements = focusableElements.current;
    
    // Handle TV remote keys and keyboard arrows
    switch (event.key) {
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        if (currentIndex > 0) {
          focusElement(currentIndex - 1);
        }
        break;
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        if (currentIndex < elements.length - 1) {
          focusElement(currentIndex + 1);
        }
        break;
      case 'ArrowLeft':
      case 'Left':
        event.preventDefault();
        if (currentIndex > 0) {
          focusElement(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
      case 'Right':
        event.preventDefault();
        if (currentIndex < elements.length - 1) {
          focusElement(currentIndex + 1);
        }
        break;
      case 'Enter':
      case 'Select':
      case ' ':
        if (event.key === ' ' && document.activeElement?.tagName === 'INPUT') {
          return; // Allow space in inputs
        }
        onSelect?.();
        break;
      case 'Backspace':
      case 'Back':
      case 'Escape':
        // Handle back navigation on TV
        window.history.back();
        break;
    }
  }, [enabled, getCurrentFocusIndex, focusElement, onSelect]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus first element on mount for TV
    const elements = getFocusableElements();
    if (elements.length > 0 && !document.activeElement?.matches('[data-tv-focusable], .tv-focusable')) {
      elements[0]?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown, getFocusableElements]);

  return {
    focusElement,
    getCurrentFocusIndex,
    getFocusableElements,
  };
}

// Utility to detect TV platform
export function isTVPlatform(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const tvKeywords = [
    'smart-tv',
    'smarttv', 
    'googletv',
    'appletv',
    'hbbtv',
    'pov_tv',
    'netcast',
    'viera',
    'nettv',
    'philipstv',
    'samsungbrowser',
    'tizen',
    'webos',
    'androidtv',
    'android tv',
    'firetv',
    'fire tv',
    'roku',
    'crkey', // Chromecast
  ];

  return tvKeywords.some(keyword => userAgent.includes(keyword)) ||
    window.innerWidth >= 1920 && window.innerHeight >= 1080 && !('ontouchstart' in window);
}
