const clientId ='7e1c32ca0d594987a23add083fa4af6b';
const redirectUri = 'http://CarloJam.surge.sh/';

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
    return new Promise(resolve => resolve(accessToken));
  } else {
      const accessTokenMatching = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatching = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatching && expiresInMatching) {
        accessToken = accessTokenMatching[1];
        const expiresIn = expiresInMatching[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      }
      return new Promise(resolve => resolve(accessToken));
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {headers: {
      Authorization: `Bearer ${accessToken}`
    }}).then(response => response.json()).then(
      jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        } else {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
    });
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => response.json()
    ).then(jsonResponse => {userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({playlistName: playlistName})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });

  }
};

export default Spotify;
