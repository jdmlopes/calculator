const numberButtons = document.querySelectorAll('.number-btn');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalSign = document.querySelector('#equal-btn');
const resultsDisplay = document.querySelector('#display-results');
const expressionDisplay = document.querySelector('#display-history');
const allClear = document.querySelector('#clear');
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

        if(enteringNumber === 'x'){
            buildX(e.target.value);
        }else if(enteringNumber === 'y'){
            buildY(e.target.value);
        }
            
    });
});

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
        if(PressedEqual) PressedEqual = false;

        if(enteringNumber === 'x' && xValue !== ''){
            currentOperator = e.target.value;
            displayExpression();
            enteringNumber = 'y';
        }else if(enteringNumber === 'y'  && yValue === ''){
            currentOperator = e.target.value;
            displayExpression();
        }else if(enteringNumber === 'y'){
            xValue = operate(Number(xValue),Number(yValue),currentOperator);
            displayResult(xValue);
            currentOperator = e.target.value;
            yValue = '';
            displayExpression();
        }
    });
});

equalSign.addEventListener('click', (e) =>{
    PressedEqual = true;
    if(enteringNumber === 'x' && xValue !== ''){
        displayResult(xValue);
        enteringNumber = 'y';
    }else if(enteringNumber === 'y' && yValue === '' && currentOperator === ''){
        displayResult(xValue);
    }else if(enteringNumber === 'y'){
        displayExpression();
        xValue = operate(Number(xValue),Number(yValue),currentOperator);
        displayResult(xValue);
    }
});

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

function displayResult(result){
    resultsDisplay.textContent = result;
}

function displayExpression(){
    expressionDisplay.textContent = buildExpression();
}


function buildExpression(){
    if(enteringNumber === 'x' && currentOperator === ''){
        return `${xValue}`;
    }else if(enteringNumber === 'x' && currentOperator !== ''){
        return `${xValue} ${currentOperator}`;
    }else if(enteringNumber === 'y'){
        return `${xValue} ${currentOperator} ${yValue}`;
    }
        
}


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
        default:
            return 'Error';
    }

}


/* OPERATIONS */
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