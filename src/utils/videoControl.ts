
export const sendVideoMessage = (
  contentWindow: Window | null,
  action: string,
  value?: number
) => {
  if (contentWindow) {
    contentWindow.postMessage(
      JSON.stringify({ action, ...(value !== undefined ? { value } : {}) }),
      '*'
    );
  }
};

export const getVideoControllerScript = () => `
  (function() {
    // Find all video elements in the document and in iframes
    const findAllVideos = () => {
      const directVideos = Array.from(document.querySelectorAll('video'));
      
      // Try to access videos in iframes
      const iframes = Array.from(document.querySelectorAll('iframe'));
      let iframeVideos = [];
      
      iframes.forEach(iframe => {
        try {
          if (iframe.contentDocument && iframe.contentDocument.querySelectorAll) {
            const videos = Array.from(iframe.contentDocument.querySelectorAll('video'));
            iframeVideos = iframeVideos.concat(videos);
          }
        } catch (e) {
          // Cross-origin iframe access will fail, which is expected
        }
      });
      
      return [...directVideos, ...iframeVideos];
    };
    
    // Hide native video controls
    const hideNativeControls = () => {
      const videos = findAllVideos();
      videos.forEach(video => {
        if (video) {
          video.controls = false;
          video.style.pointerEvents = 'none';
          
          // If the video is in a container, we may need to hide its controls too
          const container = video.parentElement;
          if (container) {
            const controlsElements = container.querySelectorAll('.vjs-control-bar, .ytp-chrome-bottom, .controls, [class*="control"]');
            controlsElements.forEach(element => {
              if (element instanceof HTMLElement) {
                element.style.display = 'none';
              }
            });
          }
        }
      });
    };
    
    // Apply immediately and periodically to catch dynamically added videos
    hideNativeControls();
    setInterval(hideNativeControls, 1000);
    
    // Handle message events from the parent window
    window.addEventListener('message', function(event) {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        
        if (data && data.action) {
          const videos = findAllVideos();
          
          videos.forEach(function(video) {
            switch(data.action) {
              case 'play':
                video.play().catch(e => console.error('Play failed:', e));
                break;
              case 'pause':
                video.pause();
                break;
              case 'setVolume':
                video.volume = data.value;
                break;
              case 'initialize':
                // Add listeners to this video
                video.addEventListener('play', function() {
                  window.parent.postMessage(JSON.stringify({ action: 'playing' }), '*');
                });
                video.addEventListener('pause', function() {
                  window.parent.postMessage(JSON.stringify({ action: 'paused' }), '*');
                });
                video.addEventListener('volumechange', function() {
                  window.parent.postMessage(JSON.stringify({ 
                    action: 'volumeChange', 
                    value: video.volume 
                  }), '*');
                });
                break;
            }
          });
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });
    
    // Notify parent that script is loaded
    window.parent.postMessage(JSON.stringify({ action: 'scriptLoaded' }), '*');
  })();
`;

