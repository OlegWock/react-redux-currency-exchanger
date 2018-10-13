import React, { Component } from 'react';
import styles from './CalcButton.module.scss';
import PropTypes from 'prop-types';


class CalcButton extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    handleClick(e) {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }


    render() {
        return (
            <div className={styles.CalcButton} onClick={this.handleClick.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

CalcButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

CalcButton.defaultProps = {
    disabled: false,
    onClick: () => {}
};


export default CalcButton;