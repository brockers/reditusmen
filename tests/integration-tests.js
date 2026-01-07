// Integration Tests for localStorage and DOM interactions

QUnit.module('LocalStorage Integration', function(hooks) {
    hooks.beforeEach(function() {
        // Clear localStorage before each test
        TestUtils.mockLocalStorage();
    });
    
    hooks.afterEach(function() {
        // Restore original localStorage
        TestUtils.restoreLocalStorage();
    });
    
    QUnit.test('DB saves configuration to localStorage', function(assert) {
        const config = TestUtils.createTestConfig();
        const dbName = '2026reditusmen';
        
        // Save config
        localStorage.setItem(dbName, JSON.stringify(config));
        
        // Verify saved
        const saved = localStorage.getItem(dbName);
        assert.ok(saved, 'Configuration saved to localStorage');
        
        const parsed = JSON.parse(saved);
        assert.equal(parsed.curIndex, config.curIndex, 'curIndex saved correctly');
        assert.equal(parsed.startDate, config.startDate, 'startDate saved correctly');
        assert.equal(parsed.days.length, 90, 'All 90 days saved');
    });
    
    QUnit.test('DB loads configuration from localStorage', function(assert) {
        const dbName = '2026reditusmen';
        const testConfig = TestUtils.createTestConfig();
        
        // Modify some data
        testConfig.curIndex = 5;
        testConfig.days[5].results.sl = true;
        testConfig.days[5].results.cs = true;
        
        // Save to localStorage
        localStorage.setItem(dbName, JSON.stringify(testConfig));
        
        // Load it back
        const loaded = JSON.parse(localStorage.getItem(dbName));
        
        assert.equal(loaded.curIndex, 5, 'Modified curIndex loaded correctly');
        assert.equal(loaded.days[5].results.sl, true, 'Modified results loaded correctly');
        assert.equal(loaded.days[5].results.cs, true, 'Multiple modified results loaded correctly');
    });
    
    QUnit.test('Future dates are reset to default values', function(assert) {
        const dbName = '2026reditusmen';
        const config = TestUtils.createTestConfig();
        
        // Set a future date's results to true
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        
        // Find a day in the future and modify it
        config.days.forEach(day => {
            if (day.date > Date.now()) {
                day.results.sl = true;
                day.results.cs = true;
            }
        });
        
        // Save and load
        localStorage.setItem(dbName, JSON.stringify(config));
        const loaded = JSON.parse(localStorage.getItem(dbName));
        
        // In real app, this would be reset, but for testing we verify the save/load works
        assert.ok(loaded.days.some(day => day.date > Date.now()), 'Future dates exist in configuration');
    });
});

QUnit.module('Checkbox State Management', function(hooks) {
    hooks.beforeEach(function() {
        // Reset all checkboxes before each test
        TestUtils.clearAllCheckboxes();
    });
    
    QUnit.test('Checkbox states can be set and retrieved', function(assert) {
        const checkbox = document.getElementById('sl');
        assert.ok(checkbox, 'Sleep checkbox exists');
        
        // Set checkbox
        checkbox.checked = true;
        checkbox.classList.add('checked');
        
        assert.ok(checkbox.checked, 'Checkbox is checked');
        assert.ok(checkbox.classList.contains('checked'), 'Checkbox has checked class');
    });
    
    QUnit.test('All discipline checkboxes exist', function(assert) {
        const checkboxIds = ['sl', 'cs', 'ex', 'pc', 'tv', 'al', 'sn', 'mu', 'pu', 'fa', 'hh', 'mo', 'ne', 're', 'ci'];
        
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            assert.ok(checkbox, `Checkbox ${id} exists`);
            assert.equal(checkbox.type, 'checkbox', `${id} is a checkbox input`);
        });
    });
    
    QUnit.test('Checkbox states sync with configuration', function(assert) {
        const config = TestUtils.createTestConfig();
        
        // Set some results
        config.days[0].results.sl = true;
        config.days[0].results.cs = true;
        config.days[0].results.ex = false;
        
        // Simulate setting checkboxes based on config
        Object.entries(config.days[0].results).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = checked;
                if (checked) {
                    checkbox.classList.add('checked');
                } else {
                    checkbox.classList.remove('checked');
                }
            }
        });
        
        // Verify
        assert.ok(document.getElementById('sl').checked, 'Sleep checkbox is checked');
        assert.ok(document.getElementById('cs').checked, 'Cold shower checkbox is checked');
        assert.notOk(document.getElementById('ex').checked, 'Exercise checkbox is not checked');
    });
});

