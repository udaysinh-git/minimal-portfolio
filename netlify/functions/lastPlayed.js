const getGoogleapis = async () => {
  try {
    const { google } = await import("googleapis");
    return google;
  } catch (err) {
    throw new Error(`Failed to load googleapis module: ${err.toString()}`);
  }
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

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
    throw new Error(`Authentication error: ${err.toString()}`);
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
        message: "Authentication failed",
        error: authError.toString(),
      }),
    };
  }

  if (event.httpMethod === "GET") {
    try {
      // Update the range to include new columns (A2:G2)
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A2:G2",
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
          message: "Error reading sheet",
          error: error.toString(),
        }),
      };
    }
  } else if (event.httpMethod === "POST") {
    try {
      // Expect the song data as JSON in the body; now including progress_ms and is_playing
      const data = JSON.parse(event.body);
      if (
        !data.id ||
        !data.name ||
        !data.url ||
        !data.artists ||
        !data.album ||
        data.progress_ms === undefined ||
        data.is_playing === undefined
      ) {
        throw new Error("Missing required parameters");
      }
      const values = [[
        data.id,
        data.name,
        data.url,
        data.artists,
        data.album,
        data.progress_ms,
        data.is_playing
      ]];
      // Update the designated row. Change the range to A2:G2 to accommodate extra columns.
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A2:G2",
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
          message: "Error updating sheet",
          error: error.toString(),
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