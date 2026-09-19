import { useEffect } from 'react';

export type ViewName = 'home' | 'listing' | 'cart' | 'checkout' | 'wishlist' | 'product' | 'profile';

/**
 * The ported legacy CSS hides every `#view-*` container by default and only
 * reveals the one matching `body.view-<name>` (see legacy-desktop.css around
 * "#view-home,#view-listing,...{display:none;}"). The original vanilla-JS
 * app toggled this class on navigation; since routing now mounts only one
 * view at a time, each top-level page sets its own class here instead.
 */
export function useBodyViewClass(view: ViewName) {
  useEffect(() => {
    document.body.classList.add(`view-${view}`);
    return () => {
      document.body.classList.remove(`view-${view}`);
    };
  }, [view]);
}
