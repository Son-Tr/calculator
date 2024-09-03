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
      preNumber: 0,
      number: '0', // Initialize as string for easier manipulation
      operation: '',
      fontSizeClass: 'normal-font', // Add state for font size class
      isCheck: false,
    };
  }

  /* --------------------------- handle click number -------------------------- */
  handleClickNum = (num) => {
    let { number, isCheck } = this.state;
    num = num.toString();

    //if the calculation is complete, rest the number 
    if (isCheck) {
     number = num
    } else {
      // Prevent adding multiple decimal points
      if (num === '.' && number.includes('.')) {
        return;
      } else if (number === '0' && num !== '.') { // If number is '0', replace it with the new number clicked
        number = num;
      } else {
        number += num;
      }
    }

    // limmit the length of the number to 13 character in case the number is decimal point
    if (number.includes(".") && number.length > 14) {
      number = number.slice(0, 14);
      alert("Limmit the length of number is 13 characters")
    }

    // limmit the length of the number to 13 character
    if (!number.includes(".") && number.length > 13) {
      number = number.slice(0, 13);
      alert("Limmit the length of number is 13 characters")
    }

    // Update the state with the formatted number,Call updateFontSize after setting state
    this.setState({ number , isCheck:false }, this.updateFontSize);
  };

  /* ---------------------------- handle click back space  --------------------------- */
  handleBackSpace = () => {
    let { number } = this.state;
    if (number.length < 1) {
      number = "0"
    } else {
      number = number.slice(0, -1)
    }

    // if the result is an emtry string . reset to "0"
    if (number === '') {
      number = '0';
    }

    this.setState({ number }, this.updateFontSize)
  }

  /* ----------------------- handle click btn operation ----------------------- */
  handleClickOperation = (opera) => {
    let { number, preNumber, operation } = this.state
    if (operation) {
      switch (operation) {
        case PLUS:
          preNumber += Number(number);
          break;
        case SUBTRACT:
          preNumber -= Number(number);
          break;

        case MULTIPLE:
          preNumber *= Number(number);
          break;

        case DIVIDE:
          if (number === "0") {
            alert("Cannot divide by zero");
            break;
          }
          preNumber /= Number(number);;
          break;
        default:
          break;
      }
    } else {
      preNumber = Number(number);
    }
    this.setState({
      preNumber,
      number: '0',
      operation: opera,
    })
  }

  /* ------------------------- handle click btn equal ------------------------- */
  handleEqual = () => {
    let { number, preNumber, operation } = this.state;
    let result;
    
    switch (operation) {
      case PLUS:
        result = Number(number) + preNumber;
        break;
      case SUBTRACT:
        result = Number(number) - preNumber;
        break;

      case MULTIPLE:
        result = Number(number) * preNumber;
        break;

      case DIVIDE:
        if (number === "0") {
          alert("Cannot divide by zero");
          break;
        }
        result = Number(number) / preNumber;;
        break;
      default:
        return;  // do not perform any update if there is not operation
    }

    this.setState({
      preNumber: 0,
      number: result.toString(),
      operation: "",
      isCheck: true,
    }, () => {
      let formattedNumber = this.formatNumber(this.state.number);
      this.setState({ number: formattedNumber }, this.updateFontSize)
    });

  };

  /* ------------------------------ fotmat number ----------------------------- */
  formatNumber = (number) => {


    if( number.length>13){
      let result = Number(number).toPrecision(13) // covert with 12 digit percision
      return number= result.toString()
    }

    // If the number is not too large, proceed with formatting
    let [integerPart, decimalPart] = number.split(".");

    //add to comma to the integer part 
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    //if decimal part return the formatted integer with decimal part
    if (decimalPart !== undefined) {
      return `${integerPart}.${decimalPart}`
    }

    // return just the formatted integer if there isnt decimal part 
    return integerPart;
  };

  /* ------------- fix the font-size base on the length of number ------------- */
  updateFontSize = () => {
    const { number } = this.state;
    let fontSizeClass = 'normal-font';

    if (number.length > 7) {
      fontSizeClass = 'small-font'; // Apply small font size if length > 7
    }

    this.setState({ fontSizeClass });
  };


  render() {
    const { number, fontSizeClass, preNumber, operation } = this.state;
    let formattedNumber = this.formatNumber(number)
    return (
      <div className='container'>
        <h1 className='title'>Calculator</h1>
        <div className="box">
          <div className="input-results">
            <p className='formula'>
              {preNumber}
              <span className='operation'>
                {operation}
              </span>
            </p>
            <p className={`output no-spinner ${fontSizeClass}`} id='display'>
              {formattedNumber}
            </p>
          </div>
          <div className="grid-btn">
            <button id="clear" onClick={() => this.setState({
              preNumber: 0,
              number: '0',
              operation: '',
              fontSizeClass: 'normal-font',
            })}>AC</button>
            <button id="percent">%</button>
            <button id="divide" onClick={() => { this.handleClickOperation(DIVIDE) }}>
              {DIVIDE}
            </button>
            <button id="back-space" onClick={this.handleBackSpace}>
              <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
            <button id="seven" onClick={() => this.handleClickNum(7)}>7</button>
            <button id="eight" onClick={() => this.handleClickNum(8)}>8</button>
            <button id="nine" onClick={() => this.handleClickNum(9)}>9</button>
            <button id="multiply" onClick={() => { this.handleClickOperation(MULTIPLE) }}>
              {MULTIPLE}
            </button>
            <button id="four" onClick={() => this.handleClickNum(4)}>4</button>
            <button id="five" onClick={() => this.handleClickNum(5)}>5</button>
            <button id="six" onClick={() => this.handleClickNum(6)}>6</button>
            <button id="subtract" onClick={() => { this.handleClickOperation(SUBTRACT) }}>
              {SUBTRACT}
            </button>
            <button id="one" onClick={() => this.handleClickNum(1)}>1</button>
            <button id="two" onClick={() => this.handleClickNum(2)}>2</button>
            <button id="three" onClick={() => this.handleClickNum(3)}>3</button>
            <button id="add" onClick={() => { this.handleClickOperation(PLUS) }}>
              {PLUS}
            </button>
            <button id="dot" onClick={() => this.handleClickNum('.')}>.</button>
            <button id="zero" onClick={() => this.handleClickNum(0)}>0</button>
            <button id="equals" onClick={this.handleEqual} >=</button>
          </div>
        </div>
      </div>
    );
  }
}
