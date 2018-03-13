from abc import ABC, abstractmethod

from configmanager import Section


class AuthenticationBackend(ABC):
    config_section = 'authentication'
    config_schema = Section(section='authentication')

    @abstractmethod
    def authenticate(self, request) -> dict or False:
        raise NotImplemented


class NoAuth(AuthenticationBackend):
    def authenticate(self, request):
        return {}
