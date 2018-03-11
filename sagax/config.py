import os
import urllib3

from configmanager import Config, Item

urllib3.disable_warnings()

settings_schema = {
    'frontend': {
        'timestamp_format': Item(default='YYYY-MM-DD HH:mm:ss z', envvar=True),
        'refresh_interval': 5,
        'fields': {
            'event_list': [
                {'label': 'Client', 'key': 'client.name'},
                {'label': 'Check', 'key': 'check.name'},
                {'label': 'Output', 'key': 'check.output'},
                {'label': 'Occurrences', 'key': 'occurrences'},
                {'label': 'Last Occurrence', 'key': 'timestamp',
                 'formatter': 'timeAgo'},
                {'label': 'Last OK', 'key': 'last_ok',
                 'formatter': 'timeAgo'}
            ],
            'client_list': [
                {'label': 'Name', 'key': 'name'},
                {'label': 'IP', 'key': 'address'},
                {'label': 'Version', 'key': 'version'},
                {'label': 'Last keepalive', 'key': 'timestamp',
                 'formatter': 'timeAgo'}
            ]
        }
    },
    'sensu': {
        'type': Item(default='Sensu1API', envvar=True),
        'url': Item(default='http://127.0.0.1:4567', envvar=True),
        'insecure': Item(default=False, envvar=True, type=bool),
        'timeout': Item(default=5, envvar=True, type=int)
    }
}
config_file_locations = [
    '/etc/sagax/settings.yml',
    '~/.config/sagax/settings.yml'
]
if 'SAGAX_CONFIG_FILE' in os.environ:
    config_file_locations.append(os.environ.get('SAGAX_CONFIG_FILE'))


config = Config(
    schema=settings_schema,
    load_sources=config_file_locations,
    auto_load=True
)
