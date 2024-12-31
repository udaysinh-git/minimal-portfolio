const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, message, recaptchaToken } = JSON.parse(event.body);

    // Verify reCAPTCHA v3
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await fetch(verificationURL, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) { // Adjust score threshold as needed
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'reCAPTCHA verification failed. Please try again.' }),
      };
    }

    // Send message to Discord webhook
    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    const discordPayload = {
      content: `**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`,
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