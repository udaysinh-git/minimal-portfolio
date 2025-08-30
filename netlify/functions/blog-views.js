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

  if (event.httpMethod === "GET") {
    try {
      // First, check if Sheet3 exists, if not create it
      try {
        const range = "Sheet3!A2:D";
        const result = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: range,
        });
        
        const rows = result.data.values || [];
        const blogViews = rows.map(row => ({
          slug: row[0] || '',
          title: row[1] || '',
          views: parseInt(row[2]) || 0,
          lastViewed: row[3] || ''
        }));
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ blogViews }),
        };
      } catch (sheetError) {
        // Sheet3 doesn't exist, create it
        console.log("Sheet3 doesn't exist, creating it...");
        
        // Create Sheet3
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: "Sheet3"
                  }
                }
              }
            ]
          }
        });
        
        // Add headers to the new sheet
        const headers = [['Slug', 'Title', 'Views', 'Last Viewed']];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: 'Sheet3!A1:D1',
          valueInputOption: 'RAW',
          requestBody: {
            values: headers
          },
        });
        
        // Return empty blog views since the sheet is new
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ blogViews: [] }),
        };
      }
    } catch (error) {
      console.error("Error reading blog views:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error reading blog views"
        }),
      };
    }
  } else if (event.httpMethod === "POST") {
    try {
      const { slug, title } = JSON.parse(event.body);
      
      if (!slug || !title) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Missing required parameters: slug and title"
          }),
        };
      }

      // First, ensure Sheet3 exists
      try {
        // Test if Sheet3 exists by trying to read from it
        await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: "Sheet3!A1:A1",
        });
      } catch (sheetError) {
        // Sheet3 doesn't exist, create it
        console.log("Sheet3 doesn't exist, creating it...");
        
        // Create Sheet3
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: "Sheet3"
                  }
                }
              }
            ]
          }
        });
        
        // Add headers to the new sheet
        const headers = [['Slug', 'Title', 'Views', 'Last Viewed']];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: 'Sheet3!A1:D1',
          valueInputOption: 'RAW',
          requestBody: {
            values: headers
          },
        });
      }

      // Now try to find existing entry
      const range = "Sheet3!A2:D";
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: range,
      });
      
      const rows = result.data.values || [];
      const existingRowIndex = rows.findIndex(row => row[0] === slug);
      
      if (existingRowIndex !== -1) {
        // Update existing entry
        const currentViews = parseInt(rows[existingRowIndex][2]) || 0;
        const newViews = currentViews + 1;
        const timestamp = new Date().toISOString();
        
        const updateRange = `Sheet3!C${existingRowIndex + 2}:D${existingRowIndex + 2}`;
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: updateRange,
          valueInputOption: "RAW",
          requestBody: {
            values: [[newViews, timestamp]]
          },
        });
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message: "View count updated",
            views: newViews
          }),
        };
      } else {
        // Add new entry
        const timestamp = new Date().toISOString();
        const newRow = [slug, title, 1, timestamp];
        
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: "Sheet3!A:D",
          valueInputOption: "RAW",
          requestBody: {
            values: [newRow]
          },
        });
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message: "New blog view recorded",
            views: 1
          }),
        };
      }
    } catch (error) {
      console.error("Error updating blog views:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error updating blog views"
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
