/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import { t } from 'pootle/shared/utils/i18n';
import { qAll } from 'pootle/shared/utils/dom';

import Editor from 'pootle/editor/components/Editor';
import RawFontTextarea from 'pootle/editor/components/RawFontTextarea';

import L20nCodeMirror from './L20nCodeMirror';

import L20nUnit from './L20nUnit';

const L20nEditorContainer = React.createClass({

  propTypes: {
    currentLocaleCode: React.PropTypes.string.isRequired,
    currentLocaleDir: React.PropTypes.string.isRequired,

    initialValues: React.PropTypes.array,
    isDisabled: React.PropTypes.bool,
    isRawMode: React.PropTypes.bool,
    // FIXME: needed to allow interaction from the outside world. Remove ASAP.
    onChange: React.PropTypes.func.isRequired,
    sourceValues: React.PropTypes.array,
    style: React.PropTypes.object,
    targetNplurals: React.PropTypes.number.isRequired,
    textareaComponent: React.PropTypes.func,
    editorComponent: React.PropTypes.func,
  },

  // FIXME: move context to a higher-order component. It _cannot_ be done now
  // because we need to access the component's state in a quite hackish and
  // undesired way, and wrapping the component in a context provider would
  // prevent us from doing so.
  childContextTypes: {
    currentLocaleCode: React.PropTypes.string,
    currentLocaleDir: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      initialValues: [],
      textareaComponent: RawFontTextarea,
      editorComponent: Editor,
    };
  },

  getInitialState() {
    return {
      hasL20nPlurals: false,
      isRichModeEnabled: false,
      values: this.props.initialValues,
    };
  },

  getChildContext() {
    return {
      currentLocaleCode: this.props.currentLocaleCode,
      currentLocaleDir: this.props.currentLocaleDir,
    };
  },

  componentWillMount() {
    const value = this.props.initialValues[0];

    if (value === '') {
      this.l20nUnit = new L20nUnit();
      this.l20nUnit.initEmptyBySource(this.props.sourceValues[0], this.props.currentLocaleCode);
    } else {
      this.l20nUnit = new L20nUnit(value);
    }
    this.l20nInitialValues = this.l20nUnit.state.values;
    this.setState(this.l20nUnit.state.getEditorState());
  },

  componentDidMount() {
    this.areas = qAll('.js-translation-area');
  },

  getAreas() {
    return this.areas;
  },

  getAreaValues(values) {
    if (values[0] === '') {
      return values;
    }
    const l20nUnit = L20nUnit(values[0]);
    return l20nUnit.state.values;
  },

  getStateValues() {
    return this.state.values;
  },

  handleChange(i, value) {
    this.l20nUnit.updateValue(i, value);
    const values = [this.l20nUnit.value];
    this.setState({
      values,
    }, () => this.props.onChange(values));
  },

  getTextareaHeaderProps(valueIndex) {
    return this.l20nUnit.state.getEditorAreaHeaderProps(valueIndex);
  },

  handleTextAreaHeaderAction(valueIndex, action) {
    this.l20nUnit.handleStateAction(valueIndex, action, () => {
      const values = [this.l20nUnit.value];
      this.setState({
        values,
      }, () => this.props.onChange(values));
    });
  },

  render() {
    const textareaComponent = this.state.isRichModeEnabled ? L20nCodeMirror
                                                           : this.props.textareaComponent;
    const editingAreaHeaderComponent = this.l20nUnit.state.getEditingAreaHeaderComponent();

    return (
      <this.props.editorComponent
        hasL20nPlurals={this.state.hasL20nPlurals}
        initialValues={this.l20nInitialValues}
        isDisabled={this.props.isDisabled}
        isRawMode={this.props.isRawMode}
        isRichModeEnabled={this.state.isRichModeEnabled}
        onChange={this.handleChange}
        sourceValues={this.props.sourceValues}
        style={this.props.style}
        targetNplurals={this.l20nInitialValues.length}
        textareaHeaderActionCallback={this.handleTextAreaHeaderAction}
        getTextareaHeaderProps={this.getTextareaHeaderProps}
        textareaHeaderComponent={editingAreaHeaderComponent}
        textareaComponent={textareaComponent}
        values={this.l20nUnit.state.values}
      />
    );
  },

});


export default L20nEditorContainer;
