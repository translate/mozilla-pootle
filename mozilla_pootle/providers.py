# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from collections import OrderedDict

from pootle.core.delegate import format_registration, unit_display
from pootle.core.plugin import provider
from pootle_store.models import Unit

from .display import L20nUnitDisplay
from .formats import MOZILLA_FORMATS


l20n_unit_display = L20nUnitDisplay()


@provider(format_registration)
def register_formats(**kwargs_):
    return OrderedDict(MOZILLA_FORMATS)


@provider(unit_display, sender=Unit)
def l20n_unit_display_provider(**kwargs_):
    return dict(l20n=l20n_unit_display)
