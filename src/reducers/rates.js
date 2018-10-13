export default (state, action) => {

    if (action.type === 'SET_RATES') {
        return {
            data: {
                ...state.data,
                ...action.payload
            },
            updated_at: Date.now()
        }
    }

    return state || {};
};