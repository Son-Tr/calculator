import React, { Component } from 'react';
import './Calculator.css';
import { faDeleteLeft, faDivide, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const PLUS = <FontAwesomeIcon icon={faPlus} />;
const SUBTRACT = <FontAwesomeIcon icon={faMinus} />;
const MULTIPLE = <FontAwesomeIcon icon={faXmark} />;
const DIVIDE = <FontAwesomeIcon icon={faDivide} />;
export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultCalculation: '0', // Initialize as string for easier manipulation
      preNumber: 0,
      nextNumber: 0,
      operation: '',
      fontSizeClass: 'normal-font', // Add state for font size class
      isCheckEqual: false,
      isCheckNextNumber: false,
    };
  }

  /* --------------------------- handle click number -------------------------- */
  handleClickNum = (num) => {
    let { resultCalculation, preNumber, nextNumber, operation, isCheckEqual, isCheckNextNumber } = this.state;
    num = num.toString();

    //check isCheckNextNumber to know when the user enters a value after chooscing the operation
    if (this.state.isCheckNextNumber) {
      this.setState({ isCheckNextNumber: false })
    }

    //if the calculation is complete, rest the number 
    if (isCheckEqual) {
      resultCalculation = num
      this.setState({
        preNumber: 0,
        nextNumber: 0,
        operation: '',
        fontSizeClass: 'normal-font',
        isCheckEqual: false,
        isCheckNextNumber: false,
      })
    } else {
      // Prevent adding multiple decimal points
      if (num === '.' && resultCalculation.includes('.')) {
        return;
      } else if (num === '.') {
        if (resultCalculation === '0') {
          resultCalculation = `0${num}`;
        } else {
          resultCalculation += num;
        }

      } else if (resultCalculation === '0' && num !== '.') { // If resultCalculation is '0', replace it with the new number clicked
        if (Number(num) === 0 && resultCalculation.includes(".")) {
          resultCalculation += "0"
        } else {
          resultCalculation = num;
        }

      } else {
        resultCalculation += num;
      }
    }

    // limmit the length of the number to 13 character in case the number is decimal point
    if (resultCalculation.includes(".") && resultCalculation.length > 14) {
      resultCalculation = resultCalculation.slice(0, 14);
      // alert("Limmit the length of resultCalculation is 13 characters")
    }

    // limmit the length of the number to 13 character
    if (!resultCalculation.includes(".") && resultCalculation.length > 13) {
      resultCalculation = resultCalculation.slice(0, 13);
      // alert("Limmit the length of resultCalculation is 13 characters")
    }

    // Update the state with the formatted number,Call updateFontSize after setting state

    this.setState({ resultCalculation }, this.updateFontSize, console.log("resultCalculation", resultCalculation),
      console.log("preNumber", preNumber),
      console.log("nextNumber", nextNumber),
      console.log("operation", operation),
      console.log("isCheckEqual", isCheckEqual),
      console.log("isCheckNextNumber", isCheckNextNumber));
  };



  /* ----------------------- handle click btn operation ----------------------- */
  handleClickOperation = (opera) => {
    let { resultCalculation, preNumber, nextNumber, operation } = this.state

    if (operation && preNumber) {
      // this condition stops the calculation from happpening too soon. when user enters a value, the calculation will take place;
      if (this.state.isCheckNextNumber) {
        this.setState({ operation: opera });
        return;
      } else if (this.state.isCheckEqual) {
        this.setState({
          preNumber: Number(resultCalculation),
          nextNumber: 0,
          operation: opera,
          resultCalculation: "0",
          isCheckEqual: false,
          isCheckNextNumber: true
        });
        return;
      } else {
        // check the case : opertion and preNumber already have value 
        nextNumber = Number(resultCalculation)
        switch (operation) {
          case "+":
            preNumber = Number(preNumber) + Number(nextNumber);
            break;
          case "-":
            preNumber = Number(preNumber) - Number(nextNumber);
            break;
          case "*":
            preNumber = Number(preNumber) * Number(nextNumber);
            break;

          case "/":
            if (nextNumber === 0) {
              alert("Cannot divide by zero");
              return;
            }
            preNumber = Number(preNumber) / Number(nextNumber);
            break;
          default:
            return;  // do not perform any update if there is not operation
        }
      }
    } else {
      preNumber = Number(resultCalculation);
    }

    this.setState({
      preNumber,
      nextNumber,
      resultCalculation: '0',
      operation: opera,
      isCheckNextNumber: true,
    })
  }

  /* ------------------------- handle click btn equal ------------------------- */
  handleEqual = () => {
    let { resultCalculation, preNumber, nextNumber, operation, isCheckEqual, isCheckNextNumber } = this.state;

    // Check if operation and preNumber are valid before calculating
    if (!operation || preNumber === 0) {
      return; // Exit if there's no valid operation or preNumber
    }
    let result;
    if (isCheckEqual) {
      preNumber = Number(resultCalculation);
      result = this.calculate(preNumber, operation, nextNumber)
    } else {
      nextNumber = Number(resultCalculation)
      result = this.calculate(preNumber, operation, nextNumber)
    }

    this.setState({
      preNumber,
      nextNumber,
      resultCalculation: result.toString(),
      isCheckEqual: true,
    },)




  };

  calculate = (preNumber, operation, nextNumber) => {
    let result;
    switch (operation) {
      case "+":
        result = Number(preNumber) + Number(nextNumber);
        break;
      case "-":
        result = Number(preNumber) - Number(nextNumber);
        break;

      case "*":
        result = Number(preNumber) * Number(nextNumber);
        break;

      case "/":
        if (nextNumber === 0) {
          alert("Cannot divide by zero");
          break;
        }
        result = Number(preNumber) / Number(nextNumber);
        break;
      default:
        return;  //do not perform any update if there is not operation
    }
    return result
  }


  /* ------------------------------ fotmat number ----------------------------- */
  formatNumber = (number) => {
    let numberStr = number.toString()
    let result;
    if (numberStr.includes(".")) {
      let [integerPart, decimalPart] = numberStr.split(".") // divide the number befor and after "."

      if (decimalPart.length === 0) {
        result= Number(integerPart).toLocaleString('en-US') + "."

      } else if (decimalPart.length > 0) {
        result= Number(integerPart).toLocaleString('en-US') + "." + decimalPart

      } else if(integerPart.length + decimalPart.length > 13){
        result=  Number(number).toExponential(12);
      }else {
        result= Number(number).toLocaleString('en-US');
      }
    } else {
      result= Number(number).toLocaleString('en-US', {
        maximumFractionDigits: 12, // limit the number of decimal places
      });
    }

    return result
  };

  /* ------------- fix the font-size base on the length of number ------------- */
  updateFontSize = () => {
    const { resultCalculation } = this.state;
    let fontSizeClass = 'normal-font';

    if (resultCalculation.length > 7) {
      fontSizeClass = 'small-font'; // Apply small font size if length > 7
    }

    this.setState({ fontSizeClass });
  };

  /* ----------------------------- handle click AC ---------------------------- */
  handleClickAc = () => {
    this.setState({
      resultCalculation: '0',
      preNumber: 0,
      nextNumber: 0,
      operation: '',
      fontSizeClass: 'normal-font',
      isCheckEqual: false,
      isCheckNextNumber: false,
    })
  }

  /* ---------------------------- handle click back space  --------------------------- */
  handleBackSpace = () => {
    let { resultCalculation } = this.state;
    if (resultCalculation.length < 1) {
      resultCalculation = "0"
    } else {
      resultCalculation = resultCalculation.slice(0, -1)
    }

    // if the result is an emtry string . reset to "0"
    if (resultCalculation === '') {
      resultCalculation = '0';
    }
    this.setState({ resultCalculation }, this.updateFontSize)
  }


  render() {
    const { resultCalculation, fontSizeClass, preNumber, operation, nextNumber, isCheckEqual } = this.state;
    // this.formatNumber(resultCalculation)
    return (
      <div className='container'>
        <h1 className='title'>Calculator</h1>
        <div className="box">
          <div className="input-results">
            <p className='formula'>
              {this.formatNumber(preNumber)}
              <span className='operation'>
                {operation}
              </span>
              {isCheckEqual ? `${this.formatNumber(nextNumber)} =` : ""}
            </p>
            <p className={`output no-spinner ${fontSizeClass}`} id='display'>
              {this.formatNumber(resultCalculation)}
            </p>
          </div>
          <div className="grid-btn">
            <button id="clear" onClick={this.handleClickAc}>AC</button>
            <button id="percent">%</button>
            <button id="divide" onClick={() => { this.handleClickOperation("/") }}>
              {DIVIDE}
            </button>
            <button id="back-space" onClick={this.handleBackSpace}>
              <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
            <button id="seven" onClick={() => this.handleClickNum(7)}>7</button>
            <button id="eight" onClick={() => this.handleClickNum(8)}>8</button>
            <button id="nine" onClick={() => this.handleClickNum(9)}>9</button>
            <button id="multiply" onClick={() => { this.handleClickOperation("*") }}>
              {MULTIPLE}
            </button>
            <button id="four" onClick={() => this.handleClickNum(4)}>4</button>
            <button id="five" onClick={() => this.handleClickNum(5)}>5</button>
            <button id="six" onClick={() => this.handleClickNum(6)}>6</button>
            <button id="subtract" onClick={() => { this.handleClickOperation("-") }}>
              {SUBTRACT}
            </button>
            <button id="one" onClick={() => this.handleClickNum(1)}>1</button>
            <button id="two" onClick={() => this.handleClickNum(2)}>2</button>
            <button id="three" onClick={() => this.handleClickNum(3)}>3</button>
            <button id="add" onClick={() => { this.handleClickOperation("+") }}>
              {PLUS}
            </button>
            <button id="dot" onClick={() => this.handleClickNum('.')}>.</button>
            <button id="zero" onClick={() => this.handleClickNum(0)}>0</button>
            <button id="equals" onClick={this.handleEqual} >=</button>
          </div>
        </div>
        <footer>by <a href="https://github.com/Son-Tr" target='_blank'>Son-Tr</a></footer>
      </div>
    );
  }
}
