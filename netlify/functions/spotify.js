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
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error refreshing token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchSpotifyData(accessToken) {
    const spotifyEndpoint = "https://api.spotify.com/v1/me/player/currently-playing";
    const fetch = await getFetch();
    return await fetch(spotifyEndpoint, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
}

async function fetchRecentlyPlayed(accessToken) {
    const recentlyPlayedEndpoint = "https://api.spotify.com/v1/me/player/recently-played?limit=1";
    const fetch = await getFetch();
    return await fetch(recentlyPlayedEndpoint, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
}

exports.handler = async (event, context) => {
    let token = process.env.SPOTIFY_TOKEN;
    if (!token) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "SPOTIFY_TOKEN environment variable is not set" }),
        };
    }

    // Determine base URL for this request.
    const protocol = event.headers["x-forwarded-proto"] || "https";
    const host = event.headers.host;

    // Helper function to update Google Sheets cache with extra fields.
    async function updateCache(track) {
        const fetch = await getFetch();
        const body = {
            id: track.id,
            name: track.name,
            url: (track.external_urls && track.external_urls.spotify) || "",
            artists: track.artists ? track.artists.map(artist => artist.name).join(", ") : "",
            album: (track.album && track.album.name) || "",
            album_image: (track.album && track.album.images && track.album.images[0] && track.album.images[0].url) || "",
            duration_ms: track.duration_ms || 0,
            progress_ms: track.progress_ms || 0,
            is_playing: track.is_playing || false
        };
        try {
            await fetch(`${protocol}://${host}/.netlify/functions/lastPlayed`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.error("Error updating Google Sheets cache:", err);
        }
    }

    // Helper function to get fallback cached track from Google Sheets (with extra fields).
    async function getCachedTrack() {
      try {
          const fetch = await getFetch();
          const lpResponse = await fetch(`${protocol}://${host}/.netlify/functions/lastPlayed`, {
              method: "GET"
          });
          if (lpResponse.ok) {
              const lpData = await lpResponse.json();
              if (lpData.row) {
                  const row = lpData.row;
                  const track = {
                      id: row[0],
                      name: row[1],
                      external_urls: { spotify: row[2] },
                      artists: row[3] ? row[3].split(", ") : [],
                      album: { 
                          name: row[4],
                          images: row[5] ? [{ url: row[5] }] : [] 
                      },
                      duration_ms: Number(row[6]) || 0
                  };
                  return { item: track, progress_ms: Number(row[7]) || 0, is_playing: row[8] === "true" };
              }
          }
      } catch (lpError) {
          console.error("Error retrieving cached track:", lpError.toString());
      }
      return null;
  }

    try {
        // Try fetching currently playing track using the current token.
        let response = await fetchSpotifyData(token);

        // If the token is expired, refresh it.
        if (response.status === 401) {
            try {
                token = await refreshAccessToken();
                process.env.SPOTIFY_TOKEN = token;
                response = await fetchSpotifyData(token);
            } catch (refreshError) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: "Error refreshing token",
                        error: refreshError.toString()
                    }),
                };
            }
        }

        let trackData = null;

        // If no track is playing (HTTP 204), try fetching recently played track.
        if (response.status === 204) {
            const rpResponse = await fetchRecentlyPlayed(token);
            if (rpResponse.ok) {
                const rpData = await rpResponse.json();
                if (rpData.items && rpData.items.length > 0) {
                    trackData = {
                        item: rpData.items[0].track,
                        progress_ms: 0,
                        is_playing: false,
                    };
                }
            }
        } else if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: "Error fetching data from Spotify" }),
            };
        } else {
            // Process the currently playing track response.
            const data = await response.json();
            if (data.item) {
                trackData = data;
            } else {
                // If no track is found in the current data, try fetching recently played.
                const rpResponse = await fetchRecentlyPlayed(token);
                if (rpResponse.ok) {
                    const rpData = await rpResponse.json();
                    if (rpData.items && rpData.items.length > 0) {
                        trackData = {
                            item: rpData.items[0].track,
                            progress_ms: 0,
                            is_playing: false,
                        };
                    }
                }
            }
        }

        // If we got track data, update the cache permanently.
        if (trackData && trackData.item) {
            updateCache(trackData.item); // Asynchronously update Google Sheets cache.
            return {
                statusCode: 200,
                body: JSON.stringify(trackData),
            };
        } else {
            // No track info from Spotify; try to read from the permanent cache.
            const cached = await getCachedTrack();
            if (cached) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(cached),
                };
            }
            // If no cache found, return empty result.
            return {
                statusCode: 200,
                body: JSON.stringify({ item: null, progress_ms: 0, is_playing: false }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching data", error: error.toString() }),
        };
    }
};