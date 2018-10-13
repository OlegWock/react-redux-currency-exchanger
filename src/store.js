import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle';
import rootReducer from './reducers';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('RX_CALCULATOR');
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return initialState;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('RX_CALCULATOR', serializedState);
    } catch {

    }
};

const initialState = {
    rates: {
        data: {},
        updated_at: 0,
    }
};
const enhancers = [];
const middleware = [
    thunk,
];

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    rootReducer,
    loadState(),
    composedEnhancers
);

store.subscribe(throttle(() => {
    saveState(store.getState());
}));

export default store;