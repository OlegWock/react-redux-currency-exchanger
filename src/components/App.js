import React, { Component } from 'react';
import styles from './App.module.scss';
import { connect } from 'react-redux';
import API from '../utils/api';
import { currenciesCodesList } from '../utils/currencies';
import { fetchRates } from "../actions/rates";
import Converter from './Converter';
import Button from "./Button";
import Calculator from "./Calculator";
import { FaHeart } from 'react-icons/fa';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_mode: 'converter'
        };
        this.api = new API();
    }

    switchToCalculator = () => this.setState({current_mode: 'calculator'});
    switchToConverter = () => this.setState({current_mode: 'converter'});

    componentDidMount() {
        this.checkerTimerId = setInterval(this.checkRates.bind(this), 1000 * 60 * 2);
        this.checkRates.call(this);
    }

    componentWillUnmount() {
        clearInterval(this.checkerTimerId);
    }

    checkRates() {
        if ((Date.now() - this.props.ratesUpdatedAt) > 1000 * 60 * 60 * 18) {
            this.props.fetchRates(this.api, currenciesCodesList);
        }
    }


    render() {
        let mainComponent;
        let switchButton;

        if (this.state.currentMode === 'converter') {
            mainComponent = <Converter />;
            switchButton = <Button onClick={this.switchToCalculator}>
                Switch to calculator
            </Button>;
        } else {
            mainComponent = <Calculator />;
            switchButton = <Button onClick={this.switchToConverter}>
                Switch to converter
            </Button>;
        }


        return (
            <div className={styles.App}>
                <main>
                    <div className={styles.heading}>
                        <span>{this.state.current_mode}</span>
                        {switchButton}
                    </div>

                    {mainComponent}

                    <div className={styles.built_by}>Made with <FaHeart className={styles.heart} /> by <a
                        href="https://github.com/OlegWock" target="_blank" rel="noopener noreferrer">OlegWock</a> using
                        React. Check out source code <a href="https://github.com/OlegWock/react-redux-currency-exchanger"
                                                 rel="noopener noreferrer" target="_blank">here</a>.</div>
                </main>
            </div>
        );
    }
}


const mapStateToProps = store => {
    return {
        ratesUpdatedAt: store.rates.updated_at,
    }
};

export default connect(mapStateToProps, { fetchRates })(App);
