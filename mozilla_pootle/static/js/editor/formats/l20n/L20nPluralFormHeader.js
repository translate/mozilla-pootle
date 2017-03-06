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
    count: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
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

  getMenuItems(props) {
    const items = [];
    if (props.default) {
      items.push(
        <input
          key={`menu-item-${items.length}`}
          type="radio"
          readOnly={true}
          checked={true}
          onClick={this.setDefaultPluralForm}
          title={t('This plural form is used as a default')}
        />
      );
      items.push(
        <a
          key={`menu-item-${items.length}`}
          onClick={this.addPluralForm}
        >
          <i className="icon-add" title={t('Add another plural form')}></i>
        </a>
      );
    } else {
      items.push(
        <input
          key={`menu-item-${items.length}`}
          type="radio"
          onClick={this.setDefaultPluralForm}
          title={t('Use this plural form as a default')}
        />
      );
      items.push(
        <a
          key={`menu-item-${items.length}`}
          onClick={this.removePluralForm}
        >
          <i className="icon-reject-white" title={t('Remove this plural form')}></i>
        </a>
      );
    }
    return items;
  },

  render() {
    const props = this.props.getProps();
    if (this.props.count === 1 && props === null) {
      return null;
    }
    const items = this.getMenuItems(props);

    return (
      <div className="subheader">
        <div className="title">{props.title}</div>
        <div className="menu">
          { items }
        </div>
      </div>
    );
  },
});


export default L20nEditorPluralFormHeader;
