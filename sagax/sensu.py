from abc import ABC, abstractmethod

from hug.use import HTTP

import sagax.plugins


class SensuAPI(ABC):
    """
    An upstream Sensu API.
    """
    @abstractmethod
    def is_healthy(self) -> bool:
        raise NotImplemented

    @abstractmethod
    def events(self, client: str=None, check: str=None) -> list:
        raise NotImplemented


class Sensu1API(SensuAPI, HTTP):
    """
    Sensu 1.x API
    """
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


sensu_types = sagax.plugins.get_entry_points('sagax_sensu')


def sensu_factory(type_name, config) -> SensuAPI:
    entry_point = sensu_types[type_name]
    cls = entry_point.load()
    return cls(**config)
