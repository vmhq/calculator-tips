/**
 * To run this test:
 * 1. Open the index.html file in a web browser.
 * 2. Open the browser's developer console.
 * 3. Copy and paste the content of this file into the console and press Enter.
 * 4. The test function `runValidationTest()` will be executed.
 * 5. Observe the console output for the test result.
 *
 * This test checks the validation logic for the 'Bill Amount' input field.
 * It simulates a user typing "12.3.4" into the field.
 *
 * The expected (but incorrect) behavior before the fix is that the input's value
 * will be truncated to "12.3". The test will pass if this happens.
 *
 * After the fix, the validation should correctly change the value to "12.34",
 * and therefore this test will fail, indicating the bug has been resolved.
 */
function runValidationTest() {
    console.log("--- Running Bug Reproduction Test ---");

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

    // 5. Assert the incorrect behavior
    const expectedValueBeforeFix = "12.3";
    console.assert(
        finalValue === expectedValueBeforeFix,
        `Assertion Failed: Expected value to be "${expectedValueBeforeFix}", but it was "${finalValue}".`
    );

    if (finalValue === expectedValueBeforeFix) {
        console.log(`%cTest Passed (Bug Reproduced): Input was correctly truncated to "${expectedValueBeforeFix}".`, "color: green;");
    } else {
        console.error(`%cTest Failed (Bug Not Reproduced as Expected): The value was not the expected "${expectedValueBeforeFix}". This might mean the bug is already fixed or the test is flawed.`, "color: red;");
    }
    console.log("--- Test Complete ---");
}

// Automatically run the test
runValidationTest();
