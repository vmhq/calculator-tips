document.addEventListener('DOMContentLoaded', () => {
    // Common elements
    const showTipCalculatorBtn = document.getElementById('showTipCalculator');
    const showBillSplitterBtn = document.getElementById('showBillSplitter');
    const showDiscountCalculatorBtn = document.getElementById('showDiscountCalculator');
    const tipCalculatorSection = document.getElementById('tipCalculator');
    const billSplitterSection = document.getElementById('billSplitter');
    const discountCalculatorSection = document.getElementById('discountCalculator');

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

    // Discount Calculator elements
    const originalPriceInput = document.getElementById('originalPrice');
    const discountPercentageInput = document.getElementById('discountPercentage');
    const amountSavedResult = document.getElementById('amountSavedResult');
    const finalPriceResult = document.getElementById('finalPriceResult');

    let activeTipBtn = null;
    let currentLanguage = 'es';
    let currentCurrency = 'CLP';

    const translations = {
        es: {
            appTitle: "Calculator Hub",
            tip_calculator: "Calculadora de Propina",
            bill_splitter: "Divisor de Cuentas",
            discount_calculator: "Calculadora de Descuentos",
            bill_amount: "Monto de la Cuenta",
            select_tip: "Seleccionar Propina %",
            tip_amount: "Monto de la Propina",
            total: "Total",
            total_bill: "Cuenta Total",
            tip_percentage: "Propina %",
            number_of_people: "Número de Personas",
            include_tip: "Incluir propina en la división",
            total_tip: "Propina Total",
            total_per_person: "Total por Persona",
            original_price: "Precio Original",
            discount_percentage: "Descuento (%)",
            amount_saved: "Monto Ahorrado",
            final_price: "Precio Final"
        },
        en: {
            appTitle: "Calculator Hub",
            tip_calculator: "Tip Calculator",
            bill_splitter: "Bill Splitter",
            discount_calculator: "Discount Calculator",
            bill_amount: "Bill Amount",
            select_tip: "Select Tip %",
            tip_amount: "Tip Amount",
            total: "Total",
            total_bill: "Total Bill",
            tip_percentage: "Tip %",
            number_of_people: "Number of People",
            include_tip: "Include tip in split",
            total_tip: "Total Tip",
            total_per_person: "Total per person",
            original_price: "Original Price",
            discount_percentage: "Discount (%)",
            amount_saved: "Amount Saved",
            final_price: "Final Price"
        }
    };

    function updateLanguage() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });
        document.getElementById('appTitle').textContent = translations[currentLanguage].appTitle;
        // Recalculate all values to update currency format
        calculateTip();
        calculateBillSplit();
        calculateDiscount();
    }

    const languageSelector = document.getElementById('languageSelector');
    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
    });

    const currencySelector = document.getElementById('currencySelector');
    currencySelector.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        // Recalculate all values to update currency format
        calculateTip();
        calculateBillSplit();
        calculateDiscount();
    });

    function formatCurrency(value) {
        if (currentCurrency === 'USD') {
            return `$${value.toFixed(2)}`;
        } else { // CLP
            return `$${Math.round(value).toLocaleString('es-CL')}`;
        }
    }

    // --- Input Validation ---
    function validateDecimalInput(event) {
        const input = event.target;
        let value = input.value;
        
        // Allow only numbers and a single decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point is present
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        input.value = value;
    }

    billAmountInput.addEventListener('input', validateDecimalInput);
    totalBillInput.addEventListener('input', validateDecimalInput);
    originalPriceInput.addEventListener('input', validateDecimalInput);

    // --- Navigation ---
    function showTipCalculator() {
        tipCalculatorSection.classList.remove('hidden');
        billSplitterSection.classList.add('hidden');
        discountCalculatorSection.classList.add('hidden');
        showTipCalculatorBtn.classList.add('active');
        showBillSplitterBtn.classList.remove('active');
        showDiscountCalculatorBtn.classList.remove('active');
    }

    function showBillSplitter() {
        tipCalculatorSection.classList.add('hidden');
        billSplitterSection.classList.remove('hidden');
        discountCalculatorSection.classList.add('hidden');
        showTipCalculatorBtn.classList.remove('active');
        showBillSplitterBtn.classList.add('active');
        showDiscountCalculatorBtn.classList.remove('active');
    }

    function showDiscountCalculator() {
        tipCalculatorSection.classList.add('hidden');
        billSplitterSection.classList.add('hidden');
        discountCalculatorSection.classList.remove('hidden');
        showTipCalculatorBtn.classList.remove('active');
        showBillSplitterBtn.classList.remove('active');
        showDiscountCalculatorBtn.classList.add('active');
    }

    showTipCalculatorBtn.addEventListener('click', showTipCalculator);
    showBillSplitterBtn.addEventListener('click', showBillSplitter);
    showDiscountCalculatorBtn.addEventListener('click', showDiscountCalculator);
    showTipCalculator(); // Show tip calculator by default
    updateLanguage(); // Set initial language

    // --- Tip Calculator Logic ---
    function calculateTip() {
        const billAmount = parseFloat(billAmountInput.value) || 0;
        let tipPercentage = parseFloat(customTipInput.value) || 0;

        if (activeTipBtn) {
            tipPercentage = parseFloat(activeTipBtn.dataset.tip);
        }

        if (billAmount < 0) {
            tipAmountResult.textContent = formatCurrency(0);
            totalAmountResult.textContent = formatCurrency(0);
            return;
        }

        const billInCents = Math.round(billAmount * 100);
        const tipAmountInCents = Math.round(billInCents * (tipPercentage / 100));
        const totalAmountInCents = billInCents + tipAmountInCents;

        tipAmountResult.textContent = formatCurrency(tipAmountInCents / 100);
        totalAmountResult.textContent = formatCurrency(totalAmountInCents / 100);
    }

    billAmountInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        calculateTip();
    });

    customTipInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        if (activeTipBtn) {
            activeTipBtn.classList.remove('active');
            activeTipBtn = null;
        }
        calculateTip();
    });

    tipButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            tipButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeTipBtn = e.target;
            customTipInput.value = '';
            calculateTip();
        });
    });

    // --- Bill Splitter Logic ---
    function calculateBillSplit() {
        const totalBill = parseFloat(totalBillInput.value) || 0;
        const tipPercentage = parseFloat(tipPercentageSplitInput.value) || 0;
        const peopleCount = parseInt(peopleCountInput.value) || 1;
        const includeTip = includeTipCheckbox.checked;

        if (totalBill < 0 || peopleCount < 1) {
            totalTipResultSplit.textContent = formatCurrency(0);
            totalPerPersonResult.textContent = formatCurrency(0);
            return;
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

        totalTipResultSplit.textContent = formatCurrency(totalTipInCents / 100);
        totalPerPersonResult.textContent = formatCurrency(amountPerPersonInCents / 100);
    }

    totalBillInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        calculateBillSplit();
    });

    tipPercentageSplitInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        calculateBillSplit();
    });

    peopleCountInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        calculateBillSplit();
    });
    includeTipCheckbox.addEventListener('change', calculateBillSplit);

    // --- Discount Calculator Logic ---
    function calculateDiscount() {
        const originalPrice = parseFloat(originalPriceInput.value) || 0;
        const discountPercentage = parseFloat(discountPercentageInput.value) || 0;

        if (originalPrice < 0) {
            amountSavedResult.textContent = formatCurrency(0);
            finalPriceResult.textContent = formatCurrency(0);
            return;
        }

        const originalPriceInCents = Math.round(originalPrice * 100);
        const amountSavedInCents = Math.round(originalPriceInCents * (discountPercentage / 100));
        const finalPriceInCents = originalPriceInCents - amountSavedInCents;

        amountSavedResult.textContent = formatCurrency(amountSavedInCents / 100);
        finalPriceResult.textContent = formatCurrency(finalPriceInCents / 100);
    }

    originalPriceInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        calculateDiscount();
    });

    discountPercentageInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        calculateDiscount();
    });


    // --- Theme Switcher Logic ---
    const themeSwitcher = document.getElementById('themeSwitcher');
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeSwitcher.textContent = '🌙';
        } else {
            themeSwitcher.textContent = '☀️';
        }
    });

    // Initial calculations
    calculateTip();
    calculateBillSplit();
    calculateDiscount();
});
