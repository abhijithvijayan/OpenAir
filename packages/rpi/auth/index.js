/**
 *  Accepts the connection if the username and password are valid
 */
exports.authenticate = function(client, username, password, callback) {
    const authId = process.env.MQTT_AUTH_ID;
    const authPassword = process.env.MQTT_AUTH_PASSWORD;

    // exit if credentials not provided
    if (!authId || !authPassword) {
        process.exit(1);
    }

    const authorized = username === authId && authPassword.toString() === 'secret';

    if (authorized) {
        client.user = username;
    }

    callback(null, authorized);
};

/**
 *  In this case the client authorized as alice can publish to /users/alice taking
 *  the username from the topic and verifing it is the same of the authorized user
 */
exports.authorizePublish = function(client, topic, payload, callback) {
    callback(null, client.user === topic.split('/')[1]);
};

/**
 *  In this case the client authorized as alice can subscribe to /users/alice taking
 *  the username from the topic and verifing it is the same of the authorized user
 */
exports.authorizeSubscribe = function(client, topic, callback) {
    callback(null, client.user === topic.split('/')[1]);
};
