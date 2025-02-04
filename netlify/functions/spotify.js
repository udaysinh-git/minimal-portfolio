async function getFetch() {
  const { default: fetch } = await import("node-fetch");
  return fetch;
}

async function refreshAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials are not set");
  }

  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const fetch = await getFetch();
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error(`Error refreshing token: ${response.statusText}`);
  }
  const data = await response.json();
  return data.access_token;
}

exports.handler = async (event, context) => {
  let token = process.env.SPOTIFY_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "SPOTIFY_TOKEN environment variable is not set" })
    };
  }

  const spotifyEndpoint = "https://api.spotify.com/v1/me/player/currently-playing";

  async function fetchSpotifyData(accessToken) {
    const fetch = await getFetch();
    return await fetch(spotifyEndpoint, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }

  try {
    // Make initial call with current token.
    let response = await fetchSpotifyData(token);

    // If token is expired, refresh it and try again.
    if (response.status === 401) {
      try {
        token = await refreshAccessToken();
        process.env.SPOTIFY_TOKEN = token;
        response = await fetchSpotifyData(token);
      } catch (refreshError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error refreshing token", error: refreshError.toString() })
        };
      }
    }

    // If there is no content (e.g. no track playing), use fallback from environment variables.
    if (response.status === 204) {
      if (process.env.SONG_TITLE) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            item: {
              name: process.env.SONG_TITLE,
              external_urls: { spotify: process.env.SONG_URL },
              artists: process.env.SONG_ARTISTS.split(",").map(name => ({ name: name.trim() })),
              album: {
                images: [{ url: process.env.SONG_ART }]
              }
            },
            progress_ms: 0,
            is_playing: false
          })
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ item: null, progress_ms: 0, is_playing: false })
        };
      }
    }
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: "Error fetching data from Spotify" })
      };
    }

    const data = await response.json();

    // Temporary solution: update environment variables for shared state across users.
    if (data.item) {
      process.env.SONG_TITLE = data.item.name || "";
      process.env.SONG_URL = (data.item.external_urls && data.item.external_urls.spotify) || "";
      process.env.SONG_ARTISTS = data.item.artists
        ? data.item.artists.map(artist => artist.name).join(", ")
        : "";
      process.env.SONG_ART = (data.item.album &&
                              data.item.album.images &&
                              data.item.album.images[0] &&
                              data.item.album.images[0].url) || "";
    } else {
      process.env.SONG_TITLE = "";
      process.env.SONG_URL = "";
      process.env.SONG_ARTISTS = "";
      process.env.SONG_ART = "";
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching data", error: error.toString() })
    };
  }
};