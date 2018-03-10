import pkg_resources

import hug

from sagax.config import config
from sagax.sensu import sensu_factory

ui_path = pkg_resources.resource_filename('sagax', 'frontend/dist')
static_path = pkg_resources.resource_filename('sagax', 'frontend/dist/static')

api = hug.API(__name__)
api.http.add_middleware(hug.middleware.CORSMiddleware(api))


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


@hug.startup()
def load_sensu_api(api):
    sensu_config = config.sensu.dump_values()
    type_name = sensu_config['type']
    del sensu_config['type']
    api.context['sensu'] = sensu_factory(type_name=type_name,
                                         config=sensu_config)


@hug.static('/ui')
def ui():
    return ui_path,


@hug.static('/static')
def static():
    return static_path,


@hug.get('/health')
def health(sensu: Sensu):
    return {
        'sagax': 'ok',
        'sensu': 'ok' if sensu.is_healthy() else 'NOT OK'
    }


@hug.get('/config')
def frontend_config():
    return config.frontend.dump_values()


@hug.get('/events')
def events(sensu: Sensu, client: str=None, check: str=None):
    return sensu.events(client, check)


@hug.get('/clients')
def clients(sensu: Sensu):
    return sensu.clients()
