import React, { Component } from 'react';
import './Calculator.css';

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preNumber: 0,
      number: '0', // Initialize as string for easier manipulation
      operation: '',
      fontSizeClass: 'normal-font', // Add state for font size class
    };
  }

  /* --------------------------- handle click number -------------------------- */
  handleClickNum = (num) => {
    let { number } = this.state;
    num = num.toString();

    // If number is '0', replace it with the new number clicked
    if (number === '0') {
      number = num;
    } else {
      number += num;
    }

    // Update the state with the formatted number,Call updateFontSize after setting state
    this.setState({ number }, this.updateFontSize);
  };

  c

  /* ------------------------------ fotmat number ----------------------------- */
    formatNumber = (number) => {

      let numberStr =String(number)
      // Remove dot and commas for proper conversion to a number
      let cleanedNumber = numberStr.replace(/[^0-9]/g, '');
      //check limit of numberStr
      if(numberStr.lenght < 13 && numberStr.lenght !== 0){

        if (cleanedNumber === '') {
          return '0'; // Return '0' if the string is empty
        }
        // Format the numberStr with commas for thousands, millions, etc.
        return cleanedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }else{
        cleanedNumber = numberStr.replace(/^./, '')
        return cleanedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    };


  updateFontSize = () => {
    const { number } = this.state;
    let fontSizeClass = 'normal-font';

    if (number.length > 7) {
      fontSizeClass = 'small-font'; // Apply small font size if length > 7
    }

    this.setState({ fontSizeClass });
  };

  render() {
    const { number, fontSizeClass } = this.state;
    const formattedNumber = this.formatNumber(number);

    console.log()

    return (
      <div className='container'>
        <h1 className='title'>Calculator</h1>
        <div className="box">
          <div className="input-results">
            <p className='formula'>62<span className='operation'>x</span></p>
            <p className={`output no-spinner ${fontSizeClass}`} id='display'>
              {formattedNumber === "" ? '0' : formattedNumber}
            </p>
          </div>
          <div className="grid-btn">
            <button id="clear" onClick={() => this.setState({ number: '0' })}>AC</button>
            <button id="percent">%</button>
            <button id="divide"><i className="fa-solid fa-divide" /></button>
            <button id="back-space"><i className="fa-solid fa-delete-left" /></button>
            <button id="seven" onClick={() => this.handleClickNum(7)}>7</button>
            <button id="eight" onClick={() => this.handleClickNum(8)}>8</button>
            <button id="nine" onClick={() => this.handleClickNum(9)}>9</button>
            <button id="multiply">x</button>
            <button id="four" onClick={() => this.handleClickNum(4)}>4</button>
            <button id="five" onClick={() => this.handleClickNum(5)}>5</button>
            <button id="six" onClick={() => this.handleClickNum(6)}>6</button>
            <button id="subtract">-</button>
            <button id="one" onClick={() => this.handleClickNum(1)}>1</button>
            <button id="two" onClick={() => this.handleClickNum(2)}>2</button>
            <button id="three" onClick={() => this.handleClickNum(3)}>3</button>
            <button id="add">+</button>
            <button id="dot">.</button>
            <button id="zero" onClick={() => this.handleClickNum(0)}>0</button>
            <button id="equals">=</button>
          </div>
        </div>
      </div>
    );
  }
}
