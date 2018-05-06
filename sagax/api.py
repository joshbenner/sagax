from pkg_resources import resource_filename, Requirement

import hug
from falcon import get_http_status

from sagax.config import config
from sagax.plugins import plugin_class_factory
from sagax.tokens import issue_token, verify_token
from sagax.middleware import CORSMiddleware

_pkg = Requirement('sagax')
ui_path = resource_filename(_pkg, 'sagax-frontend/dist')
static_path = resource_filename(_pkg, 'sagax-frontend/dist/static')

api_ = hug.API(__name__)
api_.http.add_middleware(CORSMiddleware(api_))


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


@hug.directive()
class Sensu(object):
    """Wrap Sensu API, injectable as directive."""
    def __init__(self, api, *args, **kwargs):
        self.api = api.context['sensu']

    def is_healthy(self):
        return self.api.is_healthy()

    def events(self, client=None, check=None):
        return self.api.events(client, check)

    def checks(self):
        return self.api.checks()

    def clients(self):
        return self.api.clients()

    def delete_client(self, client_name: str):
        return self.api.delete_client(client_name)

    def silenced(self):
        return self.api.silenced()

    def create_silenced(self, silenced):
        return self.api.create_silenced(silenced)

    def clear_silenced(self, silence_ids):
        return self.api.clear_silenced(silence_ids)

    def results(self, client_name=None):
        return self.api.results(client_name)

    def delete_result(self, client_name: str, check_name: str):
        return self.api.delete_result(client_name, check_name)

    def resolve_event(self, client_name: str, check_name: str):
        return self.api.resolve_event(client_name, check_name)

    def request_check(self, check_name: str, subscribers: list, creator: str,
                      reason: str):
        return self.api.request_check(check_name, subscribers, creator, reason)

    def aggregates(self, detailed: bool=False):
        aggregates = self.api.aggregates()
        if detailed:
            for aggregate in aggregates:
                status, data = self.api.aggregate(aggregate['name'])
                if 200 <= status < 300:
                    aggregate.update(data)
        return aggregates

    def aggregate(self, aggregate_name: str):
        return self.api.aggregate(aggregate_name)

    def aggregate_detail(self, aggregate_name: str):
        return self.api.aggregate_detail(aggregate_name)


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


@hug.post('/auth')
def post_auth(authn: AuthN, request, response, username=None, password=None):
    claims = authn.authenticate(username, password)
    if isinstance(claims, dict):
        response.set_header('Content-Type', 'application/jwt')
        return issue_token(claims)
    else:
        response.status = hug.HTTP_401
        response.set_header('WWW-Authenticate', 'Sagax')
        return {'error': 'Authentication failed'}


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
def get_refresh(sensu: Sensu, results_client: hug.types.text=None,
                detailed_aggregates: int=0, full_aggregate: str=None):
    data = {
        'events': sensu.events(),
        'clients': sensu.clients(),
        'silenced': sensu.silenced(),
        'checks': sensu.checks(),
        'aggregates': sensu.aggregates(detailed=(detailed_aggregates > 0))
    }
    if results_client:
        data['results'] = sensu.results(results_client)
    if full_aggregate is not None:
        status, aggregate = sensu.aggregate_detail(full_aggregate)
        data['full_aggregate'] = aggregate
    return data


@hug.get('/events', requires=token_auth)
def get_events(sensu: Sensu, client: str=None, check: str=None):
    return sensu.events(client, check)


@hug.get('/clients', requires=token_auth)
def get_clents(sensu: Sensu):
    return sensu.clients()


@hug.delete('/clients/{client_name}', requires=token_auth)
def delete_client(sensu: Sensu, client_name: str, response):
    status_code, data = sensu.delete_client(client_name)
    response.status = get_http_status(status_code)
    return data


@hug.get('/silenced', requires=token_auth)
def get_silenced(sensu: Sensu):
    return sensu.silenced()


@hug.post('/silenced', requires=token_auth)
def post_silenced(sensu: Sensu, body, response):
    status_code, data = sensu.create_silenced(body)
    response.status = get_http_status(status_code)
    return data


@hug.post('/clear', requires=token_auth)
def clear_silenced(sensu: Sensu, body):
    responses = sensu.clear_silenced(body['ids'])
    return {'results': responses}


@hug.get('/results', requires=token_auth)
def results(sensu: Sensu):
    return sensu.results()


@hug.get('/results/{client_name}', requires=token_auth)
def results(sensu: Sensu, client_name: str):
    return sensu.results(client_name)


@hug.delete('/results/{client_name}/{check_name}', requires=token_auth)
def delete_result(sensu: Sensu, client_name: str, check_name: str, response):
    status_code, data = sensu.delete_result(client_name, check_name)
    response.status = get_http_status(status_code)
    return data


@hug.post('/resolve', requires=token_auth)
def post_resolve(sensu: Sensu, body, response):
    status_code, data = sensu.resolve_event(body['client'], body['check'])
    response.status = get_http_status(status_code)
    return data


@hug.post('/request', requires=token_auth)
def post_request(sensu: Sensu, body, response, request):
    creator = request.context['user']['username']
    status_code, data = sensu.request_check(body['check'], body['subscribers'],
                                            creator, body['reason'])
    response.status = get_http_status(status_code)
    return data


@hug.get('/aggregates', requires=token_auth)
def get_aggregates(sensu: Sensu, detail: int=0):
    return sensu.aggregates(detailed=(detail > 0))


@hug.get('/aggregates/{aggregate_name}', requires=token_auth)
def get_aggregate(sensu: Sensu, aggregate_name: str, response):
    status_code, data = sensu.aggregate(aggregate_name)
    response.status = get_http_status(status_code)
    return data


@hug.get('/aggregates/{aggregate_name}/detail', requires=token_auth)
def get_aggregate_detail(sensu: Sensu, aggregate_name: str, response):
    status_code, data = sensu.aggregate_detail(aggregate_name)
    response.status = get_http_status(status_code)
    return data
