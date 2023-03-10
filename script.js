const numberButtons = document.querySelectorAll('.number-btn');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalSign = document.querySelector('#equal-btn');
const resultsDisplay = document.querySelector('#display-results');
const expressionDisplay = document.querySelector('#display-history');
const allClear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const signButton = document.querySelector('#sign');

let xValue = '';
let yValue = '';
let currentOperator = '';
let enteringNumber = 'x'; //x or y
let PressedEqual = false;

displayResult('0');

/* NUMBERS BUTTONS*/
numberButtons.forEach((number) =>{
    number.addEventListener('click', inputDigit.bind(null,number.value));
});

/* OPERATORS BUTTONS*/

operatorButtons.forEach((operator) => {
    operator.addEventListener('click', inputOperator.bind(null,operator.value));
});

function inputOperator(operator){
    if(PressedEqual){
        PressedEqual = false;
        yValue = '';
        enteringNumber = 'y';
    }

    if(operator!== 'sqrt' && xValue === ''){
        enteringNumber = 'y';
        xValue = '0';
    }

    
    if(operator === 'sqrt' && enteringNumber === 'x' && xValue === ''){
        currentOperator = operator;
        displayExpression();
        return;
    }

    if(currentOperator === 'sqrt' && enteringNumber === 'x' && xValue !== ''){
        xValue = operate(1,Number(xValue),currentOperator);
        displayResult(xValue);
        currentOperator = operator;
        displayExpression();
        enteringNumber = 'y';
        return;
    }

    if(enteringNumber === 'x' && xValue !== ''){
        currentOperator = operator;
        enteringNumber = 'y';
        displayExpression();
        return;
    }
    
    if(enteringNumber === 'y'  && yValue === ''){
        currentOperator = operator;
        displayExpression();
        return;
    }
    
    if(enteringNumber === 'y' && yValue !== ''){
        xValue = operate(Number(xValue),Number(yValue),currentOperator);
        displayResult(xValue);
        currentOperator = operator;
        yValue = '';
        displayExpression();
        return;
    }

}
/* EQUAL BUTTON */
equalSign.addEventListener('click', solveOperation);

function solveOperation(){
    if(currentOperator === '!' && xValue !== '' && yValue === ''){
        displayExpression();
        xValue = operate(Number(xValue),1,currentOperator);
        displayResult(xValue);
        PressedEqual = true;
        return;
    }

    if(currentOperator === 'sqrt' && enteringNumber === 'x' && xValue !== ''){
        displayExpression();
        xValue = operate(1,Number(xValue),currentOperator);
        displayResult(xValue);
        PressedEqual = true;
        return;
    }


    if(enteringNumber === 'x' && xValue !== ''){
        displayResult(xValue);
        enteringNumber = 'y';
        PressedEqual = true;
        return;
    }

    if(enteringNumber === 'y' && yValue === '' && currentOperator === ''){
        displayResult(xValue);
        PressedEqual = true;
        return;
    }

    if(enteringNumber === 'y' && yValue !== ''){
        displayExpression();
        xValue = operate(Number(xValue),Number(yValue),currentOperator);
        displayResult(xValue);
        PressedEqual = true;
        return;
    }

}


/*  CLEAN DISPLAY */
allClear.addEventListener('click', clearAll);

function clearAll(){
    resetOperation();
    displayExpression();
    displayResult('0');

}

function resetOperation(){
    xValue = '';
    yValue = '';
    currentOperator = '';
    enteringNumber = 'x';
    PressedEqual = false;
}

/* BACKSPACE BUTTON*/
backspace.addEventListener('click', undoDigitInput);

function undoDigitInput(){
    if(PressedEqual){
        clearAll();
    }

    if(enteringNumber === 'x' && xValue !== ''){
        xValue = xValue.substring(0,xValue.length-1);
        if(xValue.length === 0) displayResult('0');
        else displayResult(xValue);
    }
    if(enteringNumber === 'y' && yValue !== ''){
        yValue = yValue.substring(0,yValue.length-1);
        displayResult(yValue);
    }
    displayExpression();
}

/* SIGN */

signButton.addEventListener('click',changeSign);

function changeSign(){
    if(enteringNumber === 'x'){
        xValue = (Number(xValue) * -1).toString();
        displayResult(Number(xValue));
        displayExpression();
    }

    if(enteringNumber === 'y'){
        yValue = (Number(yValue) * -1).toString();
        displayResult(yValue);
        displayExpression();
    }
}

