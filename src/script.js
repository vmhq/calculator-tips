// ==================== CONFIGURATION ====================
const CONFIG = {
    DEFAULT_LANGUAGE: 'es',
    DEFAULT_CURRENCY: 'CLP',
    MAX_TIP_PERCENTAGE: 100,
    MAX_BILL_AMOUNT: 10000000,
    MIN_PEOPLE: 1,
    MAX_PEOPLE: 100,
    MAX_DISCOUNT: 100,
    DEBOUNCE_DELAY: 300,
    HISTORY_MAX_ITEMS: 5,
    TOAST_DURATION: 3000
};

const CURRENCIES = {
    USD: { symbol: '$', decimals: 2, locale: 'en-US', name: 'US Dollar' },
    EUR: { symbol: '€', decimals: 2, locale: 'de-DE', name: 'Euro' },
    CLP: { symbol: '$', decimals: 0, locale: 'es-CL', name: 'Chilean Peso' },
    MXN: { symbol: '$', decimals: 2, locale: 'es-MX', name: 'Mexican Peso' },
    GBP: { symbol: '£', decimals: 2, locale: 'en-GB', name: 'British Pound' },
    ARS: { symbol: '$', decimals: 2, locale: 'es-AR', name: 'Argentine Peso' }
};

/**
 * Main entry point for the application.
 * This function is executed when the DOM is fully loaded.
 * It sets up all the event listeners and initializes the application state.
 */
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
    let currentLanguage = CONFIG.DEFAULT_LANGUAGE;
    let currentCurrency = CONFIG.DEFAULT_CURRENCY;
    let smartRounding = false;

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
            dark_theme: "Oscuro",
            reset: "Limpiar",
            copy: "Copiar",
            share: "Compartir",
            copied: "¡Copiado!",
            shared: "¡Compartido!",
            error: "Error",
            invalid_input: "Entrada inválida",
            value_too_high: "Valor demasiado alto",
            value_too_low: "Valor demasiado bajo",
            smart_rounding: "Redondeo inteligente",
            history: "Historial",
            clear_history: "Limpiar historial"
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
            dark_theme: "Dark",
            reset: "Reset",
            copy: "Copy",
            share: "Share",
            copied: "Copied!",
            shared: "Shared!",
            error: "Error",
            invalid_input: "Invalid input",
            value_too_high: "Value too high",
            value_too_low: "Value too low",
            smart_rounding: "Smart rounding",
            history: "History",
            clear_history: "Clear history"
        }
    };

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Debounce function to limit the rate at which a function can fire.
     * @param {Function} func - The function to debounce
     * @param {number} wait - The delay in milliseconds
     * @returns {Function} The debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Shows a toast notification to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of toast (success, error, info)
     */
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    }

    /**
     * Validates if a value is within acceptable range
     * @param {number} value - The value to validate
     * @param {number} min - Minimum acceptable value
     * @param {number} max - Maximum acceptable value
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidRange(value, min, max) {
        return value >= min && value <= max;
    }

    /**
     * Applies smart rounding to a value (rounds to .00 or .50)
     * @param {number} value - The value to round
     * @returns {number} The rounded value
     */
    function applySmartRounding(value) {
        if (!smartRounding) return value;
        return Math.ceil(value * 2) / 2;
    }

    /**
     * Updates the UI text based on the selected language.
     * It iterates through all elements with a 'data-lang' attribute
     * and sets their text content to the corresponding translation.
     * Also recalculates all calculator values to apply new language formatting if needed.
     */
    function updateLanguage() {
        document.documentElement.lang = currentLanguage;
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[currentLanguage][key]) {
                if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = translations[currentLanguage][key];
                } else if (element.tagName === 'BUTTON' || element.tagName === 'OPTION') {
                    element.textContent = translations[currentLanguage][key];
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        });
        document.getElementById('appTitle').textContent = translations[currentLanguage].appTitle;
        // Recalculate all values to update currency format
        calculateTip();
        calculateBillSplit();
        calculateDiscount();
    }

    const languageSelector = document.getElementById('languageSelector');
    // Updates the application language and recalculates values when the language is changed.
    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
    });

    const currencySelector = document.getElementById('currencySelector');
    // Updates the application currency and recalculates values to apply the new format.
    currencySelector.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        // Recalculate all values to update currency format
        calculateTip();
        calculateBillSplit();
        calculateDiscount();
    });

    /**
     * Formats a numeric value into a currency string based on the selected currency.
     * @param {number} value - The numeric value to format.
     * @returns {string} The formatted currency string (e.g., "$1,234", "$12.34").
     */
    function formatCurrency(value) {
        const currency = CURRENCIES[currentCurrency];
        if (!currency) return `$${value.toFixed(2)}`;

        const roundedValue = applySmartRounding(value);
        const finalValue = currency.decimals === 0 ? Math.round(roundedValue) : roundedValue;

        if (currency.decimals === 0) {
            return `${currency.symbol}${finalValue.toLocaleString(currency.locale)}`;
        } else {
            return `${currency.symbol}${finalValue.toFixed(currency.decimals)}`;
        }
    }

    // --- Input Validation ---
    /**
     * Validates user input in a text field to allow only numbers and a single decimal point.
     * This function is typically used as an event handler for the 'input' event.
     * @param {Event} event - The input event object.
     * @param {number} max - Maximum allowed value (optional)
     */
    function validateDecimalInput(event, max = null) {
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

        // Validate range if max is specified
        if (max !== null && value !== '') {
            const numValue = parseFloat(value);
            if (numValue > max) {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
                showValidationError(input, translations[currentLanguage].value_too_high);
            } else if (numValue < 0) {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
                showValidationError(input, translations[currentLanguage].value_too_low);
            } else {
                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
                hideValidationError(input);
            }
        }
    }

    /**
     * Shows a validation error message below an input
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message to display
     */
    function showValidationError(input, message) {
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
    }

    /**
     * Hides the validation error message for an input
     * @param {HTMLElement} input - The input element
     */
    function hideValidationError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }

    // --- Navigation ---
    /**
     * Shows a specific calculator and hides the others (DRY implementation)
     * @param {string} calculatorId - The ID of the calculator to show
     */
    function showCalculator(calculatorId) {
        const calculators = {
            'tipCalculator': { section: tipCalculatorSection, button: showTipCalculatorBtn },
            'billSplitter': { section: billSplitterSection, button: showBillSplitterBtn },
            'discountCalculator': { section: discountCalculatorSection, button: showDiscountCalculatorBtn }
        };

        Object.keys(calculators).forEach(key => {
            const { section, button } = calculators[key];
            if (key === calculatorId) {
                section.classList.remove('hidden');
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                section.setAttribute('aria-hidden', 'false');
            } else {
                section.classList.add('hidden');
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
                section.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /**
     * Displays the Tip Calculator section and hides the others.
     */
    function showTipCalculator() {
        showCalculator('tipCalculator');
    }

    /**
     * Displays the Bill Splitter section and hides the others.
     */
    function showBillSplitter() {
        showCalculator('billSplitter');
    }

    /**
     * Displays the Discount Calculator section and hides the others.
     */
    function showDiscountCalculator() {
        showCalculator('discountCalculator');
    }

    showTipCalculatorBtn.addEventListener('click', showTipCalculator);
    showBillSplitterBtn.addEventListener('click', showBillSplitter);
    showDiscountCalculatorBtn.addEventListener('click', showDiscountCalculator);
    showTipCalculator(); // Show tip calculator by default
    updateLanguage(); // Set initial language

    // --- Tip Calculator Logic ---
    /**
     * Calculates the tip and total amount based on the bill amount and tip percentage.
     * It reads values from the input fields, performs the calculation,
     * and updates the result elements in the UI.
     * Handles both preset tip buttons and custom tip input.
     */
    function calculateTip() {
        const billAmount = parseFloat(billAmountInput.value) || 0;
        let tipPercentage = parseFloat(customTipInput.value) || 0;

        if (activeTipBtn) {
            tipPercentage = parseFloat(activeTipBtn.dataset.tip);
        }

        if (billAmount < 0 || billAmount > CONFIG.MAX_BILL_AMOUNT) {
            tipAmountResult.textContent = formatCurrency(0);
            totalAmountResult.textContent = formatCurrency(0);
            return;
        }

        if (tipPercentage > CONFIG.MAX_TIP_PERCENTAGE) {
            tipPercentage = CONFIG.MAX_TIP_PERCENTAGE;
        }

        const billInCents = Math.round(billAmount * 100);
        const tipAmountInCents = Math.round(billInCents * (tipPercentage / 100));
        const totalAmountInCents = billInCents + tipAmountInCents;

        const tipAmount = tipAmountInCents / 100;
        const totalAmount = totalAmountInCents / 100;

        tipAmountResult.textContent = formatCurrency(tipAmount);
        totalAmountResult.textContent = formatCurrency(totalAmount);

        // Trigger animation
        animateResult(tipAmountResult);
        animateResult(totalAmountResult);

        // Save to history
        if (billAmount > 0) {
            saveToHistory('tip', {
                billAmount,
                tipPercentage,
                tipAmount,
                totalAmount,
                currency: currentCurrency
            });
        }
    }

    const debouncedCalculateTip = debounce(calculateTip, CONFIG.DEBOUNCE_DELAY);

    // Validates and recalculates the tip whenever the bill amount changes.
    billAmountInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_BILL_AMOUNT);
        debouncedCalculateTip();
    });

    // Validates and recalculates the tip whenever the custom tip amount changes.
    customTipInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_TIP_PERCENTAGE);
        if (activeTipBtn) {
            activeTipBtn.classList.remove('active');
            activeTipBtn = null;
        }
        debouncedCalculateTip();
    });

    // Handles clicks on the preset tip percentage buttons.
    tipButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            tipButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeTipBtn = e.target;
            customTipInput.value = '';
            calculateTip();
        });

        // Keyboard navigation support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // --- Bill Splitter Logic ---
    /**
     * Calculates the total tip and the amount per person for a split bill.
     * It reads values from the input fields, considers whether to include the tip
     * in the split, and updates the result elements in the UI.
     */
    function calculateBillSplit() {
        const totalBill = parseFloat(totalBillInput.value) || 0;
        const tipPercentage = parseFloat(tipPercentageSplitInput.value) || 0;
        const peopleCount = parseInt(peopleCountInput.value) || 1;
        const includeTip = includeTipCheckbox.checked;

        if (totalBill < 0 || totalBill > CONFIG.MAX_BILL_AMOUNT ||
            peopleCount < CONFIG.MIN_PEOPLE || peopleCount > CONFIG.MAX_PEOPLE) {
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

        const totalTip = totalTipInCents / 100;
        const perPerson = amountPerPersonInCents / 100;

        totalTipResultSplit.textContent = formatCurrency(totalTip);
        totalPerPersonResult.textContent = formatCurrency(perPerson);

        // Trigger animation
        animateResult(totalTipResultSplit);
        animateResult(totalPerPersonResult);

        // Save to history
        if (totalBill > 0) {
            saveToHistory('split', {
                totalBill,
                tipPercentage,
                peopleCount,
                includeTip,
                totalTip,
                perPerson,
                currency: currentCurrency
            });
        }
    }

    const debouncedCalculateBillSplit = debounce(calculateBillSplit, CONFIG.DEBOUNCE_DELAY);

    // Validates and recalculates the bill split whenever the total bill amount changes.
    totalBillInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_BILL_AMOUNT);
        debouncedCalculateBillSplit();
    });

    // Validates and recalculates the bill split whenever the tip percentage changes.
    tipPercentageSplitInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_TIP_PERCENTAGE);
        debouncedCalculateBillSplit();
    });

    // Validates and recalculates the bill split whenever the number of people changes.
    peopleCountInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        const value = parseInt(e.target.value) || 0;
        if (value > CONFIG.MAX_PEOPLE) {
            e.target.value = CONFIG.MAX_PEOPLE;
        }
        debouncedCalculateBillSplit();
    });
    // Recalculates the bill split whenever the 'include tip' checkbox is changed.
    includeTipCheckbox.addEventListener('change', calculateBillSplit);

    // --- Discount Calculator Logic ---
    /**
     * Calculates the amount saved and the final price after a discount.
     * It reads the original price and discount percentage from input fields,
     * performs the calculation, and updates the result elements in the UI.
     */
    function calculateDiscount() {
        const originalPrice = parseFloat(originalPriceInput.value) || 0;
        const discountPercentage = parseFloat(discountPercentageInput.value) || 0;

        if (originalPrice < 0 || originalPrice > CONFIG.MAX_BILL_AMOUNT) {
            amountSavedResult.textContent = formatCurrency(0);
            finalPriceResult.textContent = formatCurrency(0);
            return;
        }

        if (discountPercentage > CONFIG.MAX_DISCOUNT) {
            discountPercentage = CONFIG.MAX_DISCOUNT;
        }

        const originalPriceInCents = Math.round(originalPrice * 100);
        const amountSavedInCents = Math.round(originalPriceInCents * (discountPercentage / 100));
        const finalPriceInCents = originalPriceInCents - amountSavedInCents;

        const saved = amountSavedInCents / 100;
        const finalPrice = finalPriceInCents / 100;

        amountSavedResult.textContent = formatCurrency(saved);
        finalPriceResult.textContent = formatCurrency(finalPrice);

        // Trigger animation
        animateResult(amountSavedResult);
        animateResult(finalPriceResult);

        // Save to history
        if (originalPrice > 0) {
            saveToHistory('discount', {
                originalPrice,
                discountPercentage,
                saved,
                finalPrice,
                currency: currentCurrency
            });
        }
    }

    const debouncedCalculateDiscount = debounce(calculateDiscount, CONFIG.DEBOUNCE_DELAY);

    // Validates and recalculates the discount whenever the original price changes.
    originalPriceInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_BILL_AMOUNT);
        debouncedCalculateDiscount();
    });

    // Validates and recalculates the discount whenever the discount percentage changes.
    discountPercentageInput.addEventListener('input', (e) => {
        validateDecimalInput(e, CONFIG.MAX_DISCOUNT);
        debouncedCalculateDiscount();
    });


    // --- Theme Switcher Logic ---
    const themeSelector = document.getElementById('themeSelector');

    /**
     * Applies the specified theme to the application.
     * @param {string} theme - The theme to apply ('dark' or 'light').
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Handles changes in the system's preferred color scheme.
     * This function is a listener for media query changes.
     * @param {Event} e - The media query list event, which has a `matches` property.
     */
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

    // Applies the selected theme and saves the preference to local storage.
    themeSelector.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        localStorage.setItem('theme', selectedTheme);
        if (selectedTheme === 'system') {
            applyTheme(systemThemeWatcher.matches ? 'dark' : 'light');
        } else {
            applyTheme(selectedTheme);
        }
    });

    /**
     * Initializes the application theme based on user's saved preference
     * or the system's preferred color scheme. It checks localStorage for a
     * saved theme and applies it, otherwise it defaults to the system theme.
     */
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

    // ==================== HISTORY MANAGEMENT ====================
    /**
     * Saves a calculation to history in localStorage
     * @param {string} type - The type of calculation (tip, split, discount)
     * @param {Object} data - The calculation data
     */
    function saveToHistory(type, data) {
        try {
            const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
            history.unshift({
                type,
                data,
                timestamp: new Date().toISOString()
            });
            // Keep only the last N items
            const trimmedHistory = history.slice(0, CONFIG.HISTORY_MAX_ITEMS);
            localStorage.setItem('calculatorHistory', JSON.stringify(trimmedHistory));
        } catch (e) {
            console.error('Failed to save to history:', e);
        }
    }

    /**
     * Animates a result element when it changes
     * @param {HTMLElement} element - The element to animate
     */
    function animateResult(element) {
        element.classList.remove('pulse');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 600);
    }

    /**
     * Copies text to clipboard
     * @param {string} text - The text to copy
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(translations[currentLanguage].copied, 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(translations[currentLanguage].copied, 'success');
            } catch (e) {
                showToast(translations[currentLanguage].error, 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    /**
     * Shares content using Web Share API
     * @param {string} title - The title to share
     * @param {string} text - The text to share
     */
    async function shareContent(title, text) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: window.location.href
                });
                showToast(translations[currentLanguage].shared, 'success');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // Fallback to copy
                    await copyToClipboard(text);
                }
            }
        } else {
            // Fallback to copy
            await copyToClipboard(text);
        }
    }

    /**
     * Resets all inputs in the tip calculator
     */
    function resetTipCalculator() {
        billAmountInput.value = '';
        customTipInput.value = '';
        if (activeTipBtn) {
            activeTipBtn.classList.remove('active');
            activeTipBtn = null;
        }
        calculateTip();
        showToast('Reset', 'info');
    }

    /**
     * Resets all inputs in the bill splitter
     */
    function resetBillSplitter() {
        totalBillInput.value = '';
        tipPercentageSplitInput.value = '15';
        peopleCountInput.value = '1';
        includeTipCheckbox.checked = true;
        calculateBillSplit();
        showToast('Reset', 'info');
    }

    /**
     * Resets all inputs in the discount calculator
     */
    function resetDiscountCalculator() {
        originalPriceInput.value = '';
        discountPercentageInput.value = '10';
        calculateDiscount();
        showToast('Reset', 'info');
    }

    // ==================== ACTION BUTTONS ====================
    // Smart Rounding Toggle
    const smartRoundingToggle = document.getElementById('smartRoundingToggle');
    if (smartRoundingToggle) {
        smartRoundingToggle.addEventListener('change', (e) => {
            smartRounding = e.target.checked;
            calculateTip();
            calculateBillSplit();
            calculateDiscount();
        });
    }

    // Tip Calculator Actions
    const resetTipBtn = document.getElementById('resetTipBtn');
    const copyTipBtn = document.getElementById('copyTipBtn');
    const shareTipBtn = document.getElementById('shareTipBtn');

    if (resetTipBtn) resetTipBtn.addEventListener('click', resetTipCalculator);
    if (copyTipBtn) {
        copyTipBtn.addEventListener('click', () => {
            const tip = tipAmountResult.textContent;
            const total = totalAmountResult.textContent;
            const text = `Tip: ${tip}\nTotal: ${total}`;
            copyToClipboard(text);
        });
    }
    if (shareTipBtn) {
        shareTipBtn.addEventListener('click', () => {
            const tip = tipAmountResult.textContent;
            const total = totalAmountResult.textContent;
            const text = `Tip: ${tip}\nTotal: ${total}`;
            shareContent('Tip Calculator Result', text);
        });
    }

    // Bill Splitter Actions
    const resetSplitBtn = document.getElementById('resetSplitBtn');
    const copySplitBtn = document.getElementById('copySplitBtn');
    const shareSplitBtn = document.getElementById('shareSplitBtn');

    if (resetSplitBtn) resetSplitBtn.addEventListener('click', resetBillSplitter);
    if (copySplitBtn) {
        copySplitBtn.addEventListener('click', () => {
            const totalTip = totalTipResultSplit.textContent;
            const perPerson = totalPerPersonResult.textContent;
            const text = `Total Tip: ${totalTip}\nPer Person: ${perPerson}`;
            copyToClipboard(text);
        });
    }
    if (shareSplitBtn) {
        shareSplitBtn.addEventListener('click', () => {
            const totalTip = totalTipResultSplit.textContent;
            const perPerson = totalPerPersonResult.textContent;
            const text = `Total Tip: ${totalTip}\nPer Person: ${perPerson}`;
            shareContent('Bill Splitter Result', text);
        });
    }

    // Discount Calculator Actions
    const resetDiscountBtn = document.getElementById('resetDiscountBtn');
    const copyDiscountBtn = document.getElementById('copyDiscountBtn');
    const shareDiscountBtn = document.getElementById('shareDiscountBtn');

    if (resetDiscountBtn) resetDiscountBtn.addEventListener('click', resetDiscountCalculator);
    if (copyDiscountBtn) {
        copyDiscountBtn.addEventListener('click', () => {
            const saved = amountSavedResult.textContent;
            const finalPrice = finalPriceResult.textContent;
            const text = `Saved: ${saved}\nFinal Price: ${finalPrice}`;
            copyToClipboard(text);
        });
    }
    if (shareDiscountBtn) {
        shareDiscountBtn.addEventListener('click', () => {
            const saved = amountSavedResult.textContent;
            const finalPrice = finalPriceResult.textContent;
            const text = `Saved: ${saved}\nFinal Price: ${finalPrice}`;
            shareContent('Discount Calculator Result', text);
        });
    }

    initializeTheme();

    // Initial calculations
    calculateTip();
    calculateBillSplit();
    calculateDiscount();

    // ==================== PWA SERVICE WORKER ====================
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful:', registration.scope);
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
});
