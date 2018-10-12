import React, { Component } from 'react';
import styles from './App.module.scss';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
        <div className={styles.App}>
        </div>
    );
  }
}


const mapStateToProps = store => {
    return {
        store: store,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
