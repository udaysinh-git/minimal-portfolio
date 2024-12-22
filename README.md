# Minimal Portfolio

This is a minimal portfolio website built using [Eleventy](https://www.11ty.dev/), a simple static site generator. The portfolio includes sections for achievements, GitHub repositories, blog posts, and a resume.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Deployment](#deployment)

## Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/udaysinh-git/minimal-portfolio.git
   cd minimal-portfolio
   ```
2. **Install dependencies**:

   ```bash
   npm install
   ```
3. **Run the development server**:

   ```bash
   npx eleventy --serve
   ```

   This will start a local development server at `http://localhost:8080`.

## Usage

### Changing Content

- **Home Page**: Edit index.md
- **Achievements**: Edit achievements.md
- **Resume**: Edit resume.md
- **Blog Posts**: Add or edit markdown files in posts
- **GitHub Repositories**: The repositories are fetched dynamically from your GitHub account. Ensure your GitHub username is correctly set in .eleventy.

### Theme Toggle

The website supports multiple themes (dark mode, light mode, pastel mode, eye-soothing mode). Users can toggle between themes using the button in the header.

### Back to Top Button

A "Back to Top" button appears when the user scrolls down the page. Clicking this button will smoothly scroll the user back to the top of the page.

## Project Structure
```bash
minimal-portfolio/
├── _site/                  # Generated site output
├── src/                    # Source files
│   ├── _includes/          # Layout and partial templates
│   │   ├── layout.njk      # Main layout template
│   │   └── post.njk        # Post layout template
│   ├── posts/              # Blog posts
│   │   ├── 2023-10-01-my-first-post.md
│   │   └── cats_vs_dogs.md
│   ├── achievements.md     # Achievements page content
│   ├── blog.md             # Blog page content
│   ├── github.md           # GitHub repositories page content
│   ├── index.md            # Home page content
│   └── resume.md           # Resume page content
├── .eleventy.js            # Eleventy configuration
├── package.json            # Project metadata and dependencies
├── styles.css              # Global styles
└── README.md               # Project documentation
```
## Customization

### Styles

To customize the styles, edit styles.css

- CSS includes variables for different themes and media queries for responsiveness.

### Layouts

To customize the layouts, edit the templates in _includes

### Adding New Pages

To add a new page, create a new markdown file in the src directory and use the appropriate layout.

```md
---
layout: layout.njk
title: New Page
---

# New Page

Content goes here.
```

## Deployment

To deploy the site, you can use any static site hosting service, such as GitHub Pages, Netlify, or Vercel.

### GitHub Pages

1. **Build the site**:

   ```bash
   npx eleventy
   ```
2. **Push the _site directory to the `gh-pages` branch**:

   ```bash
   git subtree push --prefix _site origin gh-pages
   ```

### Netlify

1. **Connect your repository to Netlify**.
2. **Set the build command** to `npx eleventy`.
3. **Set the publish directory** to _site

### Vercel

1. **Connect your repository to Vercel**.
2. **Set the build command** to `npx eleventy`.
3. **Set the output directory** to _site

## License

This project is licensed under the MIT License. See the LICENSE ile for details.
