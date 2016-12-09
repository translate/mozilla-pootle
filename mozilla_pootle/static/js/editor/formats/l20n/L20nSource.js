/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import { t } from 'pootle/shared/utils/i18n';
import UnitSource from 'pootle/editor/components/UnitSource';

import InnerPre from './InnerPre';
import L20nUnit from './L20nUnit';


const L20nSource = React.createClass({

  propTypes: {
    values: React.PropTypes.array.isRequired,
    sourceLocaleCode: React.PropTypes.string,
  },

  getInitialState() {
    return {
      values: this.props.values,
      isRichModeEnabled: false,
    };
  },

  componentWillMount() {
    this.l20nUnit = new L20nUnit(this.props.values[0]);
    if (this.l20nUnit.state !== null) {
      this.setState(this.l20nUnit.state.getEditorState());
    }
  },

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.enableRichMode) {
      this.setState({
        values: nextProps.values,
        hasPlurals: nextProps.values.length > 1,
        isRichModeEnabled: true,
      });
    } else {
      const l20nData = getL20nData(nextProps.values);
      if (l20nData.hasL20nPlurals) {
        this.pluralForms = l20nData.pluralForms;
        this.setState({
          values: l20nData.unitValues,
          hasPlurals: true,
          isRichModeEnabled: false,
        });
      } else if (l20nData.hasL20nTraits) {
        this.traitLabels = l20nData.traitLabels;
        this.setState({
          values: l20nData.unitValues,
          hasPlurals: true,
          isRichModeEnabled: false,
        });
      }
      else if (l20nData.hasSimpleValue) {
        this.setState({
          values: l20nData.unitValues,
          isRichModeEnabled: false,
        });
      } else {
        this.setState({
          isRichModeEnabled: true,
        });
      }
    }
  },*/

  render() {
    const extraProps = {};
    if (this.state.isRichModeEnabled) {
      extraProps.innerComponent = InnerPre;
    }
    if (this.l20nUnit.state !== null) {
      extraProps.labelComponent = this.l20nUnit.state.getVariantLabelComponent();
      extraProps.getLabel = this.l20nUnit.state.ctx ?
        (i) => this.l20nUnit.state.ctx.getTitle(i) : null;
    }
    return (
      <UnitSource
        {...this.props}
        {...this.state }
        {...extraProps}
      />
    );
  },
});


export default L20nSource;
