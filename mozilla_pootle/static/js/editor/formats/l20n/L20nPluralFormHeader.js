/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import { t } from 'pootle/shared/utils/i18n';

import './l20n.css';


const L20nEditorPluralFormHeader = React.createClass({
  propTypes: {
    targetNplurals: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    getTitle: React.PropTypes.func.isRequired,
    getProps: React.PropTypes.func.isRequired,
    actionCallback: React.PropTypes.func,
  },

  setDefaultPluralForm() {
    this.props.actionCallback('setDefault', {index: this.props.index});
    return false;
  },

  removePluralForm() {
    this.props.actionCallback('removePluralForm', {index: this.props.index});
    return false;
  },

  render() {
    if (this.props.targetNplurals === 1 || this.props.getPluralFormName) {
      return null;
    }
    return (
      <div className="subheader">
        <div className="title">{ this.props.getTitle(this.props.index) }</div>
        { !this.props.getProps(this.props.index).default &&
          <div className="menu">
            <button
              onClick={this.setDefaultPluralForm}
              title={t('Set as default')}
            >*</button>
            <button
              onClick={this.removePluralForm}
              title={t('Remove')}
            >x</button>
          </div>
        }
      </div>
    );
  },
});


export default L20nEditorPluralFormHeader;
