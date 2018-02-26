import pkg_resources


def get_entry_points(entry_point_type: str) -> dict:
    entry_points = {}
    for entry_point in pkg_resources.iter_entry_points(entry_point_type):
        entry_points[entry_point.name] = entry_point
    return entry_points
