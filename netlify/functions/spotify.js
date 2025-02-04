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
        // Optionally update process.env for subsequent calls.
        process.env.SPOTIFY_TOKEN = token;
        response = await fetchSpotifyData(token);
      } catch (refreshError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error refreshing token", error: refreshError.toString() })
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