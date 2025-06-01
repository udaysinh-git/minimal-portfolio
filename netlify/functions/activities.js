const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
  const ACTIVITIES_USER_ID = process.env.ACTIVITIES_USER_ID;
  if (!ACTIVITIES_USER_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ACTIVITIES_USER_ID not set" }),
    };
  }

  try {
    const url = `https://api.lanyard.rest/v1/users/${ACTIVITIES_USER_ID}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "Lanyard API error" }) };
    }
    const data = await res.json();
    const activities = (data && data.data && Array.isArray(data.data.activities)) ? data.data.activities : [];
    // Exclude Spotify
    const filtered = activities.filter(
      a => a.name !== "Spotify"
    );
    // Only show if there is at least one non-Spotify activity
    if (!filtered.length) {
      return { statusCode: 200, body: JSON.stringify({ activity: null }) };
    }
    // Prefer VS Code if present, else first non-Spotify
    let activity = filtered.find(a => a.name === "Visual Studio Code") || filtered[0];
    // Format output
    const result = {
      name: activity.name,
      details: activity.details || "",
      state: activity.state || "",
      start: activity.timestamps && activity.timestamps.start ? activity.timestamps.start : null,
      application_id: activity.application_id || null
    };
    return {
      statusCode: 200,
      body: JSON.stringify({ activity: result })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
