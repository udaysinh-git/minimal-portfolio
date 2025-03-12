# Deployment Guide for Minimal Portfolio with Serverless Functions

This guide explains how to deploy your portfolio site with Netlify Serverless Functions.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. A [GitHub](https://github.com) personal access token with appropriate permissions

## Deployment Steps

### 1. Set up your repository on GitHub

Ensure your code is pushed to GitHub and the repository includes all the necessary files:
- The main site code in `src/`
- The Netlify functions in `netlify/functions/`
- The `netlify.toml` file at the project root

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select GitHub as your provider and authorize Netlify
4. Choose your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `_site`

### 3. Set up environment variables

1. Go to Site settings > Build & deploy > Environment
2. Add the following environment variable:
   - Key: `GITHUB_TOKEN`
   - Value: Your GitHub personal access token
3. Save the changes

### 4. Trigger a deploy

1. Go to the Deploys tab
2. Click "Trigger deploy" > "Deploy site"
3. Wait for the build and deployment to complete

### 5. Verify the deployment

1. Visit your new Netlify site URL
2. Check that the GitHub page is loading data properly from the serverless functions
3. Verify that all charts and repository data are displaying correctly

## Troubleshooting

### Function invocation fails

If your functions don't work properly:

1. Check Netlify's Function logs in the Netlify dashboard (Functions > Your Function > View Logs)
2. Verify that your GitHub token has the correct permissions
3. Check if you've hit GitHub's API rate limits

### Local testing

To test locally before deploying:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Create a `.env` file with your GitHub token
3. Run `netlify dev` to start the local development server
4. Visit `http://localhost:8888` to test your site

## Updating the site

After making changes:

1. Push your changes to GitHub
2. Netlify will automatically detect changes and trigger a new build
3. Check the deployment status in the Netlify dashboard

## Additional Resources

- [Netlify Docs: Functions](https://docs.netlify.com/functions/overview/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
