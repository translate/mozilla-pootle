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
import L20nUnit from './L20nUnit';


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

  componentWillMount() {
    this.l20nUnit = new L20nUnit(this.props.values[0]);
    if (this.l20nUnit.state !== null) {
      this.setState(this.l20nUnit.state.getEditorState());
    }
  },

  render() {
    const extraProps = {};
    if (this.state.isRichModeEnabled) {
      extraProps.innerComponent = InnerPre;
    }
    if (this.l20nUnit.state !== null) {
      extraProps.labelComponent = this.l20nUnit.state.getVariantLabelComponent();
      extraProps.getLabel = this.l20nUnit.state.ctx ?
        (i) => this.l20nUnit.state.ctx.getShortTitle(i) : null;
    }

    return (
      <ViewUnit
        {...this.props}
        {...this.state }
        {...extraProps}
      />
    );
  },

});


export default L20nViewUnit;
