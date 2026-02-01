# Calculator Hub 💸

A modern, feature-rich Progressive Web App (PWA) featuring a Tip Calculator, Bill Splitter, and Discount Calculator. Built with vanilla JavaScript, fully accessible, and optimized for performance.

## ✨ Features

### Core Calculators
-   **Tip Calculator**: Calculate tips with preset percentages (10%, 15%) or custom amounts. Real-time calculation with smart validation.
-   **Bill Splitter**: Split bills among multiple people with optional tip inclusion. Handles 1-100 people.
-   **Discount Calculator**: Calculate final prices after discounts with savings breakdown.

### Advanced Features
-   **Multi-language Support**: English and Spanish with dynamic UI updates
-   **Multi-currency Support**: USD, EUR, CLP, MXN, GBP, ARS with proper formatting and decimal handling
-   **Smart Rounding**: Optional intelligent rounding to .00 or .50 for cleaner totals
-   **Progressive Web App**: Installable, works offline, and provides app-like experience
-   **Calculation History**: Automatically saves last 5 calculations in localStorage
-   **Share & Copy**: Share results via Web Share API or copy to clipboard
-   **Responsive Design**: Optimized for desktop, tablet, and mobile devices
-   **Dark Mode**: System-aware theme with manual override (Light/Dark/System)
-   **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
-   **Real-time Validation**: Input validation with visual feedback and error messages
-   **Debounced Calculations**: Optimized performance with 300ms debounce delay
-   **Animated Feedback**: Pulse animations on result updates
-   **Toast Notifications**: User-friendly notifications for actions

## 🛠 Technologies Used

-   **Frontend**: HTML5, CSS3 (with CSS Variables), JavaScript (ES6+)
-   **Web Server**: Nginx with security headers and gzip compression
-   **Containerization**: Docker & Docker Compose
-   **PWA**: Service Worker, Web App Manifest
-   **APIs**: Web Share API, Clipboard API, LocalStorage API
-   **Fonts**: Google Fonts (Inter)
-   **Architecture**: Vanilla JavaScript (no frameworks), modular design

## 🎯 Key Improvements

### Performance
- ⚡ Debounced input handling (300ms delay)
- 📦 Service Worker caching for offline support
- 🗜️ Gzip compression enabled
- 🎨 CSS animations with GPU acceleration
- 🚀 Optimized for Core Web Vitals

### Accessibility (WCAG 2.1 AA)
- ♿ Full ARIA labels and roles
- ⌨️ Complete keyboard navigation
- 📢 Screen reader support
- 🎯 Focus indicators
- 📱 Touch-friendly targets (min 44x44px)
- 🔤 Semantic HTML

### Security
- 🔒 Content Security Policy (CSP)
- 🛡️ X-Frame-Options, X-Content-Type-Options
- 🔐 XSS Protection headers
- 🚫 No inline scripts (except for service worker registration)
- ✅ Input validation and sanitization

### Code Quality
- 📝 JSDoc documentation
- 🧪 Unit tests included
- 🎨 DRY principles applied
- 🔧 Centralized configuration
- 📊 Modular architecture

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have the following software installed on your system:

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Installation & Running

#### Running the Application

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/vmhq/calculator-tips.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd calculator-tips
    ```

3.  **Run the application using Docker Compose:**
    ```sh
    docker-compose up -d
    ```
    This command will pull the pre-built Docker image from the GitHub Container Registry (`ghcr.io`) and start the application. If you encounter authentication errors, you may need to log in to `ghcr.io` first.

The application will be available at **`http://localhost:8680`**.

To stop the application, run:
```sh
docker-compose down
```

### Building from Source

```bash
# Build Docker image locally
docker build -t calculator-hub:local .

# Run with custom port
docker run -d -p 8080:80 calculator-hub:local
```

### Development Mode

For local development without Docker:

```bash
# Serve with any HTTP server, e.g., Python
python -m http.server 8000 --directory src

# Or use Node.js http-server
npx http-server src -p 8000

# Access at http://localhost:8000
```

## 📁 Project Structure

```
calculator-tips/
├── src/
│   ├── index.html          # Main HTML with ARIA accessibility
│   ├── style.css           # Responsive CSS with animations
│   ├── script.js           # Core application logic
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for offline support
├── tests/
│   ├── unit-tests.js       # Unit tests for core functions
│   ├── bug_repro.js        # Bug reproduction tests
│   └── verification_test.js # Integration tests
├── Dockerfile              # Container definition
├── docker-compose.yml      # Docker composition
├── nginx.conf              # Nginx configuration with security
└── README.md               # This file
```

## 🔧 Configuration

### Constants (CONFIG object in script.js)

