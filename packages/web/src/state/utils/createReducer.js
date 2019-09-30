export default initialState => {
    return reducerMap => {
        return (state = initialState, action) => {
            const reducer = reducerMap[action.type];
            return reducer ? reducer(state, action) : state;
        };
    };
};
