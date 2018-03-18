from abc import ABC, abstractmethod

import urllib3
from hug.use import HTTP
from configmanager import Item

urllib3.disable_warnings()


class SensuAPI(ABC):
    """
    An upstream Sensu API.
    """
    config_section = 'sensu'
    config_schema = {}

    @abstractmethod
    def is_healthy(self) -> bool:
        raise NotImplemented()

    @abstractmethod
    def events(self, client: str=None, check: str=None) -> list:
        raise NotImplemented()

    @abstractmethod
    def clients(self) -> list:
        raise NotImplemented()

    @abstractmethod
    def silenced(self) -> list:
        raise NotImplemented()

    @abstractmethod
    def create_silenced(self, silence) -> tuple:
        raise NotImplemented()

    @abstractmethod
    def clear_silenced(self, silence_ids) -> list:
        raise NotImplemented()

    @abstractmethod
    def results(self) -> list:
        raise NotImplemented()


class Sensu1API(SensuAPI, HTTP):
    """
    Sensu 1.x API
    """
    config_schema = {
        'url': Item(default='http://127.0.0.1:4567', envvar=True),
        'insecure': Item(default=False, envvar=True, type=bool),
        'timeout': Item(default=5, envvar=True, type=int)
    }

    def __init__(self, url, insecure=False, timeout=5):
        super(Sensu1API, self).__init__(url, timeout=timeout)
        if insecure:
            self.session.verify = False

    def is_healthy(self) -> bool:
        r = self.get('/health')
        return r.status_code == 204

    def events(self, client: str=None, check: str=None) -> list:
        path = '/events/{}/{}'.format(client or '', check or '').rstrip('/')
        r = self.get(path)
        return r.data

    def clients(self) -> list:
        r = self.get('/clients')
        return r.data

    def silenced(self) -> list:
        r = self.get('/silenced')
        return r.data

    def create_silenced(self, silenced):
        r = self.post('/silenced', **silenced)
        return r.status_code, r.data

    def clear_silenced(self, silence_ids):
        responses = []
        for silence_id in silence_ids:
            r = self.post('/silenced/clear', id=silence_id)
            responses.append(dict(id=silence_id, status=r.status_code,
                                  data=r.data))
        return responses

    def results(self) -> list:
        r = self.get('/results')
        return r.data
