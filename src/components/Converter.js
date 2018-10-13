import React, { Component } from 'react';
import styles from './Converter.module.scss';
import { connect } from 'react-redux';
import { FaExchangeAlt } from 'react-icons/fa';
import Select from 'react-select'
import {currenciesCodesList} from '../utils/currencies';
import API from '../utils/api';

class Converter extends Component {
    constructor(props) {
        super(props);

        this.api = new API();
        this.state = {
            from: 1,
            from_code: 'USD',
            to: this.api.convert(1, 'USD', 'UAH'),
            to_code: 'UAH',

            _swapHovered: false
        };

        this.selectOptions = currenciesCodesList.map((el) => {
            return {value: el, label: el};
        });


        this.calculate = this.calculate.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    }

    calculate(mode='from', e=null, fromExt=false) {
        let from, to;
        if (!fromExt) {
            if (!e.target.value) {
                this.setState({
                    from: 0,
                    to: 0
                });
                return;
            }
            if (mode === 'from') {
                from = parseFloat(e.target.value);
                to = this.api.convert(from, this.state.from_code, this.state.to_code);
            } else {
                to = parseFloat(e.target.value);
                from = this.api.convert(to, this.state.to_code, this.state.from_code);
            }
            this.setState({
                from,
                to
            });
        } else {
            to = this.api.convert(this.state.from, this.state.from_code, this.state.to_code);
            this.setState({
                to
            });
        }


    }

    handleCurrencyChange(which='from', {value}) {
        this.setState({
            [`${which}_code`]: value
        }, () => this.calculate(null, null, true));

    }

    swapValues() {
        this.setState({
            from: this.state.to,
            to: this.state.from,
            from_code: this.state.to_code,
            to_code: this.state.from_code
        });
    }



    render() {
        return (
            <div className={styles.Converter}>
                <div className={styles.row}>
                    <div className={styles.pair}>
                        <input value={this.state.from} type="number" min="0" step="1" onChange={(e) => this.calculate('from', e)}/>
                        <Select
                            className={styles.select}
                            options={this.selectOptions}
                            value={this.selectOptions.filter((e) => e.value === this.state.from_code)[0]}
                            onChange={(val) => this.handleCurrencyChange('from', val)}
                        />
                    </div>
                    <FaExchangeAlt
                        className={this.state._swapHovered ? `${styles.swap} ${styles.animated}` : styles.swap}
                        onClick={this.swapValues.bind(this)}
                        onMouseEnter={() => this.setState({_swapHovered: true})}
                        onMouseLeave={() => this.setState({_swapHovered: false})}
                    />
                    <div className={styles.pair}>
                        <input value={this.state.to} type="number" min="0" step="1" onChange={(e) => this.calculate('to', e)}/>
                        <Select
                            className={styles.select}
                            options={this.selectOptions}
                            value={this.selectOptions.filter((e) => e.value === this.state.to_code)[0]}
                            onChange={(val) => this.handleCurrencyChange('to', val)}
                        />
                    </div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = store => {
    return {
        rates: store.rates.data,
        updated_at: store.rates.updated_at
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Converter)
