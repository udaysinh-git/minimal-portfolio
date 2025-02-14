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

async function updateLastPlayed(lastPlayedData) {
    try {
        const fetch = await getFetch();
        // Update the last played sheet by sending a POST request to the lastPlayed function.
        await fetch(`/.netlify/functions/lastPlayed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lastPlayedData),
        });
    } catch (error) {
        console.error("Error updating last played sheet", error);
    }
}

async function fetchFallback() {
    const fetch = await getFetch();
    const fallbackResponse = await fetch(`/.netlify/functions/lastPlayed`);
    if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const row = fallbackData.row;
        if (row) {
            return {
                item: {
                    id: row[0],
                    name: row[1],
                    external_urls: { spotify: row[2] },
                    artists: row[3].split(",").map(name => ({ name: name.trim() })),
                    album: {
                        name: row[4],
                        images: []
                    },
                },
                progress_ms: Number(row[5]),
                is_playing: row[6] === "true" || row[6] === true
            };
        }
    }
    // If fallback fails, return a default response.
    return { item: null, progress_ms: 0, is_playing: false };
}

exports.handler = async (event, context) => {
    let token = process.env.SPOTIFY_TOKEN;
    if (!token) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "SPOTIFY_TOKEN environment variable is not set" }),
        };
    }

    try {
        // Try fetching currently playing track using current token.
        let response = await fetchSpotifyData(token);

        // Token expired? Refresh it.
        if (response.status === 401) {
            try {
                token = await refreshAccessToken();
                process.env.SPOTIFY_TOKEN = token;
                response = await fetchSpotifyData(token);
            } catch (refreshError) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error refreshing token", error: refreshError.toString() }),
                };
            }
        }

        // If no track is playing (204) or item is missing, fallback to last played.
        if (response.status === 204) {
            const fallbackData = await fetchFallback();
            return {
                statusCode: 200,
                body: JSON.stringify(fallbackData),
            };
        }

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: "Error fetching data from Spotify" }),
            };
        }

        const data = await response.json();

        // If now playing is available update last played asynchronously.
        if (data.item) {
            const lastPlayedData = {
                id: data.item.id,
                name: data.item.name,
                url: (data.item.external_urls && data.item.external_urls.spotify) || "",
                artists: data.item.artists ? data.item.artists.map(artist => artist.name).join(", ") : "",
                album: (data.item.album && data.item.album.name) || "",
                progress_ms: data.progress_ms,
                is_playing: data.is_playing,
            };
            updateLastPlayed(lastPlayedData); // fire and forget
        } else {
            // If item is unavailable, fallback to last played.
            const fallbackData = await fetchFallback();
            return {
                statusCode: 200,
                body: JSON.stringify(fallbackData),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching data", error: error.toString() }),
        };
    }
};