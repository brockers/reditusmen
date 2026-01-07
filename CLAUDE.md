# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Reditus Men Daily Checklist" is a Progressive Web Application (PWA) for tracking spiritual disciplines during the 90-day Exodus 90 program leading to Easter. It's a pure client-side web application with no build process required.

## Development Commands

**Running the application:**
```bash
# Option 1: Open directly in browser
open index.html  # macOS
xdg-open index.html  # Linux

# Option 2: Serve with any static web server
python3 -m http.server 8000  # then visit localhost:8000
npx http-server  # if Node.js is available
```

**Version updates:**
- Update version in index.html (meta tag with name="version")
- Current version: 2.1.0

## Architecture & Key Components

**Core Files:**
- `index.html` - Application structure and UI (contains version number)
- `script.js` - All application logic including:
  - Easter date calculation and 90-day program setup
  - LocalStorage management (key: "2025disciple90")
  - Daily checklist functionality
  - Calendar heatmap generation
- `style.css` - All styling and animations
- `manifest.json` - PWA configuration

**Data Structure:**
The app tracks 15 daily practices for 90 days. Data is stored in localStorage as a JSON object with:
- Days keyed by date strings
- Each day contains boolean flags for 15 practices
- Weekly workout data stored separately

**Key Date:** Easter is hardcoded in script.js:712 as `new Date('2026-04-05')`. Update this annually.

**External Dependencies (all minified, no npm):**
- D3.js v7 - Data visualization
- Cal-Heatmap - Calendar heatmap display
- Flatpickr - Date picker
- Popper.js & Tooltip.js - UI positioning

## Important Development Notes

1. **No build process** - Edit files directly, refresh browser to test
2. **localStorage persistence** - Data survives page refreshes but not cache clears
3. **PWA features** - Test offline functionality and installation prompts
4. **Mobile-first design** - Always test responsive behavior
5. **90-day calculation** - Program starts 90 days before Easter (inclusive)

## Testing

**Running tests:**
```bash
# Open test runner in browser
open tests/test-runner.html  # macOS
xdg-open tests/test-runner.html  # Linux

# Or serve with any static web server and navigate to /tests/test-runner.html
python3 -m http.server 8000  # then visit localhost:8000/tests/test-runner.html
```

**Test Structure:**
- `tests/test-runner.html` - QUnit test runner page
- `tests/test-utils.js` - Testing utilities and mock helpers
- `tests/unit-tests.js` - Unit tests for core functions (dates, weeks, data structures)
- `tests/integration-tests.js` - Integration tests for localStorage and DOM interactions

**Test Coverage:**
- Date calculations (Easter date, 90-day period)
- Week number calculations
- Data structure validation
- localStorage persistence
- DOM element existence
- Checkbox state management
- Reading calculations

## Common Tasks

**Change Easter date:**
Edit script.js:3 to update the Easter date, which automatically recalculates the entire 90-day period.

**Modify daily practices:**
The 15 practices are defined in the HTML checkboxes and referenced throughout script.js.

**Debug data issues:**
Check localStorage with: `JSON.parse(localStorage.getItem('2026reditusmen'))`

**Test calendar heatmap:**
The heatmap requires actual usage data. Use browser DevTools to inject test data into localStorage.