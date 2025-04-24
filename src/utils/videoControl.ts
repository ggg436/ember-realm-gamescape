
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
  window.addEventListener('message', function(event) {
    try {
      let data = event.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      if (data && data.action) {
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
          videos.forEach(function(video) {
            switch(data.action) {
              case 'play':
                video.play();
                break;
              case 'pause':
                video.pause();
                break;
              case 'setVolume':
                video.volume = data.value;
                break;
            }
          });
        }
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  document.querySelectorAll('video').forEach(function(video) {
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
  });
`;
