const crypto = require('crypto');

const rateLimitCache = new Map();
const messageCache = new Map();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    const { name, email, message, recaptchaToken, sessionDuration } = JSON.parse(event.body);

    // Verify reCAPTCHA v3
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await fetch(verificationURL, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'reCAPTCHA verification failed. Please try again.' }),
      };
    }

    // Get user's IP address
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || event.headers['x-real-ip'] || 'Unknown';

    // Rate limiting
    const now = Date.now();
    if (rateLimitCache.has(ip) && now - rateLimitCache.get(ip) < 5000) {
      return {
        statusCode: 429,
        body: JSON.stringify({ message: 'Too many requests. Please wait a few seconds and try again.' }),
      };
    }
    rateLimitCache.set(ip, now);

    // Create a hash of the message to check for duplicates
    const messageHash = crypto.createHash('sha256').update(`${name}${email}${message}`).digest('hex');

    if (messageCache.has(messageHash)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ message: 'Duplicate message detected. Please modify your message and try again.' }),
      };
    }
    messageCache.set(messageHash, now);

    // Fetch user's location using a geolocation API
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();
    const location = `${geoData.city || 'Unknown City'}, ${geoData.region || 'Unknown Region'}, ${geoData.country || 'Unknown Country'}`;

    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Log user's location and session duration
    console.log(`User Location: ${location}`);
    console.log(`Session Duration: ${sessionDuration}`);

    // Send message to Discord webhook with embed
    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    const discordPayload = {
      embeds: [{
        title: 'New Contact Form Submission',
        color: 3447003,
        fields: [
          { name: 'Name', value: `\`${name || 'N/A'}\``, inline: true },
          { name: 'Email', value: `\`${email || 'N/A'}\``, inline: true },
          { name: 'Message', value: `\`${message || 'N/A'}\`` },
          { name: 'Location', value: `\`${location}\``, inline: true },
          { name: 'Timestamp', value: `\`${timestamp}\``, inline: true },
          { name: 'Session Duration', value: `\`${sessionDuration || 'N/A'}\``, inline: true },
        ],
        footer: {
          text: 'Contact Form',
        },
      }]
    };

    const discordResponse = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      throw new Error('Failed to send message to Discord.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};