```javascript
DEFAULT_LANGUAGE: 'es'           // Default language (es/en)
DEFAULT_CURRENCY: 'CLP'          // Default currency
MAX_TIP_PERCENTAGE: 100          // Maximum tip percentage
MAX_BILL_AMOUNT: 10000000        // Maximum bill amount
MIN_PEOPLE: 1                    // Minimum people for split
MAX_PEOPLE: 100                  // Maximum people for split
MAX_DISCOUNT: 100                // Maximum discount percentage
DEBOUNCE_DELAY: 300              // Input debounce delay (ms)
HISTORY_MAX_ITEMS: 5             // Max items in history
TOAST_DURATION: 3000             // Toast notification duration (ms)
```

### Supported Currencies

| Currency | Symbol | Decimals | Locale |
|----------|--------|----------|--------|
| USD | $ | 2 | en-US |
| EUR | € | 2 | de-DE |
| CLP | $ | 0 | es-CL |
| MXN | $ | 2 | es-MX |
| GBP | £ | 2 | en-GB |
| ARS | $ | 2 | es-AR |

## 🎨 Features Deep Dive

### Smart Rounding
When enabled, results are rounded to the nearest .00 or .50 for cleaner totals:
- 10.23 → 10.50
- 10.67 → 11.00

### Calculation History
- Automatically saves last 5 calculations
- Stored in localStorage
- Persists across sessions
- Includes timestamp and calculation type

### Validation
- Real-time input validation
- Visual error indicators
- Maximum value enforcement
- Decimal precision handling
- Prevents invalid characters

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for number inputs
- Escape to clear focus

## 🧪 Testing

Run unit tests in Node.js:
```bash
node tests/unit-tests.js
```

Or open in browser console:
```javascript
// Include script in HTML or paste in console
window.runTests();
```

Test coverage includes:
- ✅ Tip calculations (15 scenarios)
- ✅ Bill splitting (8 scenarios)
- ✅ Discount calculations (6 scenarios)
- ✅ Currency formatting (6 scenarios)
- ✅ Utility functions (5 scenarios)

## 🔒 Security Features

### HTTP Headers (nginx.conf)
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [restrictive policy]
```

### Input Sanitization
- Regex-based input filtering
- Maximum value limits
- Type coercion prevention
- XSS prevention

## 📱 Progressive Web App

### Installation
1. Visit the app in a modern browser
2. Look for "Install" prompt or menu option
3. App works offline after installation
4. Updates automatically via service worker

### Offline Support
- All static assets cached
- Calculations work offline
- History persisted locally
- Network requests gracefully handled

## Code Documentation

All JavaScript code is fully documented with JSDoc comments:
- Function purposes and descriptions
- Parameter types and descriptions
- Return value specifications
- Usage examples where applicable

## 🎯 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |
| Mobile Safari | 14+ | ✅ Fully Supported |
| Chrome Android | 90+ | ✅ Fully Supported |

### Required Features
- ES6+ JavaScript
- CSS Variables
- Service Worker (for PWA)
- LocalStorage
- CSS Grid & Flexbox

## 🚀 Performance Metrics

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+
- **Bundle Size**: ~30KB (uncompressed)
- **No external dependencies** (except Google Fonts)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use JSDoc comments for all functions
- Follow existing naming conventions
- Maintain accessibility standards
- Write tests for new features
- Update README for significant changes

## 🗺️ Roadmap

- [ ] Add more currency support (JPY, CNY, INR, etc.)
- [ ] Implement calculation history viewer with UI
- [ ] Add custom theme colors
- [ ] Export calculations to PDF/CSV
- [ ] Add calculator for tax calculations
- [ ] Multi-language support (French, German, Portuguese)
- [ ] Add keyboard shortcuts panel
- [ ] Implement A/B testing for UX improvements
- [ ] Add analytics (privacy-focused)
- [ ] Create browser extension version

## 📊 Changelog

### Version 2.0.0 (Current)
- ✨ Added PWA support with service worker
- ✨ Implemented smart rounding feature
- ✨ Added 3 new currencies (MXN, GBP, ARS)
- ✨ Full accessibility (WCAG 2.1 AA)
- ✨ Added share and copy functionality
- ✨ Calculation history with localStorage
- ✨ Toast notifications
- ✨ Input debouncing for performance
- ✨ Comprehensive unit tests
- 🔒 Enhanced security headers
- 🎨 Improved animations and UX
- 📱 Better mobile responsiveness
- 🐛 Fixed decimal input validation

### Version 1.0.0
- Initial release
- Basic tip calculator
- Bill splitter
- Discount calculator
- Dark mode support
- 3 currencies (USD, EUR, CLP)
- Bilingual (English/Spanish)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created and maintained by the Calculator Hub team.

## 🙏 Acknowledgments

- Google Fonts for the Inter typeface
- Nginx for reliable web serving
- Docker for containerization
- The open-source community

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/vmhq/calculator-tips/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/vmhq/calculator-tips/discussions)
- 📧 **Email**: support@calculator-hub.app (if applicable)

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Made with ❤️ using Vanilla JavaScript**
