import React, { Component } from 'react';
import './Calculator.css';
import { faDivide, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2'



const PLUS = <FontAwesomeIcon icon={faPlus} />;
const SUBTRACT = <FontAwesomeIcon icon={faMinus} />;
const MULTIPLE = <FontAwesomeIcon icon={faXmark} />;
const DIVIDE = <FontAwesomeIcon icon={faDivide} />;
export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultCalculation: '0', // Initialize as string for easier manipulation
      preNumber: null,
      nextNumber: 0,
      operation: '',
      fontSizeClass: 'normal-font', // Add state for font size class
      isCheckEqual: false,
      isCheckNextNumber: false,
    };
  }

  /* --------------------------- handle click number -------------------------- */
  handleClickNum = (num) => {
    let { resultCalculation, isCheckEqual, fontSizeClass } = this.state;
    num = num.toString();

    //check isCheckNextNumber to know when the user enters a value after chooscing the operation
    if (this.state.isCheckNextNumber) {
      resultCalculation = num
      this.setState({ resultCalculation, isCheckNextNumber: false })
      return
    }

    //if the calculation is complete, rest the number 
    if (isCheckEqual) {
      resultCalculation = num
      this.setState({
        preNumber: null,
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
    fontSizeClass = this.updateFontSize(resultCalculation)
    this.setState({ resultCalculation, fontSizeClass });
  };



  /* ----------------------- handle click btn operation ----------------------- */
  handleClickOperation = (opera) => {
    let { resultCalculation, preNumber, operation, isCheckEqual } = this.state;

    if (isCheckEqual) {
      // Reset state after pressing `=` and then an operation
      this.setState({
        preNumber: Number(resultCalculation),
        nextNumber: 0,
        operation: opera,
        isCheckEqual: false,
        isCheckNextNumber: true,
      });
    } else if (this.state.isCheckNextNumber) {
      let regex = /^(?:[^+\-*/]*[+\-*/]){2,}[^+\-*/]*$/
      if (opera === "-" && !regex.test(operation)) {
        this.setState((preState) => ({
          operation: `${preState.operation} ${opera}`
        }))
        return;
      }
      // Change operation if an operation button is pressed repeatedly
      this.setState({ operation: opera });

    } else if (operation && preNumber) {
      // If an operation exists, calculate and update the state
      let nextNumber = Number(resultCalculation);
      preNumber = this.calculate(preNumber, operation, nextNumber);

      this.setState({
        preNumber,
        nextNumber: 0,
        resultCalculation: preNumber.toString(),
        operation: opera,
        isCheckNextNumber: true,
      });
    } else {
      // Initial operation selection
      preNumber = Number(resultCalculation);
      this.setState({
        preNumber,
        operation: opera,
        isCheckNextNumber: true,
      });
    }
  };


  /* ------------------------- handle click btn equal ------------------------- */
  handleEqual = () => {
    let { resultCalculation, preNumber, nextNumber, operation, isCheckEqual, fontSizeClass } = this.state;

    // Check if operation and preNumber are valid before calculating
    if (!operation) {
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
    if (!result) {
      console.log("result", result)
      console.log("preNumber", preNumber)
      console.log("operation", operation)
      console.log("nextNumber", nextNumber)

      return
    }
    fontSizeClass = this.updateFontSize(result.toString())

    this.setState({
      preNumber,
      nextNumber,
      resultCalculation: result.toString(),
      fontSizeClass,
      isCheckEqual: true,
    })
  };

  handleClickNegative = () => {
    let { resultCalculation } = this.state;
    if (resultCalculation === "0" || resultCalculation === "") {
      return;
    } else if (resultCalculation.includes("-")) {
      resultCalculation = resultCalculation.replace(/-/g, "")
    }
    else {
      resultCalculation = `-${resultCalculation}`;
    }
    this.setState({ resultCalculation })
  }

  /* -------------------------- hanlde click percent -------------------------- */
  handleClickPercent = () => {
    let { resultCalculation } = this.state;
    if (resultCalculation === "0" || resultCalculation === "") {
      return;
    } else {
      resultCalculation = (Number(resultCalculation) / 100).toString()
    }
    this.setState({ resultCalculation })
  }


  /* --------------------------- calculate function --------------------------- */

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
          Swal.fire({
            title: 'Error!',
            text: 'Cannot divide by zero',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          break;
        }
        result = Number(preNumber) / Number(nextNumber);
        break;

      case "+ -":
        result = Number(preNumber) - Number(nextNumber);
        break;

      case "- -":
        result = Number(preNumber) + Number(nextNumber);
        break;

      case "* -":
        result = Number(preNumber) * -Number(nextNumber);
        break;

      case "/ -":
        result = Number(preNumber) / -Number(nextNumber);
        if (nextNumber === 0) {
          Swal.fire({
            title: 'Error!',
            text: 'Cannot divide by zero',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          break;
        }
        break;

      default:
        return;  //do not perform any update if there is not operation
    }
    return result;
  }


  /* ------------------------------ fotmat number ----------------------------- */
  formatNumber = (number) => {
    let numberStr = number.toString()
    let result;
    if (numberStr.includes(".")) {
      let [integerPart, decimalPart] = numberStr.split(".") // divide the number befor and after "."

      if (decimalPart.length === 0) {
        result = Number(integerPart).toLocaleString('en-US') + "."

      } else if (decimalPart.length > 0) {
        result = Number(integerPart).toLocaleString('en-US') + "." + decimalPart

      } else if (integerPart.length + decimalPart.length > 13) {
        result = Number(number).toExponential(12);
      } else {
        result = Number(number).toLocaleString('en-US');
      }
    } else {
      result = Number(number).toLocaleString('en-US', {
        maximumFractionDigits: 12, // limit the number of decimal places
      });
    }

    return result
  };

  /* ------------- fix the font-size base on the length of number ------------- */
  updateFontSize = (result) => {
    let fontSizeClass = result.length > 9 ? 'small-font' : 'normal-font';
    return fontSizeClass;
  };

  /* ----------------------------- handle click AC ---------------------------- */
  handleClickAc = () => {
    this.setState({
      resultCalculation: '0',
      preNumber: null,
      nextNumber: 0,
      operation: '',
      fontSizeClass: 'normal-font',
      isCheckEqual: false,
      isCheckNextNumber: false,
    })
  }

  /* ---------------------------- handle click back space  --------------------------- */
  handleBackSpace = () => {
    let { resultCalculation, fontSizeClass, isCheckEqual } = this.state;
    if (isCheckEqual) { // after calculation reset state.
      this.setState({
        resultCalculation: "0",
        preNumber: null,
        nextNumber: 0,
        operation: '',
        fontSizeClass: 'normal-font',
        isCheckEqual: false,
        isCheckNextNumber: false,
      });
      return;
    }
    if (resultCalculation.length < 1) {
      resultCalculation = "0"
    } else {
      resultCalculation = resultCalculation.slice(0, -1)
    }

    // if the result is an emtry string . reset to "0"
    if (resultCalculation === '') {
      resultCalculation = '0';
    }
    //update font size
    fontSizeClass = this.updateFontSize(resultCalculation)

    this.setState({ resultCalculation, fontSizeClass })
  }


  render() {
    const { resultCalculation, fontSizeClass, preNumber, operation, nextNumber, isCheckEqual } = this.state;

    return (
      <div className='container'>
        <h1 className='title'>Calculator</h1>
        <div className="box">
          <div className="input-results">
            <p className='formula'>
              {preNumber === 0 && !operation ? " " : preNumber}
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
            <button id="clear" onClick={this.handleClickAc}>
              <span>AC</span>
            </button>
            <button id="back-space" onClick={this.handleBackSpace}>
              <span>C</span>
            </button>
            <button id="percent" onClick={this.handleClickPercent}>
              <span>%</span>
            </button>
            <button id="divide" onClick={() => { this.handleClickOperation("/") }}>
              <span>{DIVIDE}</span>
            </button>
            <button id="seven" onClick={() => this.handleClickNum(7)}>
              <span>7</span>
            </button>
            <button id="eight" onClick={() => this.handleClickNum(8)}>
              <span>8</span>
            </button>
            <button id="nine" onClick={() => this.handleClickNum(9)}>
              <span>9</span>
            </button>
            <button id="multiply" onClick={() => { this.handleClickOperation("*") }}>
              <span>{MULTIPLE}</span>
            </button>
            <button id="four" onClick={() => this.handleClickNum(4)}>
              <span>4</span>
            </button>
            <button id="five" onClick={() => this.handleClickNum(5)}>
              <span>5</span>
            </button>
            <button id="six" onClick={() => this.handleClickNum(6)}>
              <span>6</span>
            </button>
            <button id="subtract" onClick={() => { this.handleClickOperation("-") }}>
              <span>{SUBTRACT}</span>
            </button>
            <button id="one" onClick={() => this.handleClickNum(1)}>
              <span>1</span>
            </button>
            <button id="two" onClick={() => this.handleClickNum(2)}>
              <span> 2</span>
            </button>
            <button id="three" onClick={() => this.handleClickNum(3)}>
              <span> 3</span>
            </button>
            <button id="add" onClick={() => { this.handleClickOperation("+") }}>
              <span>{PLUS}</span>
            </button>
            <button id="negative" onClick={this.handleClickNegative} >
              <span> +/-</span>
            </button>

            <button id="zero" onClick={() => this.handleClickNum(0)}>
              <span>0</span>
            </button>
            <button id="decimal" onClick={() => this.handleClickNum('.')}>
              <span>.</span>
            </button>
            <button id="equals" onClick={this.handleEqual} >
              <span>=</span>
            </button>
          </div>
        </div>
        <footer>by <a href="https://github.com/Son-Tr" target='_blank' rel="noopener noreferrer">Son-Tr</a></footer>
      </div>
    );
  }
}
