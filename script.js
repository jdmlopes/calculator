const numberButtons = document.querySelectorAll('.number-btn');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalSign = document.querySelector('#equal-btn');
const resultsDisplay = document.querySelector('#display-results');
const expressionDisplay = document.querySelector('#display-history');
const allClear = document.querySelector('#clear');
const signButton = document.querySelector('#sign');

let xValue = '';
let yValue = '';
let currentOperator = '';
let enteringNumber = 'x'; //x or y
let PressedEqual = false;


/* NUMBERS */
numberButtons.forEach((number) =>{
    number.addEventListener('click',(e) =>{
        if(PressedEqual){
            resetOperation();
        }

        if(enteringNumber === 'x' && checkDecimal(e.target.value,xValue)){
            buildX(e.target.value);
        }else if(enteringNumber === 'y' && checkDecimal(e.target.value,yValue)){
            buildY(e.target.value);
        }
            
    });
});

function checkDecimal(digit,number){
    if(digit !== '.') return true;
    if(!number.includes('.')) return true;

    return false;
}

function buildX(number){
    xValue += number;
    displayExpression();
    displayResult(xValue);
}

function buildY(number){
    yValue += number;
    displayExpression();
    displayResult(yValue);
}

/* OPERATORS */

operatorButtons.forEach((operator) => {
    operator.addEventListener('click', (e) =>{
        if(PressedEqual){
            PressedEqual = false;
            yValue = '';
            enteringNumber = 'y';
        }

        
        if(e.target.value === 'sqrt' && enteringNumber === 'x' && xValue === ''){
            currentOperator = e.target.value;
            displayExpression();
            return;
        }

        if(currentOperator === 'sqrt' && enteringNumber === 'x' && xValue !== ''){
            xValue = operate(1,Number(xValue),currentOperator);
            displayResult(xValue);
            currentOperator = e.target.value;
            displayExpression();
            enteringNumber = 'y';
            return;
        }

        if(enteringNumber === 'x' && xValue !== ''){
            currentOperator = e.target.value;
            enteringNumber = 'y';
            displayExpression();
            return;
        }
        
        if(enteringNumber === 'y'  && yValue === ''){
            currentOperator = e.target.value;
            displayExpression();
            return;
        }
        
        if(enteringNumber === 'y' && yValue !== ''){
            xValue = operate(Number(xValue),Number(yValue),currentOperator);
            displayResult(xValue);
            currentOperator = e.target.value;
            yValue = '';
            displayExpression();
            return;
        }

    });
});

equalSign.addEventListener('click', (e) =>{

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
});


/*  CLEAN DISPLAY */
allClear.addEventListener('click', clearAll);

function clearAll(){
    resetOperation();
    displayExpression();
    displayResult('');

}

function resetOperation(){
    xValue = '';
    yValue = '';
    currentOperator = '';
    enteringNumber = 'x';
    PressedEqual = false;
}
/* DISPLAY FUNCTIONS */
function displayResult(result){
    resultsDisplay.textContent = result;
}

function displayExpression(){
    expressionDisplay.textContent = buildExpression();
}


function buildExpression(){

    let operator = currentOperator;
    let x = Number(xValue < 0) ? `(${xValue})` : `${xValue}`;
    let y = Number(yValue < 0) ? `(${yValue})` : `${yValue}`;

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
/* SIGN */

signButton.addEventListener('click',()=>{
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
    
});

/* OPERATIONS */
function operate(x,y,operator){
    if(typeof x !== 'number' || typeof y !== 'number') return 'ERROR';

    switch(operator){
        case '+':
            return `${add(x,y)}`;
            break;
        case '-':
            return `${subtract(x,y)}`;
            break;
        case '*':
            return `${multiply(x,y)}`;
            break;
        case '/':
            return `${divide(x,y)}`;
            break;
        case 'power':
            return `${power(x,y)}`;
            break;
        case '%':
            return `${percentage(x,y)}`;
            break;
        case 'sqrt':
            return `${squareRoot(x,y)}`;
            break;
        case '!':
            return `${factorial(x,y)}`;
            break;
        default:
            return 'Error';

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