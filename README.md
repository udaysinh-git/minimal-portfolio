# 🌟 Minimal Portfolio: Where Simplicity Meets Showing Off

Welcome to the most gloriously minimal portfolio website known to mankind (or at least to your GitHub followers). Built with [Eleventy](https://www.11ty.dev/), this portfolio is so minimalist it makes Marie Kondo look like a hoarder.

> "Because nothing says 'hire me' like a clean codebase and a deployment that doesn't crash." — Some Developer, Probably

## 📋 Table of Contents (For Those Who Can't Be Bothered to Scroll)

- [Setup](#setup) - Yes, you actually have to set things up
- [Usage](#usage) - How to use this, in case clicking buttons is confusing
- [Project Structure](#project-structure) - For those who enjoy file trees more than actual trees
- [Customization](#customization) - Make it yours (but probably don't make it worse)
- [Deployment](#deployment) - How to share your brilliance with the world
- [Netlify Functions](#netlify-functions) - Magic serverless stuff for the modern developer who's too cool for servers

## 🚀 Setup

1. **Clone the repository** (Because copying someone else's work is the foundation of all great software):

   ```bash
   git clone https://github.com/udaysinh-git/minimal-portfolio.git
   cd minimal-portfolio  # Enter the void
   ```
2. **Install dependencies** (Prepare for your computer to download half the internet):

   ```bash
   npm install  # Go make coffee, this might take a while
   ```
3. **Configure environment variables** (The secrets that make your app work, but you'll forget in 3 days):

   Create a `.env` file in the root directory:

   ```
   GITHUB_TOKEN=your_github_personal_access_token  # Don't share this, or do, I'm a README not a cop
   ```

## 🖥️ Usage

- **Development Mode** (For when you want to break things locally first):

  ```bash
  npx eleventy --serve  # Magic happens at http://localhost:8080
  ```
- **Build for Production** (For when you're finally ready to show the world):

  ```bash
  npx eleventy  # Crosses fingers automatically
  ```
- **Content Management for the Technically Challenged**:

  - Add new pages by creating markdown files in `src` (it's basically like using Word, if Word were actually good)
  - Write blog posts in `src/posts` (perfect for those 3 AM thoughts that absolutely need to be published)
  - Update your GitHub flexes by... well, actually doing things on GitHub

## 📁 Project Structure (The Anatomical Chart of Your Digital Self)

```
minimal-portfolio/
├── _site/                  # Where the magic happens (auto-generated)
├── src/                    # Source files (where you actually do work)
│   ├── _includes/          # Templates (for those who hate repeating themselves)
│   ├── posts/              # Blog posts (where your hot takes live)
│   ├── styles/             # CSS (make it pretty or don't, we won't judge)
│   ├── achievements.md     # Humble brags
│   ├── blog.md             # More humble brags but longer
│   ├── github.md           # Proof you actually code sometimes
│   ├── index.md            # The homepage nobody reads
│   └── resume.md           # The formal version of your achievements.md
├── netlify/                # Netlify magic
│   └── functions/          # Serverless functions (for when you're too hipster for servers)
├── .eleventy.js            # Configuration (don't touch unless you know what you're doing, which you don't)
└── package.json            # The list of stuff you're borrowing from other developers
```

## 🎨 Customization (AKA "Make It Yours But Don't Break It")

- **Content**: Edit the markdown files in `src`. It's like a diary, but public and judged by potential employers.
- **Styles**: Modify CSS files in `src/styles/` if you think you have better taste (narrator: they didn't)
- **Layouts**: Adjust templates in `src/_includes/` if you're feeling particularly brave or destructive

## 🚀 Deployment (Sharing Your Creation with a World That Didn't Ask for It)

### Netlify (The Cool Kid Option)

1. Connect your repo to Netlify (it's like Instagram for code)
2. Set these magic words:
   - Build command: `npx eleventy`
   - Publish directory: `_site`
   - Environment variable: `GITHUB_TOKEN` (your personal GitHub token)
3. Click deploy and pray to the CI/CD gods

### GitHub Pages (The Classic Option)

1. Build the site:

   ```bash
   npx eleventy  # Transforms your markdown ramblings into HTML
   ```
2. Push to gh-pages:

   ```bash
   git subtree push --prefix _site origin gh-pages  # Voodoo command that somehow works
   ```

## ⚡ Netlify Functions (Serverless Magic)

This portfolio uses Netlify functions to fetch your GitHub data, because hardcoding your repository information would be so 2010.

Available functions:

- `github-profile.js` - Shows off your follower count
- `github-pinned-repos.js` - Displays the projects you're least embarrassed about
- `github-latest-repos.js` - Reveals how recently you've actually coded
- `github-contributions.js` - Proves you occasionally commit (to code, at least)
- `github-language-stats.js` - Exposes how much JavaScript you actually write vs. pretend not to
- `spotify.js` - Shows your current or last played Spotify track, with Google Sheets caching for fallback
- `activities.js` - Shows your current Discord activity (e.g., VS Code, games) using Lanyard API, with Google Sheets caching for fallback
- `lastPlayed.js` - Handles Google Sheets caching for both Spotify and Activity/Discord status

### Google Sheets Caching

Spotify and Discord activity data are cached in a Google Sheet for fallback when APIs are unavailable.

- Sheet1: Spotify track cache
- Sheet2: Discord activity cache

You must set up a Google Service Account and add these environment variables:

- `GOOGLE_SHEET_ID`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`

### Discord Activity

To show your Discord/VS Code/game status, set:

- `ACTIVITIES_USER_ID` (your Discord user ID, used by the Lanyard API)

### Securing Secrets for Git

**Never commit your `.env` file or any secrets to git!**

- Add `.env` and any secret config files to `.gitignore`
- Double-check that your Google credentials and tokens are not staged for commit

### 🏠 For local development:

1. Create a `.env` file (yes, we mentioned this earlier, but if you're reading documentation sequentially, you're doing it wrong):

   ```bash
   GITHUB_TOKEN=your_github_personal_access_token
   ```
2. Start the local dev server:

   ```bash
   npm run start  # Opens localhost and your pathway to fame
   ```
or if you use netlify use `netlify dev`
## 🤔 FAQs

**Q: Will this portfolio get me hired?**
A: Depends on if you have actual skills to back it up. No amount of fancy CSS can hide an empty commit history.

**Q: Is this actually minimal?**
A: By the standards of developers who think adding a seventh JavaScript framework is "optimization," yes.

**Q: Can I remove the sarcastic comments?**
A: You could, but then how would people know you're a developer?

---

Built with ☕ and existential dread by [Udaysinh Sapate](https://udaysinh.me)

*Remember: The best portfolio is one that's actually deployed. The second best is one that's actually updated.*
