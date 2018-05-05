import os

from configmanager import Config, Item

from sagax.plugins import get_plugin_class

settings_schema = {
    'frontend': {
        'extra_css': [],
        'timestamp_format': Item(default='L LT z', envvar=True),
        'refresh_interval': 5,
        'silence_intervals': [
            '15 minutes',
            '30 minutes',
            '1 hour',
            '2 hours',
            '4 hours',
            '8 hours',
            '1 day'
        ],
        'silence_interval_default': '2 hours',
        'fields': {
            'event_list': [
                {
                    'label': 'Client',
                    'key': 'client.name',
                    'formatter': 'clientName',
                    'sortable': True
                },
                {
                    'label': 'Check',
                    'key': 'check.name',
                    'formatter': 'checkName',
                    'sortable': True
                },
                {
                    'label': 'Status',
                    'key': 'check.status',
                    'formatter': 'checkStatus',
                    'sortable': True,
                    'defaultSort': 'desc'
                },
                {
                    'label': 'Output',
                    'key': 'check.output'
                },
                {
                    'label': 'Occurrences',
                    'key': 'occurrences',
                    'sortable': True
                },
                {
                    'label': 'Last Occurrence',
                    'key': 'timestamp',
                    'formatter': 'timeAgo',
                    'sortable': True
                },
                {
                    'label': 'Last OK',
                    'key': 'last_ok',
                    'formatter': 'timeAgo',
                    'sortable': True
                }
            ],
            'client_list': [
                {
                    'label': 'Name',
                    'key': 'name',
                    'formatter': 'clientName',
                    'sortable': True
                },
                {
                    'label': 'Events',
                    'key': 'event_count',
                    'formatter': 'clientEventList',
                    'sortable': True,
                    'defaultSort': 'desc'
                },
                {
                    'label': 'IP',
                    'key': 'address',
                    'sortable': True
                },
                {
                    'label': 'Version',
                    'key': 'version',
                    'sortable': True
                },
                {
                    'label': 'Last keepalive',
                    'key': 'timestamp',
                    'formatter': 'timeAgo',
                    'sortable': True
                }
            ],
            'client_detail': [
                {
                    'label': 'IP Address',
                    'key': 'address'
                },
                {
                    'label': 'Client version',
                    'key': 'version'
                },
                {
                    'label': 'Last keepalive',
                    'key': 'timestamp',
                    'formatter': 'timeAgo'
                },
                {
                    'label': 'Silenced',
                    'key': 'name',
                    'formatter': 'clientIsSilenced'
                },
                {
                    'label': 'Subscriptions',
                    'key': 'subscriptions',
                    'formatter': 'unorderedList'
                }
            ],
            'result_list': [
                {
                    'label': 'Check',
                    'key': 'check.name',
                    'formatter': 'checkName',
                    'sortable': True,
                    'defaultSort': 'asc'
                },
                {
                    'label': 'Output',
                    'key': 'check.output',
                    'sortable': True
                },
                {
                    'label': 'Last check',
                    'key': 'check.executed',
                    'sortable': True,
                    'formatter': 'timeAgo'
                }
            ],
            'result_detail_result': [
                {
                    'label': 'Check name',
                    'key': 'check.name'
                },
                {
                    'label': 'Command',
                    'key': 'check.command',
                    'formatter': 'copyable'
                },
                {
                    'label': 'Output',
                    'key': 'check.output'
                },
                {
                    'label': 'Status',
                    'key': 'check.status',
                    'formatter': 'statusPill'
                },
                {
                    'label': 'Interval',
                    'key': 'check.interval'
                },
                {
                    'label': 'TTL',
                    'key': 'check.ttl'
                },
                {
                    'label': 'Timeout',
                    'key': 'check.timeout'
                },
                {
                    'label': 'Issued',
                    'key': 'check.issued',
                    'formatter': 'timestamp'
                },
                {
                    'label': 'Executed',
                    'key': 'check.executed',
                    'formatter': 'timestamp'
                },
                {
                    'label': 'Duration',
                    'key': 'check.duration'
                },
                {
                    'label': 'Standalone',
                    'key': 'check.standalone'
                },
                {
                    'label': 'Subscribers',
                    'key': 'check.subscribers',
                    'formatter': 'unorderedList'
                },
                {
                    'label': 'Change',
                    'key': 'check.history',
                    'formatter': 'changePercentage'
                }
            ],
            'result_detail_event': [
                {
                    'label': 'ID',
                    'key': 'id',
                    'formatter': 'copyable'
                },
                {
                    'label': 'Occurrences',
                    'key': 'occurrences'
                },
                {
                    'label': 'Last OK',
                    'key': 'last_ok',
                    'formatter': 'timeAgo'
                },
                {
                    'label': 'Last Change',
                    'key': 'last_state_change',
                    'formatter': 'timeAgo'
                },
                {
                    'label': 'Silenced',
                    'key': 'silenced',
                    'formatter': 'yesno'
                }
            ],
            'subscription_check_list': [
                {
                    'label': 'Check Name',
                    'key': 'name',
                    'sortable': True,
                    'defaultSort': 'asc',
                    'formatter': 'bold'
                },
                {
                    'label': 'Command',
                    'key': 'command',
                    'sortable': True
                },
                {
                    'label': 'Subscribers',
                    'key': 'subscribers',
                    'formatter': 'commaList'
                },
                {
                    'label': 'Interval',
                    'key': 'interval',
                    'sortable': True
                }
            ],
            'silenced_list': [
                {
                    'label': 'Subscription',
                    'key': 'subscription',
                    'formatter': 'silenceIdPart',
                    'sortable': True,
                    'defaultSort': 'asc'
                },
                {
                    'label': 'Check',
                    'key': 'check',
                    'formatter': 'silenceIdPart',
                    'sortable': True
                },
                {
                    'label': 'Reason',
                    'key': 'reason'
                },
                {
                    'label': 'Creator',
                    'key': 'creator',
                    'sortable': True
                },
                {
                    'label': 'Created',
                    'key': 'timestamp',
                    'formatter': 'timeAgo',
                    'sortable': True
                },
                {
                    'label': 'Expires',
                    'key': 'expire',
                    'formatter': 'silenceExpire',
                    'sortable': True
                }
            ],
            'unsilence_list': [
                {
                    'label': 'ID',
                    'key': 'id'
                },
                {
                    'label': 'Reason',
                    'key': 'reason'
                },
                {
                    'label': 'Creator',
                    'key': 'creator'
                },
                {
                    'label': 'Created',
                    'key': 'timestamp',
                    'formatter': 'timeAgo'
                },
                {
                    'label': 'Expires',
                    'key': 'expire',
                    'formatter': 'silenceExpire'
                }
            ],
            'aggregates_list': [
                {
                    'label': 'Aggregate Name',
                    'key': 'name',
                    'formatter': 'aggregateName',
                    'sortable': True,
                    'defaultSort': 'asc'
                },
                {
                    'label': 'Checks',
                    'key': 'checks',
                    'sortable': True
                },
                {
                    'label': 'Clients',
                    'key': 'clients',
                    'sortable': True
                },
                {
                    'label': 'States',
                    'key': 'results',
                    'formatter': 'aggregateStates'
                }
            ],
            'aggregate_detail': [
                {
                    'label': 'Status of Aggregate',
                    'key': 'counts.results',
                    'formatter': 'aggregateStates'
                },
                {
                    'label': 'Checks in Aggregate',
                    'key': 'counts.checks'
                },
                {
                    'label': 'Clients in Aggregate',
                    'key': 'counts.clients'
                }
            ],
            'aggregate_result_list': [
                {
                    'label': 'Client',
                    'key': 'client',
                    'formatter': 'clientName',
                    'sortable': True,
                    'defaultSort': 'asc'
                },
                {
                    'label': 'Status',
                    'key': 'status',
                    'formatter': 'checkStatus',
                    'sortable': True
                },
                {
                    'label': 'Output',
                    'key': 'output',
                    'sortable': True
                }
            ]
        }
    },
    'jwt': {
        'secret_key': Item(default='overrideme!', envvar=True),
        'issuer': Item(default='sagax', envvar=True),
        'algorithm': Item(default='HS256', envvar=True),
        'ttl': Item(default=1209600, envvar=True, type=int)
    },
    'sensu_type': Item(default='Sensu1API', envvar=True),
    'authentication_type': Item(default='NoAuth', envvar=True),
    'require_authentication': False
}

configurable_plugin_classes = {
    'sagax_sensu': 'sensu_type',
    'sagax_authentication': 'authentication_type'
}

config_file_locations = [
    '/etc/sagax/settings.yml',
    '~/.config/sagax/settings.yml'
]
if 'SAGAX_CONFIG_FILE' in os.environ:
    config_file_locations.append(os.environ.get('SAGAX_CONFIG_FILE'))

# Load base config so we know which plugin classes to load schema for.
base_config = Config(
    schema=settings_schema,
    load_sources=config_file_locations,
    auto_load=True
)

# Add config schema from configured plugin classes.
for plugin_type, config_key in configurable_plugin_classes.items():
    cls = get_plugin_class(plugin_type, base_config[config_key].get())
    settings_schema.update({cls.config_section: cls.config_schema})

config = Config(
    schema=settings_schema,
    load_sources=config_file_locations,
    auto_load=True
)
del base_config
