import { useEffect, useRef } from 'react';
import { getVideoControllerScript } from '@/utils/videoControllerScript';

export const useScriptInjection = (iframeRef: React.RefObject<HTMLIFrameElement>, scriptInjectedRef: { current: boolean }) => {
  const injectionAttemptCountRef = useRef(0);

  const injectScript = () => {
    if (iframeRef.current && !scriptInjectedRef.current) {
      try {
        console.log('Attempting to inject control script...');
        const iframe = iframeRef.current;
        
        const scriptContent = getVideoControllerScript();
        
        // Method 1: Try direct script injection
        try {
          if (iframe.contentWindow && iframe.contentDocument) {
            const script = iframe.contentDocument.createElement('script');
            script.textContent = scriptContent;
            iframe.contentDocument.head.appendChild(script);
            scriptInjectedRef.current = true;
            console.log('Direct script injection successful');
          }
        } catch (e) {
          console.log('Direct injection failed:', e);
        }
        
        // Method 2: Try postMessage if direct injection fails
        if (!scriptInjectedRef.current) {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ 
              action: 'injectScript', 
              script: scriptContent 
            }),
            '*'
          );
          injectionAttemptCountRef.current++;
          console.log('Attempted postMessage script injection');
        }
      } catch (error) {
        console.error('Failed to inject controller script:', error);
      }
    }
  };

  useEffect(() => {
    const onLoad = () => {
      console.log('Iframe loaded, injecting script...');
      setTimeout(injectScript, 1000);
    };
    
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', onLoad);
      setTimeout(injectScript, 1000);
      
      const interval = setInterval(() => {
        if (!scriptInjectedRef.current && injectionAttemptCountRef.current < 10) {
          injectScript();
        } else {
          clearInterval(interval);
        }
      }, 2000);
      
      return () => {
        iframeRef.current?.removeEventListener('load', onLoad);
        clearInterval(interval);
      };
    }
  }, [iframeRef, scriptInjectedRef]);

  return { injectionAttemptCountRef };
};
