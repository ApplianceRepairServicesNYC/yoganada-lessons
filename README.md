# Wisdom Path

Transform your mind through timeless wisdom. A modern learning platform featuring structured lessons based on Paramahansa Yogananda's teachings.

![Wisdom Path](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Static Site](https://img.shields.io/badge/type-static-green)

## ✨ Features

- **Structured Learning Paths** - Complex wisdom distilled into actionable lessons
- **Progress Tracking** - Automatically saves your journey via localStorage
- **Interactive Quizzes** - Test your understanding after each lesson
- **Responsive Design** - Works beautifully on desktop and mobile
- **Dark Theme** - Premium Mindvalley-inspired aesthetic
- **No Dependencies** - Pure HTML, CSS, and JavaScript

## 🚀 Quick Start

### Option 1: GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main → / (root)
4. Your site will be live at `https://yourusername.github.io/wisdom-path/`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/wisdom-path.git

# Navigate to folder
cd wisdom-path

# Open in browser (or use any local server)
open index.html

# Or use Python's built-in server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Option 3: Deploy to Netlify/Vercel

Simply drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop) or connect your GitHub repo to Vercel.

## 📁 Project Structure

```
wisdom-path/
├── index.html                    # Homepage
├── about/
│   └── index.html               # About page
├── teachings/
│   └── paramahansa-yogananda/
│       ├── index.html           # Teacher hub
│       └── autobiography-of-a-yogi/
│           ├── index.html       # Program/lessons list
│           └── self-realization/
│               └── index.html   # Lesson 1 (free preview)
├── assets/                      # Images, icons (add your own)
└── README.md
```

## 🎨 Customization

### Adding Your Own Logo/Images

1. Add images to the `assets/` folder
2. Update references in HTML files
3. For OG images, update meta tags in each page's `<head>`

### Changing Colors

Edit the CSS variables in any HTML file:

```css
:root {
    --color-bg-deep: #0a0a0f;
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --color-accent: #8b5cf6;
    /* ... */
}
```

### Adding More Lessons

1. Create a new folder: `teachings/paramahansa-yogananda/autobiography-of-a-yogi/lesson-name/`
2. Add `index.html` based on the self-realization template
3. Update the lesson slug in the JavaScript
4. Add the lesson to the lessons list page

## 🔧 Technical Details

- **No Build Step** - Pure static HTML/CSS/JS
- **No Server Required** - Works with any static host
- **Progress Storage** - Uses localStorage (key: `wisdompath_progress`)
- **SEO Optimized** - Full meta tags, semantic HTML, Open Graph
- **Accessible** - ARIA labels, keyboard navigation, proper heading structure

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Attribution

- Background image: Paramahansa Yogananda (Public Domain, Wikimedia Commons)
- Content inspired by "Autobiography of a Yogi" - educational purposes only
- Not affiliated with Self-Realization Fellowship

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

Built with ❤️ for seekers of wisdom
