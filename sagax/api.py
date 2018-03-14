import pkg_resources

import hug
from falcon import get_http_status

from sagax.config import config
from sagax.plugins import plugin_class_factory
from sagax.tokens import issue_token, verify_token

ui_path = pkg_resources.resource_filename('sagax', 'frontend/dist')
static_path = pkg_resources.resource_filename('sagax', 'frontend/dist/static')

api_ = hug.API(__name__)
api_.http.add_middleware(hug.middleware.CORSMiddleware(api_))


def token_auth(request, response, **kwargs):
    if not config.require_authentication.get():
        request.context['user'] = {'username': 'anonymous'}
        return True
    header = request.get_header('Authorization')
    if not header:
        raise hug.HTTPUnauthorized('Authentication Required',
                                   'No Authorization header')
    schema, _, encoded_token = header.partition(' ')
    if schema.lower() != 'bearer':
        raise hug.HTTPUnauthorized('Invalid Authentication',
                                   'Authorization schema must be Bearer')
    try:
        token = verify_token(encoded_token)
    except Exception as e:
        raise hug.HTTPUnauthorized('Invalid Authentication', str(e))
    request.context['user'] = token
    return True


@hug.format.content_type('application/jwt')
def jwt_content_type(content, **kwargs):
    return content


@hug.directive()
class Sensu(object):
    def __init__(self, api, *args, **kwargs):
        self.api = api.context['sensu']

    def is_healthy(self):
        return self.api.is_healthy()

    def events(self, client=None, check=None):
        return self.api.events(client, check)

    def clients(self):
        return self.api.clients()

    def silenced(self):
        return self.api.silenced()

    def create_silenced(self, silenced):
        return self.api.create_silenced(silenced)

    def results(self):
        return self.api.results()


@hug.directive()
class AuthN(object):
    def __init__(self, api, *args, **kwargs):
        self.backend = api.context['authentication']

    def authenticate(self, username, password):
        return self.backend.authenticate(username, password)


@hug.startup()
def load_sensu_api(api):
    type_name = config.sensu_type.get()
    api.context['sensu'] = plugin_class_factory('sagax_sensu',
                                                class_name=type_name,
                                                config=config)


@hug.startup()
def load_authentication_backend(api):
    type_name = config.authentication_type.get()
    authn = plugin_class_factory('sagax_authentication', class_name=type_name,
                                 config=config)
    authn.config = config
    api.context['authentication'] = authn


@hug.post('/auth', output=jwt_content_type)
def post_auth(authn: AuthN, request, response, username=None, password=None):
    claims = authn.authenticate(username, password)
    if isinstance(claims, dict):
        return issue_token(claims)
    else:
        response.status = hug.HTTP_401
        return ''


@hug.static('/ui')
def ui():
    return ui_path,


@hug.static('/static')
def static():
    return static_path,


@hug.get('/health')
def get_health(sensu: Sensu):
    return {
        'sagax': 'ok',
        'sensu': 'ok' if sensu.is_healthy() else 'NOT OK'
    }


@hug.get('/config')
def get_frontend_config():
    values = config.frontend.dump_values()
    values['require_authentication'] = config.require_authentication.get()
    return values


@hug.get('/refresh', requires=token_auth)
def get_refresh(sensu: Sensu):
    return {
        'events': sensu.events(),
        'clients': sensu.clients(),
        'silenced': sensu.silenced()
    }


@hug.get('/events', requires=token_auth)
def get_events(sensu: Sensu, client: str=None, check: str=None):
    return sensu.events(client, check)


@hug.get('/clients', requires=token_auth)
def get_clents(sensu: Sensu):
    return sensu.clients()


@hug.get('/silenced', requires=token_auth)
def get_silenced(sensu: Sensu):
    return sensu.silenced()


@hug.post('/silenced', requires=token_auth)
def post_silenced(sensu: Sensu, body, response):
    status_code, data = sensu.create_silenced(body)
    response.status = get_http_status(status_code)
    return data


@hug.get('/results', requires=token_auth)
def results(sensu: Sensu):
    return sensu.results()
