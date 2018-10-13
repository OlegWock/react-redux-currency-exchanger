export const fetchRates = (api, currencies) => {
    return async (dispatch, getState) => {
        let rates = await api.updateRates(currencies);
        dispatch(setRates(rates));
    };
};

export const setRates = (rates) => {
    return {
        type: 'SET_RATES',
        payload: rates
    }
};