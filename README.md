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
- [Comments System](#comments-system) - Because every blog needs a place for people to share their hot takes

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

   Copy `env.example` to `.env` and update the values:

   ```bash
   cp env.example .env
   ```

   Then edit `.env` with your actual values:

   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
   GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
   ACTIVITIES_USER_ID=your_discord_user_id
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
- `blog-views.js` - Tracks and displays blog post view counts using Google Sheets

### Google Sheets Caching

Spotify and Discord activity data are cached in a Google Sheet for fallback when APIs are unavailable.

- Sheet1: Spotify track cache
- Sheet2: Discord activity cache
- Sheet3: Blog view counts (Slug, Title, Views, Last Viewed)

You must set up a Google Service Account and add these environment variables:

- `GOOGLE_SHEET_ID`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`

### Discord Activity

To show your Discord/VS Code/game status, set:

- `ACTIVITIES_USER_ID` (your Discord user ID, used by the Lanyard API)

### Blog View Tracking

The portfolio automatically tracks blog post views and displays view counts on the blog listing page. Views are stored in Google Sheets (Sheet3) and include:

- **Slug**: The URL slug of the blog post
- **Title**: The blog post title
- **Views**: Total view count
- **Last Viewed**: Timestamp of the last view

**Features:**

- Session-based tracking (prevents duplicate counts from the same user session)
- Real-time view count display on the blog listing page
- Automatic tracking when users visit blog posts
- Fallback to Google Sheets for reliable data storage

**Setup:**

### Manual Setup (Recommended)

1. **Open your Google Sheets document** that you're using for this portfolio (the one with Sheet1 for Spotify and Sheet2 for Discord activity)

2. **Create a new sheet**:

   - Click the "+" button at the bottom left of your Google Sheets
   - Rename the new sheet to "Sheet3" (exactly as shown)

3. **Add headers in row 1**:

   - Column A1: `Slug`
   - Column B1: `Title`
   - Column C1: `Views`
   - Column D1: `Last Viewed`

4. **Verify your setup**:
   - Your Google Sheets should now have 3 sheets: Sheet1, Sheet2, and Sheet3
   - Sheet3 should have the 4 headers in the first row
   - The system will automatically populate data when people visit your blog posts

### Automatic Setup (Fallback)

If you don't set up Sheet3 manually, the system will automatically create it with the correct structure when the first blog view is tracked.

### View Display

- The blog listing page
- Individual blog post pages

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

## 💬 Comments System

This portfolio includes a **Giscus-powered comments system** that's completely free, privacy-focused, and integrates seamlessly with your blog posts. It uses GitHub Discussions as a backend, so you get all the benefits of GitHub's moderation tools without any tracking or ads.

### Quick Setup

#### 1. Enable GitHub Discussions

1. Go to your GitHub repository: `https://github.com/your-username/your-repo`
2. Click on **Settings** tab
3. Scroll down to **Features** section
4. Enable **Discussions** checkbox
5. Click **Save**

#### 2. Install Giscus App

1. Go to [Giscus App](https://github.com/apps/giscus)
2. Click **Install**
3. Select your repository
4. Click **Install**

#### 3. Get Configuration Values

1. Go to [Giscus Configuration](https://giscus.app/)
2. Enter your repository details
3. Select **Announcements** as the Discussion Category
4. Copy the configuration values (especially `repoId` and `categoryId`)

#### 4. Update Giscus Configuration (Optional)

The Giscus configuration is already set up in the code with your repository details. If you need to change the configuration, edit these files:

- `src/_includes/comments.njk` - Main comments template
- `netlify/functions/giscus-config.js` - Configuration API

The Giscus configuration values are **not sensitive** and are meant to be public, so they're safely hardcoded in the templates.

### 🎨 Customization

#### Disable Comments

Comment out or remove the comments include from `src/_includes/post.njk`:

```njk
<!-- {% include "comments.njk" %} -->
```

#### Change Theme

Modify the `data-theme` attribute in `src/_includes/comments.njk`:

- `preferred_color_scheme` - Auto-switch based on site theme
- `light` - Always light theme
- `dark` - Always dark theme

#### Change Language

Modify the `data-lang` attribute in `src/_includes/comments.njk` (e.g., `en`, `es`, `fr`, etc.)

### 🔧 How It Works

1. **Comments are stored** in GitHub Discussions
2. **Each blog post** gets its own discussion thread
3. **Users can comment** using their GitHub account
4. **Reactions and replies** are fully supported
5. **Moderation** is handled through GitHub's built-in tools

## 🤔 FAQs

**Q: Will this portfolio get me hired?**
A: Depends on if you have actual skills to back it up. No amount of fancy CSS can hide an empty commit history.

**Q: Is this actually minimal?**
A: By the standards of developers who think adding a seventh JavaScript framework is "optimization," yes.

**Q: Can I remove the sarcastic comments?**
A: You could, but then how would people know you're a developer?

**Q: Do I need to pay for the comments system?**
A: Nope! Giscus is completely free and open source. It's like getting a premium feature without the premium price tag.

**Q: Are the Giscus configuration values sensitive?**
A: No! The Giscus config values (repo ID, category ID, etc.) are meant to be public and are safely hardcoded in the templates. Only API keys and private tokens need to be in environment variables.

---

Built with ☕ and existential dread by [Udaysinh Sapate](https://udaysinh.me)

_Remember: The best portfolio is one that's actually deployed. The second best is one that's actually updated._
