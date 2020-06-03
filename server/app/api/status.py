from app.api import bp


@bp.route('/api/v1')
def index():
    return {
        'response': {
            'statusCode': 200,
            'statusText': 'OK'
        },
        'data': {
            'status': True,
            'message': 'API Works'
        }
    }
