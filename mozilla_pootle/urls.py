# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.conf.urls import include, url

from .views import SuggestionAdminView


suggestion_urlpatterns = [
    # TP Translate
    url(r'',
        SuggestionAdminView.as_view(),
        name='pootle-suggestion-admin'),


urlpatterns = [
    url("^\+\+suggestions/", include(suggestion_urlpatterns))]
