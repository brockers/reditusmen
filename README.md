# Reditus Men - 90 Day Checklist

A Progressive Web Application (PWA) for tracking daily spiritual disciplines during the 90-day Exodus 90 program leading up to Easter. This app helps participants maintain accountability by tracking 15 different daily practices including prayer, fasting, cold showers, and spiritual reading.  

A free to use production website can be found at [reditusmen.com](https://reditusmen.com).

## Features

- **90-Day Tracker**: Automatically calculates and tracks 90 days leading to Easter
- **Daily Checklist**: Track 15 different spiritual and lifestyle practices
- **Reditus Men Dailing Readings**: Complete all 4 Gospels over the course of 90 days
- **Wed/Fri Fasting Support**: The app only shows the fasting options on Wed and Fri
- **Workout Counter**: Tracks workouts per week with an indicator for the manditory 3 
- **Calendar Heatmap**: Visual progress report showing completion patterns
- **Offline Support**: Full PWA functionality with offline data persistence
- **Mobile Optimized**: Responsive design that works seamlessly on all devices
- **Local Storage**: All data stored locally for privacy
- **No build process required**: Deploy files as-is
- **PWA manifest**: Built-in, enables installability 
- **Service worker**: Provides offline functionality

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone git@github.com:brockers/reditusmen.git
cd reditusmen
```

2. **For Development**: Run a local HTTP server using npx:
```bash
npx http-server
```

3. Open app

The app will be available at `http://localhost:8080`

### Testing

The project includes comprehensive unit and integration tests using QUnit:

Open test runner directly in browser

```bash
xdg-open tests/test-runner.html
```

Or serve with any static web server

```bash 
npx http-server  # Then navigate to http://localhost:8080/tests/test-runner.html
```

**Test Coverage:**
- Date calculations (Easter date, 90-day period)
- Week number calculations
- Data structure validation
- localStorage persistence
- DOM element interactions
- Checkbox state management
- Gospel reading calculations

### Deployment

This application is designed as a static website deployed via AWS infrastructure:

**Production Architecture:**
- **Hosting**: AWS S3 bucket configured for static website hosting
- **CDN**: CloudFront distribution for global content delivery
- **Domain**: Production site running at reditusmen.com

**AWS Deployment Steps:**
1. Upload the following files to S3 bucket maintaining directory structure
```
    disciple90/
    ├── index.html          # Main application HTML
    ├── script.js           # Core application logic
    ├── style.css           # Styling and animations
    ├── manifest.json       # PWA configuration
    ├── favicon.ico         # Site icon
    ├── favicon.svg         # Vector site icon
    ├── images/            # Icons and screenshots
    └── *.min.js           # Minified third-party libraries
```
2. Ensure bucket has static website hosting enabled
3. Configure CloudFront distribution to point to S3 origin
4. Set appropriate cache behaviors for assets
5. Configure custom domain and SSL certificate

**Key Deployment Considerations:**

## Configuration

### Easter Date Setup

The application automatically calculates the 90-day period based on Easter. To update for a new year:

1. Open `script.js`
2. Find line 712: `const easterDate = new Date('04/05/2026');`
3. Update to the correct Easter date
4. The app will automatically recalculate all 90 days

### Version Updates

When making changes, update the version number in `index.html`:
```html
<meta name="version" content="3.0.0" />
```

### CloudFront Caching

CloudFront will continue to provide your old static files unless to invalidate the current files from the CloudFront Edge services.  To do that, you will need to go to your distribution in CloudFront and create an invalidation.  You can find more details at [Invalidating Files to Remove Content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html#invalidating-objects-api)


## Technologies Used

- **Vanilla JavaScript** - No framework dependencies
- **D3.js v7** - Data visualization
- **Cal-Heatmap** - Calendar heatmap display
- **Flatpickr** - Date picker functionality
- **Progressive Web App** - Installable and offline-capable

## Data Privacy

All data is stored locally in your browser's localStorage. No data is sent to external servers. Data persists across sessions but can be cleared through browser settings.

## Contributing

Feel free to submit issues and pull requests via Github. The project uses a simple architecture with no build process, making it easy to contribute.

## Support

For issues or questions, please open an issue on GitHub or contact through the repository.
