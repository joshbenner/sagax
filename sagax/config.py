import os

from configmanager import Config, Item

settings_schema = {
    'frontend': {
        'timestamp_format': Item(default='YYYY-MM-DD HH:mm:ss z', envvar=True),
        'fields': {
            'event_list': [
                {'name': 'Client', 'field': 'event.client.name'},
                {'name': 'Check', 'field': 'event.check.name'},
                {'name': 'Output', 'field': 'event.check.output'},
                {'name': 'Occurrences', 'field': 'event.occurrences'},
                {'name': 'Timestmap', 'field': 'event.timestamp',
                 'format': 'ago'},
                {'name': 'Last OK', 'field': 'event.last_ok', 'format': 'ago'}
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
