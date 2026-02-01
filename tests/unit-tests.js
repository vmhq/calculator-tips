/**
 * Unit Tests for Calculator Hub
 * Simple test framework - can run in browser or Node.js
 */

// Test framework
const tests = [];
const results = {
    passed: 0,
    failed: 0,
    total: 0
};

function test(description, fn) {
    tests.push({ description, fn });
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

function assertTrue(value, message) {
    if (!value) {
        throw new Error(message || 'Expected true but got false');
    }
}

function assertFalse(value, message) {
    if (value) {
        throw new Error(message || 'Expected false but got true');
    }
}

function runTests() {
    console.log('🧪 Running Calculator Hub Tests...\n');

    tests.forEach(({ description, fn }) => {
        results.total++;
        try {
            fn();
            results.passed++;
            console.log(`✅ ${description}`);
        } catch (error) {
            results.failed++;
            console.log(`❌ ${description}`);
            console.log(`   Error: ${error.message}\n`);
        }
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Tests: ${results.passed} passed, ${results.failed} failed, ${results.total} total`);
    console.log('='.repeat(50));

    return results.failed === 0;
}

// ==================== UTILITY FUNCTION TESTS ====================

test('formatCurrency - USD format', () => {
    const result = formatCurrencyTest(100.5, 'USD');
    assertEquals(result, '$100.50', 'USD should format with 2 decimals');
});

test('formatCurrency - EUR format', () => {
    const result = formatCurrencyTest(100.5, 'EUR');
    assertEquals(result, '€100.50', 'EUR should format with 2 decimals');
});

test('formatCurrency - CLP format', () => {
    const result = formatCurrencyTest(1000.99, 'CLP');
    assertTrue(result.includes('1'), 'CLP should round to nearest integer');
});

test('debounce - delays function execution', (done) => {
    let called = false;
    const fn = debounceTest(() => { called = true; }, 100);
    fn();
    assertFalse(called, 'Function should not be called immediately');
});

test('isValidRange - validates range correctly', () => {
    assertTrue(isValidRangeTest(50, 0, 100), '50 should be in range 0-100');
    assertFalse(isValidRangeTest(150, 0, 100), '150 should not be in range 0-100');
    assertFalse(isValidRangeTest(-10, 0, 100), '-10 should not be in range 0-100');
});

test('applySmartRounding - rounds to .00 or .50', () => {
    assertEquals(applySmartRoundingTest(10.3, true), 10.5, 'Should round 10.3 to 10.5');
    assertEquals(applySmartRoundingTest(10.7, true), 11.0, 'Should round 10.7 to 11.0');
    assertEquals(applySmartRoundingTest(10.3, false), 10.3, 'Should not round when disabled');
});

// ==================== TIP CALCULATOR TESTS ====================

test('calculateTip - 15% tip calculation', () => {
    const result = calculateTipTest(100, 15);
    assertEquals(result.tipAmount, 15, 'Tip should be 15');
    assertEquals(result.total, 115, 'Total should be 115');
});

test('calculateTip - handles zero bill amount', () => {
    const result = calculateTipTest(0, 15);
    assertEquals(result.tipAmount, 0, 'Tip should be 0');
    assertEquals(result.total, 0, 'Total should be 0');
});

test('calculateTip - handles negative values', () => {
    const result = calculateTipTest(-100, 15);
    assertEquals(result.tipAmount, 0, 'Tip should be 0 for negative amount');
    assertEquals(result.total, 0, 'Total should be 0 for negative amount');
});

test('calculateTip - large percentage', () => {
    const result = calculateTipTest(100, 200);
    assertEquals(result.tipAmount, 200, 'Should allow large tip percentages');
});

// ==================== BILL SPLITTER TESTS ====================

test('calculateBillSplit - even split', () => {
    const result = calculateBillSplitTest(100, 15, 4, true);
    assertEquals(result.totalTip, 15, 'Total tip should be 15');
    assertEquals(result.perPerson, 28.75, 'Per person should be 28.75');
});

test('calculateBillSplit - without tip in split', () => {
    const result = calculateBillSplitTest(100, 15, 4, false);
    assertEquals(result.totalTip, 15, 'Total tip should be 15');
    assertEquals(result.perPerson, 25, 'Per person should be 25');
});

test('calculateBillSplit - single person', () => {
    const result = calculateBillSplitTest(100, 15, 1, true);
    assertEquals(result.perPerson, 115, 'Single person pays full amount plus tip');
});

test('calculateBillSplit - handles zero people', () => {
    const result = calculateBillSplitTest(100, 15, 0, true);
    assertEquals(result.perPerson, 0, 'Should return 0 for invalid people count');
});

// ==================== DISCOUNT CALCULATOR TESTS ====================

test('calculateDiscount - 10% discount', () => {
    const result = calculateDiscountTest(100, 10);
    assertEquals(result.saved, 10, 'Saved amount should be 10');
    assertEquals(result.finalPrice, 90, 'Final price should be 90');
});

test('calculateDiscount - 50% discount', () => {
    const result = calculateDiscountTest(200, 50);
    assertEquals(result.saved, 100, 'Saved amount should be 100');
    assertEquals(result.finalPrice, 100, 'Final price should be 100');
});

test('calculateDiscount - 100% discount', () => {
    const result = calculateDiscountTest(100, 100);
    assertEquals(result.saved, 100, 'Saved amount should be 100');
    assertEquals(result.finalPrice, 0, 'Final price should be 0');
});

test('calculateDiscount - handles zero price', () => {
    const result = calculateDiscountTest(0, 50);
    assertEquals(result.saved, 0, 'Saved should be 0');
    assertEquals(result.finalPrice, 0, 'Final price should be 0');
});

// ==================== TEST HELPER FUNCTIONS ====================
// These are simplified versions of the actual functions for testing

function formatCurrencyTest(value, currency) {
    const CURRENCIES = {
        USD: { symbol: '$', decimals: 2 },
        EUR: { symbol: '€', decimals: 2 },
        CLP: { symbol: '$', decimals: 0 }
    };
    const curr = CURRENCIES[currency];
    if (curr.decimals === 0) {
        return `${curr.symbol}${Math.round(value).toLocaleString()}`;
    }
    return `${curr.symbol}${value.toFixed(curr.decimals)}`;
}

function debounceTest(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function isValidRangeTest(value, min, max) {
    return value >= min && value <= max;
}

function applySmartRoundingTest(value, enabled) {
    if (!enabled) return value;
    return Math.ceil(value * 2) / 2;
}

function calculateTipTest(billAmount, tipPercentage) {
    if (billAmount < 0) {
        return { tipAmount: 0, total: 0 };
    }
    const billInCents = Math.round(billAmount * 100);
    const tipAmountInCents = Math.round(billInCents * (tipPercentage / 100));
    const totalAmountInCents = billInCents + tipAmountInCents;
    return {
        tipAmount: tipAmountInCents / 100,
        total: totalAmountInCents / 100
    };
}

function calculateBillSplitTest(totalBill, tipPercentage, peopleCount, includeTip) {
    if (totalBill < 0 || peopleCount < 1) {
        return { totalTip: 0, perPerson: 0 };
    }
    const totalBillInCents = Math.round(totalBill * 100);
    const totalTipInCents = Math.round(totalBillInCents * (tipPercentage / 100));

    let amountPerPersonInCents;
    if (includeTip) {
        const totalWithTipInCents = totalBillInCents + totalTipInCents;
        amountPerPersonInCents = totalWithTipInCents / peopleCount;
    } else {
        amountPerPersonInCents = totalBillInCents / peopleCount;
    }

    return {
        totalTip: totalTipInCents / 100,
        perPerson: amountPerPersonInCents / 100
    };
}

function calculateDiscountTest(originalPrice, discountPercentage) {
    if (originalPrice < 0) {
        return { saved: 0, finalPrice: 0 };
    }
    const originalPriceInCents = Math.round(originalPrice * 100);
    const amountSavedInCents = Math.round(originalPriceInCents * (discountPercentage / 100));
    const finalPriceInCents = originalPriceInCents - amountSavedInCents;

    return {
        saved: amountSavedInCents / 100,
        finalPrice: finalPriceInCents / 100
    };
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests };
    // Auto-run if executed directly
    if (require.main === module) {
        const success = runTests();
        process.exit(success ? 0 : 1);
    }
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
    window.runTests = runTests;
    console.log('Tests loaded. Run window.runTests() to execute.');
}
