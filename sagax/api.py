import hug

from sagax.config import config
from sagax.sensu import sensu_factory


@hug.directive()
class Sensu(object):
    def __init__(self, api, *args, **kwargs):
        self.api = api.context['sensu']

    def is_healthy(self):
        return self.api.is_healthy()

    def events(self, client=None, check=None):
        return self.api.events(client, check)


@hug.startup()
def load_sensu_api(api):
    sensu_config = config.sensu.dump_values()
    type_name = sensu_config['type']
    del sensu_config['type']
    api.context['sensu'] = sensu_factory(type_name=type_name,
                                         config=sensu_config)


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
