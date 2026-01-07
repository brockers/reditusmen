// Test utilities and helpers
const TestUtils = {
    // Store original localStorage for restoration
    originalLocalStorage: null,
    
    // Mock localStorage for testing
    mockLocalStorage: function() {
        this.originalLocalStorage = window.localStorage;
        const storage = {};
        
        const mockStorage = {
            getItem: function(key) {
                return storage[key] || null;
            },
            setItem: function(key, value) {
                storage[key] = value.toString();
            },
            removeItem: function(key) {
                delete storage[key];
            },
            clear: function() {
                Object.keys(storage).forEach(key => delete storage[key]);
            }
        };
        
        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true,
            configurable: true
        });
        
        return mockStorage;
    },
    
    // Restore original localStorage
    restoreLocalStorage: function() {
        if (this.originalLocalStorage) {
            Object.defineProperty(window, 'localStorage', {
                value: this.originalLocalStorage,
                writable: true,
                configurable: true
            });
        }
    },
    
    // Create a test configuration
    createTestConfig: function(overrides = {}) {
        const testEaster = new Date('04/06/2026');
        const testStart = new Date(testEaster);
        testStart.setDate(testStart.getDate() - 90);
        
        const defaultConfig = {
            curIndex: 0,
            startDate: testStart.getTime(),
            days: this.createTestDays(testStart)
        };
        
        return Object.assign({}, defaultConfig, overrides);
    },
    
    // Create test days array
    createTestDays: function(startDate) {
        const days = [];
        const jan1 = new Date(startDate.getFullYear(), 0, 1);
        
        for (let i = 0; i < 90; i++) {
            const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
            const weekOfYear = this.getWeekOfYear(jan1, date);
            
            days.push({
                date: date.getTime(),
                week: "week" + weekOfYear,
                results: {
                    "sl": false, "cs": false, "ex": false,
                    "pc": false, "tv": false, "al": false,
                    "sn": false, "mu": false, "pu": false,
                    "fa": false, "hh": false, "mo": false,
                    "ne": false, "re": false, "ci": false
                }
            });
        }
        
        return days;
    },
    
    // Copy of getWeekOfYear function for testing
    getWeekOfYear: function(januaryFirst, currentDate) {
        const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
        const nextMonday = new Date(januaryFirst.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);
        return (currentDate < nextMonday) ? 52 : (currentDate > nextMonday ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
    },
    
    // Simulate checkbox clicks
    simulateCheckboxClick: function(checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        }
    },
    
    // Get all checkbox states
    getCheckboxStates: function() {
        const checkboxIds = ['sl', 'cs', 'ex', 'pc', 'tv', 'al', 'sn', 'mu', 'pu', 'fa', 'hh', 'mo', 'ne', 're', 'ci'];
        const states = {};
        
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            states[id] = checkbox ? checkbox.checked : false;
        });
        
        return states;
    },
    
    // Clear all checkboxes
    clearAllCheckboxes: function() {
        const checkboxIds = ['sl', 'cs', 'ex', 'pc', 'tv', 'al', 'sn', 'mu', 'pu', 'fa', 'hh', 'mo', 'ne', 're', 'ci'];
        
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.classList.remove('checked');
            }
        });
    },
    
    // Calculate expected reading for a day
    calculateExpectedReading: function(dayIndex) {
        const gospels = {
            "Matthew": 28,
            "Mark": 16,
            "Luke": 24,
            "John": 21
        };
        
        const readings = [];
        Object.entries(gospels).forEach(([book, chapters]) => {
            for (let i = 1; i <= chapters; i++) {
                readings.push(`${book} Chapter ${i}`);
            }
        });
        
        return readings[dayIndex] || "No reading for today";
    }
};
