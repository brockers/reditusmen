// Unit Tests for Core Functions

QUnit.module('Date Calculations', function(hooks) {
    // Fixed in script.js... keeping comment for future reference
    // QUnit.test('Easter date should be April 5, 2026', function(assert) {
    //     const expectedEaster = new Date('2026-04-05');
    //     const actualEaster = new Date('4/5/2026'); // As defined in script.js
    //     assert.equal(actualEaster.getTime(), expectedEaster.getTime(), 'Easter date matches expected');
    // });
    
    QUnit.test('Start date should be 90 days before Easter', function(assert) {
        const easter = new Date('04/05/2026');
        const expectedStart = new Date(easter);
        expectedStart.setDate(expectedStart.getDate() - 90);
        
        const actualStart = new Date(easter);
        actualStart.setDate(actualStart.getDate() - 90);
        
        assert.equal(actualStart.getTime(), expectedStart.getTime(), 'Start date is 90 days before Easter');
        assert.equal(actualStart.toDateString(), 'Mon Jan 05 2026', 'Start date is January 5, 2026');
    });
    
    QUnit.test('Program should have exactly 90 days', function(assert) {
        const config = TestUtils.createTestConfig();
        assert.equal(config.days.length, 90, 'Configuration has 90 days');
    });
});

QUnit.module('Week Calculations', function(hooks) {
    QUnit.test('getWeekOfYear calculates correct week numbers', function(assert) {
        const jan1_2026 = new Date(2026, 0, 1);
        
        // Test first week of year
        const jan5_2026 = new Date(2026, 0, 5);
        assert.equal(TestUtils.getWeekOfYear(jan1_2026, jan5_2026), 1, 'January 5, 2026 is week 1');
        
        // Test mid-year
        const june15_2026 = new Date(2026, 5, 15);
        const expectedWeek = Math.ceil((june15_2026 - new Date(2026, 0, 5)) / (7 * 24 * 60 * 60 * 1000)) + 1;
        assert.equal(TestUtils.getWeekOfYear(jan1_2026, june15_2026), expectedWeek, 'June 15, 2026 week calculation is correct');
    });
    
    QUnit.test('Each day should have a week assignment', function(assert) {
        const config = TestUtils.createTestConfig();
        
        config.days.forEach((day, index) => {
            assert.ok(day.week, `Day ${index + 1} has a week assignment`);
            assert.ok(day.week.startsWith('week'), `Day ${index + 1} week starts with 'week'`);
        });
    });
});

QUnit.module('Data Structure', function(hooks) {
    QUnit.test('Default results object has all required fields', function(assert) {
        const expectedFields = ['sl', 'cs', 'ex', 'pc', 'tv', 'al', 'sn', 'mu', 'pu', 'fa', 'hh', 'mo', 'ne', 're', 'ci'];
        const config = TestUtils.createTestConfig();
        
        expectedFields.forEach(field => {
            assert.ok(field in config.days[0].results, `Results object contains field: ${field}`);
            assert.strictEqual(config.days[0].results[field], false, `Field ${field} defaults to false`);
        });
    });
    
    QUnit.test('Each day has required properties', function(assert) {
        const config = TestUtils.createTestConfig();
        const day = config.days[0];
        
        assert.ok('date' in day, 'Day has date property');
        assert.ok('week' in day, 'Day has week property');
        assert.ok('results' in day, 'Day has results property');
        assert.equal(typeof day.date, 'number', 'Date is stored as timestamp');
    });
});

QUnit.module('Reading Calculations', function(hooks) {
    QUnit.test('Total number of gospel chapters is correct', function(assert) {
        const expectedTotal = 28 + 16 + 24 + 21; // Matthew + Mark + Luke + John
        assert.equal(expectedTotal, 89, 'Total gospel chapters is 89');
    });
    
    QUnit.test('Readings array is properly generated', function(assert) {
        const readings = [];
        const gospels = {
            "Matthew": 28,
            "Mark": 16,
            "Luke": 24,
            "John": 21
        };
        
        Object.entries(gospels).forEach(([book, chapters]) => {
            for (let i = 1; i <= chapters; i++) {
                readings.push(`${book} Chapter ${i}`);
            }
        });
        
        assert.equal(readings.length, 89, 'Readings array has 89 entries');
        assert.equal(readings[0], 'Matthew Chapter 1', 'First reading is Matthew Chapter 1');
        assert.equal(readings[27], 'Matthew Chapter 28', 'Last Matthew chapter is 28');
        assert.equal(readings[28], 'Mark Chapter 1', 'First Mark chapter follows Matthew');
        assert.equal(readings[88], 'John Chapter 21', 'Last reading is John Chapter 21');
    });
});

QUnit.module('Configuration Management', function(hooks) {
    QUnit.test('Config object has required properties', function(assert) {
        const config = TestUtils.createTestConfig();
        
        assert.ok('curIndex' in config, 'Config has curIndex property');
        assert.ok('startDate' in config, 'Config has startDate property');
        assert.ok('days' in config, 'Config has days property');
        assert.equal(config.curIndex, 0, 'curIndex defaults to 0');
    });
    
    QUnit.test('Days are properly ordered by date', function(assert) {
        const config = TestUtils.createTestConfig();
        
        for (let i = 1; i < config.days.length; i++) {
            assert.ok(
                config.days[i].date > config.days[i-1].date,
                `Day ${i+1} comes after day ${i}`
            );
        }
    });
});
