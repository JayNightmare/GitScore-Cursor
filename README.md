# GitHub Repository Scorer

A static web application that scores GitHub repositories based on various metrics like README quality, license presence, stars, forks, recent commits, and CI workflows. The site is built with Next.js and Tailwind CSS, and can be deployed to GitHub Pages.

## Features

- Static site generation for GitHub Pages deployment
- Real-time repository scoring using GitHub's GraphQL API
- MongoDB caching for improved performance
- Beautiful UI with Tailwind CSS
- Responsive design
- Score breakdown with weighted metrics

## Prerequisites

- Node.js 18 or later
- MongoDB database
- GitHub Personal Access Token with `repo` scope

## Environment Variables

Create a `.env.local` file with the following variables:

```env
GITHUB_TOKEN=your_github_token
MONGODB_URI=your_mongodb_connection_string
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Export static files:
   ```bash
   npm run export
   ```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

To deploy manually:

```bash
npm run build
npm run export
npm run gh-pages
```

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT 