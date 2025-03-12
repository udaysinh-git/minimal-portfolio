# GitHub Serverless Functions

This directory contains serverless functions to interact with GitHub's API and fetch data for the portfolio site.

## Available Functions

1. **github-profile.js** - Fetches user profile and commit count
2. **github-pinned-repos.js** - Gets pinned repositories using GitHub's GraphQL API
3. **github-latest-repos.js** - Retrieves latest repositories
4. **github-contributions.js** - Gets contribution data for the last 5 years
5. **github-language-stats.js** - Collects language usage statistics across all repos

## Local Development

To run these functions locally:

1. Create a `.env` file in the project root with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

2. Run `npm install` to install dependencies

3. Start the local development server:
   ```
   npm run start
   ```

## Deployment

When deploying to Netlify, make sure to add the `GITHUB_TOKEN` environment variable in the Netlify dashboard.
