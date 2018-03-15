import ssl

import ldap3
import ldap3.core.exceptions
from ldap3.utils.dn import parse_dn
from configmanager import Item

import sagax.authentication
from sagax.logs import logger


class LDAPAuthentication(sagax.authentication.AuthenticationBackend):
    config_section = 'ldap'
    config_schema = {
        'url': Item(default='ldap://localhost', envvar=True, type=str),
        'user_pattern': Item(envvar=True, required=True, type=str),
        'email_attr': Item(default='mail', envvar=True, type=str),
        'member_attr': Item(default='memberOf', envvar=True, type=str),
        'require_groups': Item(default=[], envvar=True, type=list),
        'ssl_verify': Item(default=True, envvar=True, type=bool),
        'ca_certs_file': Item(default=None, envvar=True, type=str),
        'ca_certs_dir': Item(default=None, envvar=True, type=str)
    }

    def __init__(self, url, user_pattern, email_attr, member_attr,
                 require_groups, ssl_verify, ca_certs_file, ca_certs_dir):
        self.url = url
        self.user_pattern = user_pattern
        self.email_attr = email_attr
        self.member_attr = member_attr
        self.require_groups = [g.lower() for g in require_groups]
        self.ssl_verify = ssl_verify
        self.ca_certs_file = ca_certs_file
        self.ca_certs_dir = ca_certs_dir
        self._server = self._ldap_server()

    def _ldap_server(self):
        use_ssl = self.url.startswith('ldaps')
        tls = None
        if use_ssl:
            v = ssl.CERT_REQUIRED if self.ssl_verify else ssl.CERT_NONE
            tls = ldap3.Tls(validate=v,
                            ca_certs_file=self.ca_certs_file,
                            ca_certs_path=self.ca_certs_dir)
        return ldap3.Server(self.url, use_ssl=use_ssl, tls=tls)

    def _claims(self, username, conn):
        claims = {'username': username, 'email': ''}
        try:
            conn.search(conn.user, '(objectClass=*)', search_scope=ldap3.BASE,
                        attributes=[self.email_attr])
            response = conn.response
        except ldap3.core.exceptions.LDAPException as e:
            logger.warn('Failed to read LDAP user: {}'.format(e))
            response = []
        if response:
            claims['email'] = response[0]['attributes'][self.email_attr][0]
        return claims

    def authenticate(self, username, password):
        user_dn = self.user_pattern.format(username)
        try:
            conn = ldap3.Connection(self._server, user_dn, password,
                                    auto_bind=True)
        except ldap3.core.exceptions.LDAPException as e:
            logger.warn('Failed to bind to LDAP: {}'.format(e))
            return False
        attrs = [self.email_attr]
        if self.require_groups:
            attrs.append(self.member_attr)
        try:
            conn.search(conn.user, '(objectClass=*)', search_scope=ldap3.BASE,
                        attributes=attrs)
        except ldap3.core.exceptions.LDAPException as e:
            logger.warn('Failed to read LDAP attributes: {}'.format(e))
            return False
        result = conn.entries[0]
        if self.require_groups:
            granted = False
            for membership in getattr(result, self.member_attr).values:
                try:
                    rdns = parse_dn(membership)
                except ldap3.core.exceptions.LDAPInvalidDnError:
                    group = membership
                else:
                    group = rdns[0][1]
                if group.lower() in self.require_groups:
                    granted = True
                    break
            if not granted:
                logger.info('{} not in any required groups'.format(username))
                return False
        return {
            'username': username.lower(),
            'email': getattr(result, self.email_attr).values[0]
        }
