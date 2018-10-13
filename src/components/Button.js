import React, { Component } from 'react';
import styles from './Button.module.scss';
import PropTypes from 'prop-types';


class Button extends Component {
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
            <div className={styles.Button} onClick={this.handleClick.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

Button.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

Button.defaultProps = {
    disabled: false,
    onClick: () => {}
};


export default Button;