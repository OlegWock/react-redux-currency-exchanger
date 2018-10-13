import React, { Component } from 'react';
import styles from './Calculator.module.scss';
import { connect } from 'react-redux';
import CalcButton from './CalcButton';
import Select from 'react-select';
import { currenciesCodesList } from '../utils/currencies';
import API from '../utils/api';
import numeral from 'numeral';
import parse from '../utils/parser';


class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expression: "",
            error: false,
            result_currency: "USD",
            result: 0
        };

        this.api = new API();

        this.selectOptions = currenciesCodesList.map((el) => {
            return {value: el, label: el};
        });

        this.inputRef = React.createRef();

        this.addToExpression = this.addToExpression.bind(this);
        this.loadExample = this.loadExample.bind(this);

    }

    addToExpression(action) {
        return (e) => {
            let node = this.inputRef.current;
            let cursor = node.selectionStart;
            let exp = this.state.expression;
            this.setState({
                expression: [exp.slice(0, cursor), action, exp.slice(cursor)].join('')
            }, () => {
                this.inputRef.current.focus();
                node.selectionStart = node.selectionEnd = cursor + 1;
            });
        }

    }


    handleExpressionChange(e) {
        let val = e.target.value.toUpperCase();
        this.setState({expression: val})
    }

    handleResultCurrencyChange({ value }) {
        this.setState({result_currency: value}, () => {
            let valid = this.calculate();
            if (!valid) {
                this.setState({result: 0});
            }
        });
    }

    calculate() {
        let {valid, tokens} = parse(this.state.expression, this.state.result_currency);
        if (!valid) {
            this.setState({error: true});
            setTimeout(() => this.setState({error: false}), 500);
            return false;
        }

        let resultExp = '';

        for (let token of tokens) {
            if (token.type === 'number' && token.currency !== this.state.result_currency) {
                token.value = this.api.convert(parseFloat(token.value), token.currency, this.state.result_currency).toString();
            }

            resultExp += token.value;
        }

        console.log('Result exp');
        console.log(resultExp);

        // eslint-disable-next-line
        let result = eval(resultExp);

        result = Math.round(result * 10000) / 10000;

        this.setState({ result });

        return true;
    }

    loadExample(arg) {
        this.setState(arg, this.calculate)
    }

    clearResult = () => this.setState({expression: '', result: 0});

    render() {
        return <div className={styles.Calculator}>
            <div className={styles.examples}>
                <span onClick={() => this.loadExample({expression: '(45$ * 25 * 0.8) - 2EUR', result_currency: "JPY"})} className={styles.example}>Load example</span>
            </div>
            <div className={`${styles.inputs} ${this.state.error ? styles.error : ''}`}>
                <input type="text" className={styles.exppression}
                       value={this.state.expression}
                       onChange={this.handleExpressionChange.bind(this)}
                       ref={this.inputRef}
                />
                <Select options={this.selectOptions}
                        value={this.selectOptions.filter((el) => el.value === this.state.result_currency)[0]}
                        onChange={this.handleResultCurrencyChange.bind(this)}
                        className={styles.result_currency}
                />
            </div>

            <div className={styles.result}>
                = {numeral(this.state.result).format('0,0.0000')} {this.state.result_currency}
            </div>

            <div className={styles.buttons}>
                <div className={styles.row}>
                    <CalcButton />
                    <CalcButton onClick={this.addToExpression('(')}>(</CalcButton>
                    <CalcButton onClick={this.addToExpression(')')}>)</CalcButton>
                    <CalcButton onClick={this.clearResult}>AC</CalcButton>
                </div>
                <div className={styles.row}>
                    <CalcButton onClick={this.addToExpression('7')}>7</CalcButton>
                    <CalcButton onClick={this.addToExpression('8')}>8</CalcButton>
                    <CalcButton onClick={this.addToExpression('9')}>9</CalcButton>
                    <CalcButton onClick={this.addToExpression('/')}>÷</CalcButton>
                </div>
                <div className={styles.row}>
                    <CalcButton onClick={this.addToExpression('4')}>4</CalcButton>
                    <CalcButton onClick={this.addToExpression('5')}>5</CalcButton>
                    <CalcButton onClick={this.addToExpression('6')}>6</CalcButton>
                    <CalcButton onClick={this.addToExpression('*')}>×</CalcButton>
                </div>
                <div className={styles.row}>
                    <CalcButton onClick={this.addToExpression('1')}>1</CalcButton>
                    <CalcButton onClick={this.addToExpression('2')}>2</CalcButton>
                    <CalcButton onClick={this.addToExpression('3')}>3</CalcButton>
                    <CalcButton onClick={this.addToExpression('-')}>-</CalcButton>
                </div>
                <div className={styles.row}>
                    <CalcButton onClick={this.addToExpression('0')}>0</CalcButton>
                    <CalcButton onClick={this.addToExpression('.')}>.</CalcButton>
                    <CalcButton onClick={this.calculate.bind(this)}>=</CalcButton>
                    <CalcButton onClick={this.addToExpression('+')}>+</CalcButton></div>
            </div>
        </div>;
    }

}

const mapStateToProps = store => {
    return {
        rates: store.rates.data,
        updated_at: store.rates.updated_at
    }
};


export default connect(mapStateToProps)(Calculator);