/* KEYBOARD INPUTS */
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            inputDigit(e.key);
            break;
        case '.':
        case ',':
            inputDigit('.');
            break;
        case '+':
        case '-':
        case '/':
        case '*':
        case '%':
        case '!':
            inputOperator(e.key);
            break;
        case 'p':
        case 'P': //power 
            inputOperator('power');
            break;
        case 's':
        case 'S': //square root
            inputOperator('sqrt');
            break;
        case 'n':
        case 'N': //negate number
            changeSign();
            break;
        case 'Backspace':
        case 'Delete':
            undoDigitInput();
            break;
        case 'Escape': // AC
            clearAll();
        break;
        case '=':
        case 'Enter':
            solveOperation();
            break;
        
    }
});

/* DISPLAY FUNCTIONS */
function displayResult(result){
    resultsDisplay.textContent = validateResult(result);
}

function displayExpression(){
    expressionDisplay.textContent = buildExpression();
}


function buildExpression(){

    let operator = currentOperator;

    let x = formatNegativeNumber(xValue);
    let y = formatNegativeNumber(yValue);
    


    switch(currentOperator){
        case '*':
            operator = 'X';
            break;
        case '%':
            operator = '% of'
            break;
        case 'power':
            operator = '^'
            break;
        case 'sqrt':
            operator = '√'
            if(enteringNumber === 'x'){
                return `${operator}${x}`;
            }
            break;
        case '!':
            break;
    }

    return `${x} ${operator} ${y}`;
}

/* FORMATTING FUNCTIONS */
function formatNumberInput(number){
    if(number === '') return '';

    if(number === '.' || number === '0.') return '0.';

    if(+number === 0) return '0';

    if(+number > 0 && number.charAt(0) === '0' && number.charAt(1) !== '.') return `${number.substring(1)}`; 

    return number;
}

function validateResult(number){
    if(number === 'Infinity') return 'A HUGE number';

    if(number === '-Infinity') return 'A HUGE negative number';

    if(number === 'NaN') return 'ERROR'

    return number;

}

function fixFloatingPoint(number){
    if(number.includes('.')) return `${Number(Number(number).toFixed(12))}`;

    return number;
}


function formatNegativeNumber(number){
    if(Number(number) < 0) return `(${+number})`;
    return number;
}

/* INPUT FUNCTIONS */
function inputDigit(digit){
    if(PressedEqual){
        resetOperation();
    }

    if(enteringNumber === 'x' && checkDecimal(digit,xValue)){
        buildX(digit);
    }else if(enteringNumber === 'y' && checkDecimal(digit,yValue)){
        buildY(digit);
    }
}

function checkDecimal(digit,number){
    if(digit !== '.') return true;
    if(!number.includes('.')) return true;

    return false;
}

function buildX(number){
    if(checkInputLimit(`${xValue}`)) return;
    xValue += number;
    xValue = formatNumberInput(xValue);
    displayExpression();
    displayResult(xValue);
}

function buildY(number){
    if(checkInputLimit(`${yValue}`)) return;
    yValue += number;
    yValue = formatNumberInput(yValue);
    displayExpression();
    displayResult(yValue);
}

function checkInputLimit(number){
    if(number.length > 17){
        alert("Number is too big, Can't input anymore");
        return true;
    }
    return false;
    
}


/* OPERATIONS FUNCTIONS*/
function operate(x,y,operator){
    if(typeof x !== 'number' || typeof y !== 'number') return 'ERROR';

    switch(operator){
        case '+':
            return fixFloatingPoint(`${add(x,y)}`);
            break;
        case '-':
            return fixFloatingPoint(`${subtract(x,y)}`);
            break;
        case '*':
            return fixFloatingPoint(`${multiply(x,y)}`);
            break;
        case '/':
            if(y === 0) return "ERROR, Can't divide by 0";
            return fixFloatingPoint(`${divide(x,y)}`);
            break;
        case 'power':
            return fixFloatingPoint(`${power(x,y)}`);
            break;
        case '%':
            return fixFloatingPoint(`${percentage(x,y)}`);
            break;
        case 'sqrt':
            return fixFloatingPoint(`${squareRoot(x,y)}`);
            break;
        case '!':
            return fixFloatingPoint(`${factorial(x,y)}`);
            break;
        default:
            return 'ERROR';

    }

}

function add(x,y){
    return x + y;
}

function subtract(x,y){
    return x - y;
}

function multiply(x,y){
    return x * y;
}

function divide(x,y){
    if(y === 0) return "Can't divide by 0";
    return x / y;
}

function percentage(x,y){
    return (x / 100) * y;
}

function power(x,y){
    return x ** y;
}

function squareRoot(x,y){
    return x * Math.sqrt(y);
}

function factorial(x,y){
    let r = 1;
    for(i = x; i > 1; i--) r = r * i;
    return r * y;
}