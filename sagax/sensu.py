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
    def delete_client(self, client_name: str):
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
    def results(self, client_name: str=None) -> list:
        raise NotImplemented()

    @abstractmethod
    def delete_result(self, client_name: str, check_name: str):
        raise NotImplemented()

    @abstractmethod
    def resolve_event(self, client_name: str, check_name: str):
        raise NotImplemented()

    @abstractmethod
    def request_check(self, check_name: str, subscribers: list, creator: str,
                      reason: str):
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

    def delete_client(self, client_name: str):
        r = self.delete('/clients/{}'.format(client_name))
        return r.status_code, r.data

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

    def results(self, client_name: str=None) -> list:
        if client_name is None:
            r = self.get('/results')
        else:
            r = self.get('/results/{}'.format(client_name))
        return r.data

    def delete_result(self, client_name: str, check_name: str):
        r = self.delete('/results/{}/{}'.format(client_name, check_name))
        return r.status_code, r.data

    def resolve_event(self, client_name: str, check_name: str):
        r = self.post('/resolve', client=client_name, check=check_name)
        return r.status_code, r.data

    def request_check(self, check_name: str, subscribers: list, creator: str,
                      reason: str):
        r = self.post('/request', check=check_name, subscribers=subscribers,
                      creator=creator, reason=reason)
        return r.status_code, r.data
