# Wisdom Path Learning App

A structured learning application inspired by yogic and spiritual teachings, starting with the teachings of Paramahansa Yogananda.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

## Project Structure

```
/
├── server.js              # Express server with API endpoints
├── package.json           # Node.js dependencies
├── /data/
│   └── yogananda.json     # Lesson data (JSON)
└── /public/
    ├── index.html         # Homepage
    ├── /css/
    │   └── styles.css     # All styles
    ├── /js/
    │   ├── main.js        # Core app functionality
    │   ├── quiz.js        # Quiz system
    │   └── progress.js    # Progress tracking (localStorage)
    └── /teachings/
        └── /paramahansa-yogananda/
            ├── index.html # Teacher hub page
            └── /autobiography-of-a-yogi/
                ├── index.html              # Book page with lesson list
                └── /self-realization/
                    └── index.html          # Free lesson page
```

## Features

- **Free Preview Model**: First lesson is free, remaining lessons are locked
- **Progress Tracking**: localStorage-based progress saved on device
- **DMV-Style Quizzes**: One question at a time with immediate feedback
- **Mobile-First Design**: Card-based UI with large tap targets
- **Clean URLs**: Server handles routing for clean paths

## API Endpoints

- `GET /api/yogananda` - Returns all lesson data
- `GET /api/yogananda/lesson/:slug` - Returns specific lesson data

## Deployment

### Replit
1. Upload all files
2. Run `npm install`
3. Click "Run"

### Local Node.js
```bash
npm install
npm start
```

### Cloud Hosting (Render, Railway, Heroku)
1. Push to GitHub
2. Connect repository to hosting platform
3. Set start command: `npm start`
4. Deploy

### Mobile App Wrapper (Capacitor)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Wisdom Path" com.wisdompath.app
npx cap add ios
npx cap add android
npx cap sync
```

## Architecture Notes

### Payment Integration Ready
The app architecture supports adding payment:
- Check `free` property on lessons in JSON
- Implement unlock logic in lesson list page
- Add payment processor (Stripe, RevenueCat for mobile)

### Subscription Support
To add subscriptions:
1. Add `subscriptionRequired` flag to lessons
2. Implement subscription check middleware
3. Add subscription management UI

### Adding New Lessons
1. Add lesson object to `/data/yogananda.json`
2. Create lesson page in appropriate directory
3. Update lesson list on book page

## Tech Stack

- Node.js + Express
- Vanilla HTML, CSS, JavaScript
- JSON for data storage
- localStorage for progress

## Legal Notes

- Content is educational commentary only
- Uses "based on" or "inspired by" language
- No copyrighted text reproduced
- No medical or transformation claims
- App Store policy compliant

## License

Educational use only. Content inspired by public domain and fair use educational commentary.
