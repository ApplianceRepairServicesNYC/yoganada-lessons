# Wisdom Path Learning App (Static)

A fully static learning application with inline CSS and JavaScript. Ready for GitHub Pages deployment.

## Features

- **100% Static**: No server required
- **Inline Everything**: CSS and JS embedded in each HTML file
- **GitHub Pages Ready**: Deploy directly with no build step
- **Progress Tracking**: localStorage-based, persists across sessions
- **DMV-Style Quiz**: One question at a time with immediate feedback
- **Mobile-First**: Designed for touch interfaces with large tap targets
- **Free Preview Model**: First lesson free, others locked (payment-ready architecture)

## File Structure

```
/
├── index.html                              # Homepage
└── teachings/
    └── paramahansa-yogananda/
        ├── index.html                      # Teacher hub
        └── autobiography-of-a-yogi/
            ├── index.html                  # Book page with lesson list
            └── self-realization/
                └── index.html              # Free lesson with quiz
```

## Deployment

### GitHub Pages

1. Create a new repository
2. Upload all files maintaining the folder structure
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main → / (root)
5. Your site will be live at `https://username.github.io/repo-name/`

### Netlify / Vercel

1. Drag and drop the folder to deploy
2. Or connect to your GitHub repository
3. No build configuration needed

### Local Preview

Simply open `index.html` in a browser. All links use relative paths.

## Adding Payment

The architecture supports future payment integration:

1. Locked lessons check a flag before displaying content
2. Add Stripe/RevenueCat integration
3. Store unlock status in localStorage or backend
4. Show/hide content based on purchase state

## Mobile App Wrapper

To wrap for App Store:

```bash
# Using Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Wisdom Path" com.wisdompath.app --web-dir .
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
```

## Customization

### Adding Lessons

1. Create new folder under `autobiography-of-a-yogi/`
2. Copy `self-realization/index.html` as template
3. Update content, quiz data, and breadcrumb paths
4. Add lesson entry to book page (`autobiography-of-a-yogi/index.html`)
5. Update lesson count and slugs array in book page script

### Changing Colors

Edit CSS variables in the `<style>` block of any HTML file:

```css
:root {
    --color-accent: #6B8E7D;      /* Primary brand color */
    --color-bg: #FDFBF7;          /* Background */
    --color-text-primary: #2D2A26; /* Main text */
}
```

## License

Educational use only. Content inspired by public domain works.
