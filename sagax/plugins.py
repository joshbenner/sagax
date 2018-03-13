import pkg_resources


def get_entry_points(entry_point_type: str) -> dict:
    entry_points = {}
    for entry_point in pkg_resources.iter_entry_points(entry_point_type):
        entry_points[entry_point.name] = entry_point
    return entry_points


def get_plugin_class(entry_point_type, class_name):
    types = get_entry_points(entry_point_type)
    return types[class_name].load()


def plugin_class_factory(entry_point_type, class_name, config):
    cls = get_plugin_class(entry_point_type, class_name)
    return cls(**config[cls.config_section].dump_values())
