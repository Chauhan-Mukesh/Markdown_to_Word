# GitHub Pages Configuration

This repository is configured to deploy to GitHub Pages automatically via GitHub Actions.

## Deployment

The site is deployed to: https://chauhan-mukesh.github.io/Markdown_to_Word/

## Local Development

To run the application locally:

```bash
npm install
npm run serve
```

The application will be available at http://localhost:8080

## Testing

Run tests with:

```bash
npm test                 # Unit tests
npm run test:e2e        # End-to-end tests  
npm run lint            # Linting
npm run build           # Full build pipeline
```

## GitHub Pages Setup

1. The repository uses GitHub Actions for CI/CD (see `.github/workflows/deploy.yml`)
2. GitHub Pages is configured to deploy from GitHub Actions
3. The deployment includes all static files (HTML, CSS, JS, assets)
4. External dependencies have fallback mechanisms for offline functionality