from flask import jsonify


def badrequest(message='BAD_REQUEST'):
    response = jsonify({
        'response': {
            'statusCode': 400,
            'statusText': message
        }
    })
    response.status_code = 400

    return response
