/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import { t } from 'pootle/shared/utils/i18n';
import SuggestionValue from 'pootle/editor/components/SuggestionValue';

import InnerPre from './InnerPre';
import { getL20nData } from './utils';


const L20nSuggestionValue = React.createClass({

  propTypes: {
    values: React.PropTypes.array.isRequired,
    initialValues: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      values: this.props.values,
      initialValues: this.props.initialValues,
      isRichModeEnabled: false,
    };
  },

  getPluralFormName(index) {
    if (this.pluralForms !== undefined &&
        this.pluralForms.length === this.state.values.length) {
      return `[${this.pluralForms[index]}]`;
    } else if (this.traitLabels !== undefined &&
               this.traitLabels.length === this.state.values.length) {
      return `[${this.traitLabels[index]}]`;
    }
    return `[${index}]`;
  },

  componentWillMount() {
    const l20nData = getL20nData(this.props.values);
    const l20nInitialData = getL20nData(this.props.initialValues);
    let values;
    let initialValues;
    let hasPlurals = false;

    if (l20nInitialData.hasL20nPlurals || l20nData.hasL20nTraits || l20nData.hasSimpleValue) {
      initialValues = l20nInitialData.unitValues;
    }
    if (l20nData.hasL20nPlurals) {
      this.pluralForms = l20nData.pluralForms;
      values = l20nData.unitValues;
      hasPlurals = true;
    } else if (l20nData.hasL20nTraits) {
      this.traitLabels = l20nData.traitLabels;
      values = l20nData.unitValues;
      hasPlurals = true;
    } else if (l20nData.hasSimpleValue) {
      values = l20nData.unitValues;
    } else {
      this.setState({
        isRichModeEnabled: true,
      });
    }

    if (!!values) {
      this.setState({
        values: values,
        initialValues: initialValues,
        hasPlurals: hasPlurals,
      });
    }
  },

  render() {
    const extraProps = {};
    if (this.state.isRichModeEnabled) {
      extraProps.innerComponent = InnerPre;
    }

    return (
      <SuggestionValue
        {...this.props}
        {...this.state }
        {...extraProps}
        getPluralFormName={this.getPluralFormName}
      />
    );
  },

});


export default L20nSuggestionValue;

