const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function updateActivityCache(activity, protocol, host) {
  // Send to lastPlayed.js with type=activity and sheet=Sheet2
  try {
    await fetch(`${protocol}://${host}/.netlify/functions/lastPlayed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: activity.name || "",
        details: activity.details || "",
        state: activity.state || "",
        start: activity.start || null, // Ensure 'start' is directly from the activity object passed
        application_id: activity.application_id || null,
        large_text: activity.large_text || "", // New field
        small_text: activity.small_text || "", // New field
        large_text_asset_key: activity.large_text_asset_key || "", // New field
        small_text_asset_key: activity.small_text_asset_key || "", // New field
        sheet: "Sheet2",
        type: "activity"
      })
    });
  } catch (err) {
    console.error("Error updating activity cache:", err);
  }
}

async function getActivityCache(protocol, host) {
  try {
    const res = await fetch(`${protocol}://${host}/.netlify/functions/lastPlayed?type=activity&sheet=Sheet2`, { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (data.row) {
        // Map to activity structure: [name, details, state, start, application_id, large_text, small_text, large_text_asset_key, small_text_asset_key]
        return {
          name: data.row[0] || "",
          details: data.row[1] || "",
          state: data.row[2] || "",
          start: data.row[3] || null,
          application_id: data.row[4] || null,
          large_text: data.row[5] || "", // New field
          small_text: data.row[6] || "",  // New field
          large_text_asset_key: data.row[7] || "", // New field
          small_text_asset_key: data.row[8] || ""  // New field
        };
      }
    }
  } catch (err) {
    console.error("Error fetching activity cache:", err);
  }
  return null;
}

exports.handler = async function(event, context) {
  const ACTIVITIES_USER_ID = process.env.ACTIVITIES_USER_ID;
  if (!ACTIVITIES_USER_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ACTIVITIES_USER_ID not set" }),
    };
  }

  // Determine protocol/host for internal calls
  let protocol = event.headers["x-forwarded-proto"] || "https";
  let host = event.headers.host; // host will be like 'localhost:8888' during local dev

  // --- Fix for local dev: use http for localhost/127.0.0.1 ---
  if (host && (host.startsWith("localhost") || host.startsWith("127.0.0.1"))) {
    protocol = "http";
    // DO NOT Remove port: host = host.replace(/:\d+$/, ""); // This line was causing ECONNREFUSED
  }

  try {
    const url = `https://api.lanyard.rest/v1/users/${ACTIVITIES_USER_ID}`;
    const res = await fetch(url);
    
    let lanyardData;
    if (res.ok) {
        lanyardData = await res.json();
    } else {
        // Lanyard API error, try cache only
        const cached = await getActivityCache(protocol, host);
        if (cached) {
            return {
                statusCode: 200,
                body: JSON.stringify({ activity: cached, from_cache: true })
            };
        }
        return { statusCode: 502, body: JSON.stringify({ error: "Lanyard API error and no cache available" }) };
    }

    const activities = (lanyardData && lanyardData.data && Array.isArray(lanyardData.data.activities)) ? lanyardData.data.activities : [];
    // Exclude Spotify
    const filtered = activities.filter(
      a => a.name !== "Spotify"
    );

    // Only show if there is at least one non-Spotify activity
    if (!filtered.length) {
      // Fallback: fetch from Google Sheets ActivityCache (Sheet2)
      const cached = await getActivityCache(protocol, host);
      if (cached) {
        return {
          statusCode: 200,
          body: JSON.stringify({ activity: cached, from_cache: true }) // Indicate data is from cache
        };
      }
      return { statusCode: 200, body: JSON.stringify({ activity: null, from_cache: false }) }; // No live activity, no cache
    }
    // Prefer VS Code if present, else first non-Spotify
    let activity = filtered.find(a => a.name === "Visual Studio Code") || filtered[0];
    
    let largeText = "";
    let smallText = "";
    let largeTextAssetKey = ""; // New
    let smallTextAssetKey = ""; // New

    if (activity.name === "Visual Studio Code" && activity.assets) {
        largeText = activity.assets.large_text || "";
        smallText = activity.assets.small_text || "";
        largeTextAssetKey = activity.assets.large_image || ""; // Get large_image key
        smallTextAssetKey = activity.assets.small_image || ""; // Get small_image key
    }

    // Format output
    const result = {
      name: activity.name,
      details: activity.details || "",
      state: activity.state || "",
      start: activity.timestamps && activity.timestamps.start ? activity.timestamps.start : null,
      application_id: activity.application_id || null,
      large_text: largeText, 
      small_text: smallText,
      large_text_asset_key: largeTextAssetKey, // Add to result
      small_text_asset_key: smallTextAssetKey  // Add to result
    };
    // Update cache (Sheet2) - you'd also need to update updateActivityCache and lastPlayed.js for these new keys
    await updateActivityCache(result, protocol, host); 
    return {
      statusCode: 200,
      body: JSON.stringify({ activity: result, from_cache: false }) 
    };
  } catch (err) {
    // General error, try cache as a last resort
    try {
        const cached = await getActivityCache(protocol, host);
        if (cached) {
            return {
                statusCode: 200,
                body: JSON.stringify({ activity: cached, from_cache: true, error_details: err.message })
            };
        }
    } catch (cacheErr) {
        // Ignore cache error if primary fetch already failed
    }
    // Do not leak error details in production
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
