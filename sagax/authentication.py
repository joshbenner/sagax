from abc import ABC, abstractmethod

from configmanager import Section


class AuthenticationBackend(ABC):
    config_section = 'authentication'
    config_schema = Section(section='authentication')
    config = None

    @abstractmethod
    def authenticate(self, username, password) -> dict or False:
        raise NotImplemented


class NoAuth(AuthenticationBackend):
    def authenticate(self, username, password):
        return {'username': 'anonymous', 'email': ''}


class StaticAuth(AuthenticationBackend):
    config_section = 'static_auth'
    config_schema = {
        'users': Section()
    }

    def authenticate(self, username, password):
        users = {u.lower(): p
                 for u, p in self.config.static_auth.users.get().items()}
        if username.lower() in users and users[username] == password:
            return {'username': username.lower(), 'email': ''}
