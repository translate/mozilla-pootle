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
import L20nUnit from './L20nUnit';


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
    if (this.l20nUnit.state.getShortPluralFormName) {
      return this.l20nUnit.state.getShortPluralFormName(index);
    }
    return `[${index}]`;
  },

  componentWillMount() {
    this.l20nUnit = new L20nUnit(this.props.values[0]);
    this.l20nInitialUnit = new L20nUnit(this.props.initialValues[0]);
    if (this.l20nUnit.state !== null && this.l20nInitialUnit.state !== null) {
      let state = this.l20nUnit.state.getEditorState();
      state.initialValues = this.l20nInitialUnit.state.values;
      this.setState(state);
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

