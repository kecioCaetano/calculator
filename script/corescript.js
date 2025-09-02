let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

const buttonsFrame = document.querySelector('.buttonsFrame');
const display = document.querySelector('.display');

// Initialize the display to show '0' when the page loads.
display.textContent = '0';

buttonsFrame.addEventListener("click", (event) => {
    const button = event.target;
    if (!button.classList.contains("buttons")) {
        return;
    }

    const buttonValue = button.textContent.trim();

    if (/^\d$/.test(buttonValue)) {
        inputDigit(buttonValue);
    } else if (/[+\-*/]/.test(buttonValue)) {
        handleOperator(buttonValue);
    } else if (buttonValue === '=') {
        calculate();
    } else if (buttonValue === 'Clear') {
        resetCalculator();
    }
});

function inputDigit(digit) {
    if (display.textContent === '0' || shouldResetDisplay) {
        display.textContent = digit;
        shouldResetDisplay = false;
    } else {
        display.textContent += digit;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.textContent);

    // Handle chained operations: if an operator is pressed after a full expression
    // (e.g., 5 * 2 +), calculate the first part before proceeding.
    if (operator && !shouldResetDisplay) {
        const result = operate(firstOperand, operator, inputValue);
        display.textContent = String(result);
        firstOperand = result;
    } else {
        firstOperand = inputValue;
    }

    operator = nextOperator;
    shouldResetDisplay = true;
}

function calculate() {
    // Ignore if we don't have a full expression or just pressed an operator
    if (operator === null || shouldResetDisplay) {
        return;
    }

    const secondOperand = parseFloat(display.textContent);
    const result = operate(firstOperand, operator, secondOperand);

    // Handle division by zero error from operate()
    if (result === "Error!") {
        display.textContent = "Error!";
    } else {
        // Round to avoid floating point inaccuracies, e.g., 0.1 + 0.2
        display.textContent = String(Math.round(result * 100000) / 100000);
    }

    // If there was an error, reset the calculator state
    firstOperand = result === "Error!" ? null : parseFloat(display.textContent);
    operator = null;
    shouldResetDisplay = true;
}

function resetCalculator() {
    display.textContent = '0';
    firstOperand = null;
    operator = null;
    shouldResetDisplay = false;
}

function operate(leftNum, operation, rightNum) {
    // The parseFloat conversion is now handled by the calling functions
    switch (operation) {
        case "+": return add(leftNum, rightNum);
        case "-": return subtract(leftNum, rightNum);
        case "*": return multiply(leftNum, rightNum);
        case "/": return divide(leftNum, rightNum);
    }
}

function add(val1, val2){
    return val1 + val2;
}
function subtract(val1, val2){
    return val1 - val2;
}

function multiply(val1, val2){
    return val1 * val2;
} 

function divide(val1, val2){
    if (val2 === 0 || val2 === -0) {
        // Providing feedback for division by zero is crucial.
        return "Error!";
    }
    return val1 / val2;
}