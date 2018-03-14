import time

import jwt

from sagax.config import config


def issue_token(claims: dict, expires: int=None):
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


def verify_token(encoded_token):
    return jwt.decode(encoded_token, config.jwt.secret_key.get(),
                      algorithms=[config.jwt.algorithm.get()],
                      issuer=config.jwt.issuer.get())
