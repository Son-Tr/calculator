import React, { Component } from 'react';
import "./Calculator.css";

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '', // Lưu trữ biểu thức hiện tại mà người dùng nhập vào
    };
  }

  // Hàm xử lý khi người dùng nhấn một nút
  handleClick = (value) => {
    this.setState((prevState) => ({
      input: prevState.input + value, // Thêm giá trị của nút vào chuỗi biểu thức
    }));
  };

  // Hàm xử lý khi người dùng nhấn nút 'C' (xóa)
  handleClear = () => {
    this.setState({ input: '' }); // Xóa biểu thức hiện tại
  };

  // Hàm xử lý khi người dùng nhấn nút '=' (tính toán)
  handleCalculate = () => {
    const result = this.evaluateExpression(this.state.input); // Gọi hàm tính toán biểu thức
    this.setState({ input: result }); // Hiển thị kết quả tính toán
  };

  // Hàm phân tích và tính toán biểu thức
  evaluateExpression = (expression) => {
    try {
      // Xử lý phép toán phần trăm
      expression = expression.replace(/(\d+)%/g, (_, num) => `*${parseFloat(num) / 100}`);

      // Đánh giá biểu thức sau khi thay thế
      // Hàm eval() chỉ nên sử dụng trong môi trường tin cậy
      // Để an toàn hơn, có thể sử dụng một thư viện như math.js thay cho eval()
      return eval(expression).toString();
    } catch (error) {
      return 'Error';
    }
  };

  render() {
    return (
      <div className="calculator">
        {/* Hiển thị biểu thức và kết quả */}
        <div className="display">{this.state.input}</div>

        {/* Các nút số và toán tử */}
        <div className="buttons">
          <button onClick={() => this.handleClick('1')}>1</button>
          <button onClick={() => this.handleClick('2')}>2</button>
          <button onClick={() => this.handleClick('3')}>3</button>
          <button onClick={() => this.handleClick('+')}>+</button>
          <button onClick={() => this.handleClick('4')}>4</button>
          <button onClick={() => this.handleClick('5')}>5</button>
          <button onClick={() => this.handleClick('6')}>6</button>
          <button onClick={() => this.handleClick('-')}>-</button>
          <button onClick={() => this.handleClick('7')}>7</button>
          <button onClick={() => this.handleClick('8')}>8</button>
          <button onClick={() => this.handleClick('9')}>9</button>
          <button onClick={() => this.handleClick('*')}>*</button>
          <button onClick={() => this.handleClick('0')}>0</button>
          <button onClick={() => this.handleClick('%')}>%</button>
          <button onClick={this.handleClear}>C</button>
          <button onClick={this.handleCalculate}>=</button>
          <button onClick={() => this.handleClick('/')}>/</button>
        </div>
      </div>
    );
  }
}

export default Calculator;
