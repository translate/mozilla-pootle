# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django_assets import Bundle, register


# <Webpack>
# These are handled by webpack and therefore have no filters applied
# They're kept here so hash-based cache invalidation can be used

js_vendor = Bundle(
    'js/mozilla_pootle/app.bundle.js',
    output='js/mozilla_pootle_app.min.%(version)s.js')
register('js_mozilla_pootle', js_vendor)


