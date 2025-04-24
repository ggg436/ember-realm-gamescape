
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
            const controlElements = container.querySelectorAll('.vjs-control-bar, .ytp-chrome-bottom, .controls, [class*="control"]');
            controlElements.forEach(element => {
              if (element instanceof HTMLElement) {
                element.style.display = 'none';
              }
            });
          }
        }
      });
      
      // Also try to hide iframe controls directly
      try {
        const styleTag = document.createElement('style');
        styleTag.textContent = \`
          .vjs-control-bar, .ytp-chrome-bottom, .controls, [class*="control-bar"], 
          [class*="player-controls"], video::-webkit-media-controls {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          video {
            pointer-events: none !important;
          }
        \`;
        document.head.appendChild(styleTag);
      } catch (e) {
        console.error('Failed to inject control hiding styles:', e);
      }
    };
    
    // Track if we've found and are controlling videos
    let videosFound = false;
    let isPlaying = false;
    let currentVolume = 0.5; // Start at 50%
    
    // Apply immediately and periodically to catch dynamically added videos
    const checkForVideos = () => {
      const videos = findAllVideos();
      hideNativeControls();
      
      if (videos.length > 0 && !videosFound) {
        videosFound = true;
        console.log('Videos found and initialized for control');
        
        videos.forEach(video => {
          // Add event listeners
          video.addEventListener('play', () => {
            isPlaying = true;
            window.parent.postMessage(JSON.stringify({ action: 'playing' }), '*');
          });
          
          video.addEventListener('pause', () => {
            isPlaying = false;
            window.parent.postMessage(JSON.stringify({ action: 'paused' }), '*');
          });
          
          video.addEventListener('volumechange', () => {
            currentVolume = video.volume;
            window.parent.postMessage(JSON.stringify({ 
              action: 'volumeChange', 
              value: currentVolume
            }), '*');
          });
          
          // Set initial volume
          video.volume = currentVolume;
          
          // Send initialization complete message
          window.parent.postMessage(JSON.stringify({ 
            action: 'videoInitialized',
            playing: !video.paused
          }), '*');
        });
      }
    };
    
    // Check periodically for videos
    checkForVideos();
    setInterval(checkForVideos, 1000);
    
    // Forcefully apply control to any new videos
    const forceControlAllVideos = (action, value) => {
      const videos = findAllVideos();
      videos.forEach(video => {
        try {
          switch(action) {
            case 'play':
              video.play().catch(e => console.error('Play failed:', e));
              isPlaying = true;
              break;
            case 'pause':
              video.pause();
              isPlaying = false;
              break;
            case 'setVolume':
              video.volume = value;
              currentVolume = value;
              break;
            case 'mute':
              video.volume = 0;
              break;
            case 'unmute':
              video.volume = currentVolume > 0 ? currentVolume : 0.5;
              break;
          }
        } catch (e) {
          console.error('Error controlling video:', e);
        }
      });
    };
    
    // Handle message events from the parent window
    window.addEventListener('message', function(event) {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            // Not JSON, ignore
            return;
          }
        }
        
        if (data && data.action) {
          console.log('Received action:', data.action);
          forceControlAllVideos(data.action, data.value);
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });
    
    // Notify parent that script is loaded
    window.parent.postMessage(JSON.stringify({ action: 'scriptLoaded' }), '*');
    
    // Send status updates to parent every second
    setInterval(() => {
      const videos = findAllVideos();
      if (videos.length > 0) {
        const mainVideo = videos[0];
        window.parent.postMessage(JSON.stringify({
          action: 'statusUpdate',
          playing: !mainVideo.paused,
          volume: mainVideo.volume,
          muted: mainVideo.muted || mainVideo.volume === 0
        }), '*');
      }
    }, 1000);
  })();
`;
