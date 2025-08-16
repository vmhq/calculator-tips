document.addEventListener('DOMContentLoaded', () => {
    // Common elements
    const showTipCalculatorBtn = document.getElementById('showTipCalculator');
    const showBillSplitterBtn = document.getElementById('showBillSplitter');
    const tipCalculatorSection = document.getElementById('tipCalculator');
    const billSplitterSection = document.getElementById('billSplitter');

    // Tip Calculator elements
    const billAmountInput = document.getElementById('billAmount');
    const tipButtons = document.querySelectorAll('.tip-btn');
    const customTipInput = document.getElementById('customTip');
    const tipAmountResult = document.getElementById('tipAmountResult');
    const totalAmountResult = document.getElementById('totalAmountResult');

    // Bill Splitter elements
    const totalBillInput = document.getElementById('totalBill');
    const tipPercentageSplitInput = document.getElementById('tipPercentageSplit');
    const peopleCountInput = document.getElementById('peopleCount');
    const includeTipCheckbox = document.getElementById('includeTip');
    const totalTipResultSplit = document.getElementById('totalTipResultSplit');
    const totalPerPersonResult = document.getElementById('totalPerPersonResult');

    let activeTipBtn = null;

    function formatCurrency(value) {
        return `$${value.toFixed(2)}`;
    }

    // --- Navigation ---
    function showTipCalculator() {
        tipCalculatorSection.classList.remove('hidden');
        billSplitterSection.classList.add('hidden');
        showTipCalculatorBtn.classList.add('active');
        showBillSplitterBtn.classList.remove('active');
    }

    function showBillSplitter() {
        tipCalculatorSection.classList.add('hidden');
        billSplitterSection.classList.remove('hidden');
        showTipCalculatorBtn.classList.remove('active');
        showBillSplitterBtn.classList.add('active');
    }

    showTipCalculatorBtn.addEventListener('click', showTipCalculator);
    showBillSplitterBtn.addEventListener('click', showBillSplitter);
    showTipCalculator(); // Show tip calculator by default

    // --- Tip Calculator Logic ---
    function calculateTip() {
        const billAmount = parseFloat(billAmountInput.value) || 0;
        let tipPercentage = parseFloat(customTipInput.value) || 0;

        if (activeTipBtn) {
            tipPercentage = parseFloat(activeTipBtn.dataset.tip);
            customTipInput.value = '';
        }

        if (billAmount < 0) return;

        const tipAmount = billAmount * (tipPercentage / 100);
        const totalAmount = billAmount + tipAmount;

        tipAmountResult.textContent = formatCurrency(tipAmount);
        totalAmountResult.textContent = formatCurrency(totalAmount);
    }

    billAmountInput.addEventListener('input', calculateTip);
    customTipInput.addEventListener('input', () => {
        if (activeTipBtn) {
            activeTipBtn.classList.remove('active');
            activeTipBtn = null;
        }
        calculateTip();
    });

    tipButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (activeTipBtn) {
                activeTipBtn.classList.remove('active');
            }
            button.classList.add('active');
            activeTipBtn = button;
            calculateTip();
        });
    });

    // --- Bill Splitter Logic ---
    function calculateBillSplit() {
        const totalBill = parseFloat(totalBillInput.value) || 0;
        const tipPercentage = parseFloat(tipPercentageSplitInput.value) || 0;
        const peopleCount = parseInt(peopleCountInput.value) || 1;
        const includeTip = includeTipCheckbox.checked;

        if (totalBill < 0 || peopleCount < 1) return;

        const totalTip = totalBill * (tipPercentage / 100);
        let totalWithTip = totalBill + totalTip;
        let amountPerPerson;

        if (includeTip) {
            amountPerPerson = totalWithTip / peopleCount;
        } else {
            amountPerPerson = totalBill / peopleCount;
        }

        totalTipResultSplit.textContent = formatCurrency(totalTip);
        totalPerPersonResult.textContent = formatCurrency(amountPerPerson);
    }

    totalBillInput.addEventListener('input', calculateBillSplit);
    tipPercentageSplitInput.addEventListener('input', calculateBillSplit);
    peopleCountInput.addEventListener('input', calculateBillSplit);
    includeTipCheckbox.addEventListener('change', calculateBillSplit);

    // Initial calculations
    calculateTip();
    calculateBillSplit();
});