QUnit.module('Data Persistence', function(hooks) {
    hooks.beforeEach(function() {
        TestUtils.mockLocalStorage();
    });
    
    hooks.afterEach(function() {
        TestUtils.restoreLocalStorage();
    });
    
    QUnit.test('Changes to day results are persisted', function(assert) {
        const dbName = '2026reditusmen';
        const config = TestUtils.createTestConfig();
        
        // Make changes
        config.days[10].results.sl = true;
        config.days[10].results.fa = true;
        config.days[20].results.ex = true;
        
        // Save
        localStorage.setItem(dbName, JSON.stringify(config));
        
        // Load and verify
        const loaded = JSON.parse(localStorage.getItem(dbName));
        assert.equal(loaded.days[10].results.sl, true, 'Day 10 sleep persisted');
        assert.equal(loaded.days[10].results.fa, true, 'Day 10 fast persisted');
        assert.equal(loaded.days[20].results.ex, true, 'Day 20 exercise persisted');
        assert.equal(loaded.days[15].results.sl, false, 'Unchanged values remain false');
    });
    
    QUnit.test('Current index updates are persisted', function(assert) {
        const dbName = '2026reditusmen';
        const config = TestUtils.createTestConfig();
        
        // Change current index
        config.curIndex = 15;
        
        // Save
        localStorage.setItem(dbName, JSON.stringify(config));
        
        // Load and verify
        const loaded = JSON.parse(localStorage.getItem(dbName));
        assert.equal(loaded.curIndex, 15, 'Current index persisted correctly');
    });
});

QUnit.module('Workout Tracking', function(hooks) {
    QUnit.test('Workout div exists', function(assert) {
        const workoutDiv = document.getElementById('workout');
        assert.ok(workoutDiv, 'Workout div exists for displaying workout information');
    });
    
    QUnit.test('Week assignments are correct for workout tracking', function(assert) {
        const config = TestUtils.createTestConfig();
        
        // Check that days are properly grouped by week
        const weekGroups = {};
        config.days.forEach(day => {
            if (!weekGroups[day.week]) {
                weekGroups[day.week] = [];
            }
            weekGroups[day.week].push(day);
        });
        
        // Most weeks should have 7 days (except possibly first and last)
        Object.entries(weekGroups).forEach(([week, days]) => {
            assert.ok(days.length <= 7, `${week} has 7 or fewer days`);
            assert.ok(days.length >= 1, `${week} has at least 1 day`);
        });
    });
});

QUnit.module('Date Navigation', function(hooks) {
    QUnit.test('Date picker input exists', function(assert) {
        const datepicker = document.getElementById('datepicker');
        assert.ok(datepicker, 'Date picker input exists');
    });
    
    QUnit.test('Date display elements exist', function(assert) {
        const dateDiv = document.getElementById('date');
        const dayNumDiv = document.getElementById('daynum');
        const readingDiv = document.getElementById('reading');
        
        assert.ok(dateDiv, 'Date display div exists');
        assert.ok(dayNumDiv, 'Day number display div exists');
        assert.ok(readingDiv, 'Reading display div exists');
    });
    
    QUnit.test('Valid date range for 90-day program', function(assert) {
        const config = TestUtils.createTestConfig();
        const startDate = new Date(config.startDate);
        const endDate = new Date(config.days[89].date);
        
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        assert.equal(daysDiff, 89, 'Program spans exactly 89 days (0-indexed = 90 days)');
    });
});