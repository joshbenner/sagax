from os import path
import subprocess

import distutils.log
from setuptools import setup
from setuptools.command.build_py import build_py

tests_require = ['pytest']
here = path.abspath(path.dirname(__file__))
frontend_path = path.join(here, 'sagax-frontend')

with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()


class YarnInstall(build_py):
    def run(self):
        cmd = 'yarn --cwd="{}" install'.format(frontend_path)
        self.announce('Running: {}'.format(cmd), level=distutils.log.INFO)
        proc = subprocess.Popen(cmd, shell=True)
        proc.communicate()


class YarnBuild(build_py):
    def run(self):
        cmd = 'yarn --cwd="{}" run build'.format(frontend_path)
        self.announce('Running: {}'.format(cmd), level=distutils.log.INFO)
        proc = subprocess.Popen(cmd, shell=True)
        proc.communicate()


class BuildPy(build_py):
    def run(self):
        self.run_command('yarn_install')
        self.run_command('yarn_build')
        super(BuildPy, self).run()


setup(
    name='sagax',
    use_scm_version=True,
    license='BSD',
    author='Josh Benner',
    author_email='josh@bennerweb.com',
    url='https://github.com/joshbenner/sagax',
    description='Sensu dashboard',
    long_description=long_description,
    cmdclass={
        'yarn_install': YarnInstall,
        'yarn_build': YarnBuild,
        'build_py': BuildPy
    },
    setup_requires=['setuptools_scm'],
    tests_require=tests_require,
    extras_require={
        'test': tests_require,
        'ldap': [
            'ldap3>=2.4,<3'
        ]
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
            'none = sagax.authentication:NoAuth',
            'static = sagax.authentication:StaticAuth',
            'ldap = sagax.ldap:LDAPAuthentication'
        ]
    },
    packages=['sagax', 'sagax-frontend'],
    package_data={
        'sagax-frontend': [
            'dist/*',
            'dist/static/css/*',
            'dist/static/js/*',
            'dist/static/fonts/*',
            'dist/static/img/*'
        ]
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
