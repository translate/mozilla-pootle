/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React, { PropTypes } from 'react';

import ViewUnit from 'pootle/editor/components/ViewUnit';

import InnerPre from './InnerPre';
import { getL20nData } from './utils';


const L20nViewUnit = React.createClass({

  propTypes: {
    values: PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      values: this.props.values,
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

    if (l20nData.hasL20nPlurals) {
      this.pluralForms = l20nData.pluralForms;
      this.setState({
        values: l20nData.unitValues,
        hasPlurals: true,
      });
    } else if (l20nData.hasL20nTraits) {
      this.traitLabels = l20nData.traitLabels;
      this.setState({
        values: l20nData.unitValues,
        hasPlurals: true,
      });
    } else if (l20nData.hasSimpleValue) {
      this.setState({
        values: l20nData.unitValues,
      });
    } else {
      this.setState({
        isRichModeEnabled: true,
      });
    }
  },

  render() {
    const extraProps = {};
    if (this.state.isRichModeEnabled) {
      extraProps.innerComponent = InnerPre;
    }

    return (
      <ViewUnit
        {...this.props}
        {...this.state }
        {...extraProps}
        getPluralFormName={this.getPluralFormName}
      />
    );
  },

});


export default L20nViewUnit;
