import observe from '../../scripts/utils/observer.js';

function decorate(el) {
  el.innerHTML = `<iframe src="${el.dataset.src}" class="spotify"
  frameborder="0" allowtransparency="true" allow="encrypted-media"
  title="Spotify Embed"></iframe>`;
}

export default function init(a) {
  if (!a || !a.href || !a.href.includes('open.spotify.com')) {
    console.error('Invalid Spotify URL:', a?.href);
    return;
  }

  try {
    console.log('Spotify block initializing with URL:', a.href);
    
    const div = document.createElement('div');
    div.className = 'spotify-embed';
    
    // Handle different Spotify URL formats
    const url = new URL(a.href);
    
    // Get clean path parts (no empty strings, no query params)
    const pathParts = url.pathname.split('/')
      .filter(Boolean)
      .map(part => part.split('?')[0]);
    
    console.log('Clean path parts:', pathParts);
    
    if (pathParts.length < 2) {
      throw new Error('Invalid Spotify URL structure');
    }
    
    // type will be 'track', 'album', 'playlist', 'episode', etc.
    const type = pathParts[0];
    const id = pathParts[1];
    
    console.log('Content type:', type, 'ID:', id);
    
    if (!type || !id) {
      throw new Error('Missing type or ID in Spotify URL');
    }
    
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
    console.log('Generated embed URL:', embedUrl);
    
    div.dataset.src = embedUrl;
    
    if (a.parentElement) {
      a.parentElement.replaceChild(div, a);
      observe(div, decorate);
    } else {
      console.error('No parent element found for Spotify link');
    }
  } catch (error) {
    console.error('Error in Spotify block:', error);
    // Keep the original link if there's an error
    return;
  }
  
  div.dataset.src = `https://open.spotify.com/embed/${type}/${id}`;
  a.parentElement.replaceChild(div, a);
  observe(div, decorate);
}