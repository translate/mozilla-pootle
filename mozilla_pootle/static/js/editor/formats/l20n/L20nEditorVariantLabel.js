/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';


const L20nEditorVariantLabel = React.createClass({

  propTypes: {
    index: React.PropTypes.number.isRequired,
    hasPlurals: React.PropTypes.bool,
    getLabel: React.PropTypes.func,
    className: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      isShort: false,
      className: "plural-form-label",
      hasPlurals: true,
      getLabel: null,
    }
  },

  render() {
    if (!this.props.hasPlurals || this.props.getLabel === null) {
      return null;
    }
    const label = this.props.getLabel(this.props.index);
    if (label === null) {
      return null;
    }
    return (
      <div className={this.props.className}>
        { label }
      </div>
    );
  },

});


export default L20nEditorVariantLabel;
