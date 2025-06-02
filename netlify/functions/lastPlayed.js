const getGoogleapis = async () => {
  try {
    const { google } = await import("googleapis");
    return google;
  } catch (err) {
    throw new Error(`Failed to load googleapis module: ${err.toString()}`);
  }
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Helper to determine which sheet to use
function getSheetName(event) {
  // Use Sheet2 for activities (type=activity or sheet=Sheet2), else Sheet1 for Spotify
  if (event.httpMethod === "GET") {
    const url = new URL(event.rawUrl || `http://dummy${event.path}${event.queryString ? '?' + event.queryString : ''}`);
    const type = url.searchParams.get("type");
    const sheet = url.searchParams.get("sheet");
    if (type === "activity" || sheet === "Sheet2") return "Sheet2";
    return "Sheet1";
  } else if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      if (data.type === "activity" || data.sheet === "Sheet2") return "Sheet2";
    } catch {}
    return "Sheet1";
  }
  return "Sheet1";
}

async function getSheetClient() {
  const google = await getGoogleapis();
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    return google.sheets({ version: "v4", auth });
  } catch (err) {
    // Do not leak sensitive error details
    throw new Error(`Authentication error`);
  }
}

exports.handler = async (event, context) => {
  let sheets;
  try {
    sheets = await getSheetClient();
  } catch (authError) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Authentication failed"
      }),
    };
  }

  const sheetName = getSheetName(event);

  if (event.httpMethod === "GET") {
    try {
      // Read row from the correct sheet.
      // For Sheet1 (Spotify), range is A2:I2 (9 columns)
      // For Sheet2 (Activity), range is A2:I2 (9 columns now)
      const range = `${sheetName}!A2:I2`; // Both sheets will use A2:I2 if Sheet2 has 9 columns
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: range,
      });
      const row = (result.data.values && result.data.values[0]) || null;
      return {
        statusCode: 200,
        body: JSON.stringify({ row }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error reading sheet"
        }),
      };
    }
  } else if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      let values;
      let range;

      if (sheetName === "Sheet2") {
        // Handling for Activity data (Sheet2)
        // Columns: name, details, state, start, application_id, large_text, small_text, large_text_asset_key, small_text_asset_key
        if (
          data.name === undefined ||
          data.details === undefined ||
          data.state === undefined ||
          data.start === undefined || 
          data.application_id === undefined ||
          data.large_text === undefined || 
          data.small_text === undefined ||
          data.large_text_asset_key === undefined || // New field
          data.small_text_asset_key === undefined    // New field
        ) {
          throw new Error("Missing required parameters for activity");
        }
        values = [[
          data.name,
          data.details,
          data.state,
          data.start,
          data.application_id,
          data.large_text, 
          data.small_text,
          data.large_text_asset_key, // New field
          data.small_text_asset_key  // New field
        ]];
        range = `${sheetName}!A2:I2`; // 9 columns for activities
      } else {
        // Handling for Spotify data (Sheet1)
        if (
          !data.id ||
          !data.name ||
          !data.url ||
          !data.artists ||
          !data.album ||
          data.album_image === undefined ||
          data.duration_ms === undefined ||
          data.progress_ms === undefined ||
          data.is_playing === undefined
        ) {
          throw new Error("Missing required parameters for spotify track");
        }
        values = [[
          data.id,
          data.name,
          data.url,
          data.artists,
          data.album,
          data.album_image,
          data.duration_ms,
          data.progress_ms,
          data.is_playing
        ]];
        range = `${sheetName}!A2:I2`; // 9 columns for Spotify
      }

      // Update the cache row in the correct sheet.
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: "RAW",
        requestBody: { values },
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Sheet updated" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error updating sheet"
        }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }
};