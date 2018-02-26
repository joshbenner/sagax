import hug

import sagax.api as api


def test_api_health():
    r = hug.test.get(api, 'health')
    assert r.status == hug.HTTP_200
