export default (middleware, sagas = {}) => {
    // run the saga
    for (const name in sagas) {
        middleware.run(sagas[name]);
    }
};
