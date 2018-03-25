import re

from hug.middleware import CORSMiddleware as BaseCORS


class CORSMiddleware(BaseCORS):
    """
    Override how routes are matched so segments can include dots and such.
    """
    def match_route(self, reqpath):
        """match a request with parameter to it's corresponding route"""
        route_dicts = [routes for _, routes in self.api.http.routes.items()][0]
        routes = [route for route, _ in route_dicts.items()]
        if reqpath not in routes:
            for route in routes:  # replace params in route with regex
                reqpath = re.sub('^(/v\d*/?)', '/', reqpath)
                base_url = getattr(self.api, 'base_url', '')
                reqpath = (reqpath.lstrip('/{}'.format(base_url))
                           if base_url else reqpath)
                pat = re.sub(r'/{[^{}]+}', '/[-_.\w]+', route) + '$'
                if re.match(pat, reqpath):
                    return route

        return reqpath
