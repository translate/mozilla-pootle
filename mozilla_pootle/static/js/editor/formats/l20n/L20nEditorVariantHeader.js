/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import './l20n.css';


const L20nEditorVariantHeader = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    getProps: React.PropTypes.func.isRequired,
    actionCallback: React.PropTypes.func,
  },

  render() {
    const props = this.props.getProps();
    if (this.props.count === 1 && props === null || props !== null && props.title === null) {
      return null;
    }
    return (
      <div className="subheader">
        <div className="title">{ props.title }</div>
      </div>
    );
  },
});


export default L20nEditorVariantHeader;
