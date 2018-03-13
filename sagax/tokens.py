import time

import jwt


def issue_token(config, claims: dict, expires: int=None):
    if expires is None:
        expires = int(time.time()) + config.jwt.ttl.get()
    token = dict(
        iss=config.jwt.issuer.get(),
        exp=expires
    )
    token.update(claims)
    return jwt.encode(payload=token,
                      key=config.jwt.secret_key.get(),
                      algorithm=config.jwt.algorithm.get())
