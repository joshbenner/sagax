sagax
=====

Sensu dashboard.


Basic Install
-------------

Basic install

.. code-block:: bash

    pip install sagax

Run hug's built-in development server

.. code-block:: bash

    SAGAX_CONFIG_FILE=/path/to/config.yml hug -m sagax.api

Production Install
------------------

Install with Cython-compiled Falcon, to be served by Gunicorn, with LDAP
authentication.

.. code-block:: bash

    pip install cython gunicorn
    pip install --no-binary falcon sagax[ldap]

Then, you can run the web server:

.. code-block:: bash

    SAGAX_CONFIG_FILE=/path/to/config.yml gunicorn -w 4 sagax.api:__hug_wsgi__

Configuration
-------------

Set the environment variable ``SAGAX_CONFIG_FILE`` to point at the path of a YAML
file containing any config overrides.

Example configuration file:

.. code-block:: yaml

    # Sensu configuration must be provided (no defaults).
    sensu_type: Sensu1API
    sensu:
      url: https://sensu.example.com
      insecure: true
      timeout: 5

    # Defaults to NO AUTHENTICATION. Here is LDAP example.
    require_authentication: true
    authentication_type: ldap
    ldap:
      url: ldaps://ldap.example.com
      user_pattern: uid={},ou=Users,dc=example,dc=com
      require_groups:
        - operations

    # Defaults shown here.
    jwt:
      secret_key: overrideme!
      issuer: sagax
      algorithm: HS256
      ttl: 1209600

    # All of these settings are sent to the frontend UI, so be sure not to put
    # anything sensitive in here.
    frontend:
      extra_css:
        - http://example.com/custom-sagax-styles.css
      timestamp_format: L LT z
      refresh_interval: 5
      silence_intervals:
        - 15 minutes
        - 30 minutes
        - 1 hour
        - 2 hours
        - 4 hours
        - 8 hours
        - 1 day
      # Table fields can be overridden here. See config.py for defaults.
      fields: {}

Building
--------

Build prerequisites:

1. `yarn`_
2. Python 3.5+

To build:

.. code-block:: bash

    git clone https://github.com/joshbenner/sagax.git
    cd sagax
    python setup.py bdist_wheel

.. _yarn: https://yarnpkg.com/lang/en/docs/install
