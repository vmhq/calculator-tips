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
            final_price: "Precio Final",
            system_theme: "Sistema",
            light_theme: "Claro",
            dark_theme: "Oscuro"
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
            final_price: "Final Price",
            system_theme: "System",
            light_theme: "Light",
            dark_theme: "Dark"
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
        } else if (currentCurrency === 'EUR') {
            return `€${value.toFixed(2)}`;
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
        validateDecimalInput(e);
        calculateTip();
    });

    customTipInput.addEventListener('input', (e) => {
        validateDecimalInput(e);
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
        validateDecimalInput(e);
        calculateBillSplit();
    });

    tipPercentageSplitInput.addEventListener('input', (e) => {
        validateDecimalInput(e);
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
        validateDecimalInput(e);
        calculateDiscount();
    });

    discountPercentageInput.addEventListener('input', (e) => {
        validateDecimalInput(e);
        calculateDiscount();
    });


    // --- Theme Switcher Logic ---
    const themeSelector = document.getElementById('themeSelector');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    function handleSystemThemeChange(e) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        // If the selector is on 'system', we update the theme, but not the selector itself
        if (themeSelector.value === 'system') {
            localStorage.removeItem('theme');
        }
    }

    const systemThemeWatcher = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeWatcher.addEventListener('change', handleSystemThemeChange);

    themeSelector.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        localStorage.setItem('theme', selectedTheme);
        if (selectedTheme === 'system') {
            applyTheme(systemThemeWatcher.matches ? 'dark' : 'light');
        } else {
            applyTheme(selectedTheme);
        }
    });

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            themeSelector.value = savedTheme;
            if (savedTheme === 'system') {
                applyTheme(systemThemeWatcher.matches ? 'dark' : 'light');
            } else {
                applyTheme(savedTheme);
            }
        } else {
            // No theme saved, use system setting
            themeSelector.value = 'system';
            applyTheme(systemThemeWatcher.matches ? 'dark' : 'light');
        }
    }

    initializeTheme();

    // Initial calculations
    calculateTip();
    calculateBillSplit();
    calculateDiscount();
});
