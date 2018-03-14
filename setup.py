from os import path
from setuptools import setup

tests_require = ['pytest']

here = path.abspath(path.dirname(__file__))
with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='sagax',
    use_scm_version=True,
    license='BSD',
    author='Josh Benner',
    author_email='josh@bennerweb.com',
    url='https://github.com/joshbenner/sagax',
    description='Sensu dashboard',
    long_description=long_description,
    setup_requires=['setuptools_scm'],
    tests_require=tests_require,
    extras_require={
        'test': tests_require
    },
    install_requires=[
        'hug>=2.4,<3',
        'falcon',
        'requests>=2.18,<3',
        'configmanager>=1.34,<2',
        'pyyaml>=3.12,<4',
        'pyjwt>=1.6.0,<2'
    ],
    entry_points={
        'sagax_sensu': [
            'Sensu1API = sagax.sensu:Sensu1API'
        ],
        'sagax_authentication': [
            'NoAuth = sagax.authentication:NoAuth',
            'StaticAuth = sagax.authentication:StaticAuth'
        ]
    },
    packages=['sagax'],
    package_data={
        'sagax': ['sagax/frontend/dist']
    },
    include_package_data=True,
    classifiers=[
        'Development Status :: 4 - Beta',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: System :: Monitoring'
    ]
)
