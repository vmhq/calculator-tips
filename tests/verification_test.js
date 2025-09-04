/**
 * To run this test:
 * 1. Open the index.html file in a web browser.
 * 2. Open the browser's developer console.
 * 3. Copy and paste the content of this file into the console and press Enter.
 * 4. The test function `runVerificationTest()` will be executed.
 * 5. Observe the console output for the test result.
 *
 * This test verifies that the input validation logic has been fixed.
 * It simulates a user typing "12.3.4" into the 'Bill Amount' field.
 *
 * The expected behavior after the fix is that the input's value
 * will be correctly converted to "12.34". The test will pass if this happens.
 */
function runVerificationTest() {
    console.log("--- Running Bug Verification Test ---");

    // 1. Get the input element to test
    const billAmountInput = document.getElementById('billAmount');
    if (!billAmountInput) {
        console.error("Test failed: Could not find the 'billAmount' input element.");
        return;
    }

    // 2. Set a value with multiple decimal points
    billAmountInput.value = "12.3.4";
    console.log(`Set input value to: "${billAmountInput.value}"`);

    // 3. Dispatch an 'input' event to trigger the validation logic
    const inputEvent = new Event('input', { bubbles: true });
    billAmountInput.dispatchEvent(inputEvent);
    console.log("Dispatched 'input' event.");

    // 4. Check the resulting value
    const finalValue = billAmountInput.value;
    console.log(`Final input value is: "${finalValue}"`);

    // 5. Assert the correct behavior
    const expectedValueAfterFix = "12.34";
    console.assert(
        finalValue === expectedValueAfterFix,
        `Assertion Failed: Expected value to be "${expectedValueAfterFix}", but it was "${finalValue}".`
    );

    if (finalValue === expectedValueAfterFix) {
        console.log(`%cTest Passed (Bug Verified as Fixed): Input was correctly converted to "${expectedValueAfterFix}".`, "color: green;");
    } else {
        console.error(`%cTest Failed (Bug Still Present): The value was not the expected "${expectedValueAfterFix}".`, "color: red;");
    }
    console.log("--- Test Complete ---");
}

// Automatically run the test
runVerificationTest();
