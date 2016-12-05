/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import { FTLASTParser, FTLASTSerializer, getPluralForms } from 'l20n';
import L20nPluralFormHeader from './L20nPluralFormHeader';

/*
    Tests can be run in plugin app environment where there is no installed
    dependencies from the main Pootle. Import fake `t` for tests.
*/
let t;
try {
  t = require('pootle/shared/utils/i18n').t;
} catch (e) {
  t = (value, ctx) => (interpolate(value, ctx, true));
}


function getEmptyTextElementL20nEntity(value) {
  const textElementResource = FTLASTParser.parseResource('unit = ""');
  textElementResource[0].body[0].value.elements[0].value = value;

  return textElementResource[0].body[0];
}


class L20nUnitState {
  constructor(l20nUnit) {
    this.l20nUnit = l20nUnit;
    this.values = [];
  }

  getEditorAreaHeaderProps(index) {
    return null;
  }
}


class L20nUnitSimpleState extends L20nUnitState {
  constructor(l20nUnit) {
    super(l20nUnit);
    this.values = [this.l20nUnit.entity.value.source];
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: false,
      isRichModeEnabled: false,
    }
  }

  setEmptyEntity(localeCode) {
    this.l20nUnit.entity.value.elements[0].value = '';
    this.values = [''];
  }

  update(i, value) {
    // equivalent this.values = [value];
    this.values[i] = value;
    this.l20nUnit.entity.value.elements[0].value = value;
  }
}


class L20nUnitPluralsState extends L20nUnitState {
  constructor(l20nUnit) {
    super(l20nUnit);

    const variants = this.l20nUnit.entity.value.elements[0].expressions[0].variants;
    this.values = [];
    this.pluralForms = [];

    for (let i = 0; i < variants.length; i++) {
      this.values.push(variants[i].value.source);
      this.pluralForms.push(this.extractPluralFormName(variants[i]));
    }

  }

  extractPluralFormName(variant) {
    const key = FTLASTSerializer.dumpExpression(variant.key);
    if (variant.default) {
      return `${key}, default`;
    }
    return key;
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: true,
      isRichModeEnabled: false,
    }
  }

  getPluralFormName(index) {
    if (this.pluralForms !== undefined && index < this.pluralForms.length) {
      return t('Plural form [%(key)s]', { key: this.pluralForms[index] });
    }
  }

  getShortPluralFormName(index) {
    if (this.pluralForms !== undefined && index < this.pluralForms.length) {
      return `[${this.pluralForms[index]}]`;
    }
  }

  setEmptyEntity(localeCode) {
    this.pluralForms = gatherPluralForms(localeCode, this.pluralForms);
    const resource = FTLASTParser.parseResource(`unit = ${getEmptySelectorPattern(this.pluralForms)}`);
    this.l20nUnit.entity = resource[0].body[0];
    this.values = new Array(this.pluralForms.length).fill('');
  }

  update(i, value) {
    this.values[i] = value;
    if (value !== '') {
      const variantL20nUnit = new L20nUnit(value);
      this.l20nUnit.entity.value.elements[0].expressions[0].variants[i].value = variantL20nUnit.entity.value;
    } else {
      //TODO: mark non-full state
    }
  }

  addVariant(pluralForm) {}

  get variants() {
    return this.l20nUnit.entity.value.elements[0].expressions[0].variants;
  }

  setDefault({index}) {
    for (let i = 0; i < this.variants.length; i++ ) {
      this.variants[i].default = (i === index);
      this.pluralForms[i] = this.extractPluralFormName(this.variants[i]);
    }
  }

  removePluralForm({index}) {
    this.variants.splice(index, 1);
    this.pluralForms.splice(index, 1);
    this.values.splice(index, 1);
  }

  getEditingAreaHeaderComponent() {
    return L20nPluralFormHeader;
  }

  getEditorAreaHeaderProps(index) {
    const variants = this.l20nUnit.entity.value.elements[0].expressions[0].variants;
    if (index < variants.length) {
      return {
        default: variants[index].default,
      }
    }
  }

  handleAction(action, params) {
    try {
      this[action](params.index);
    } catch (e) {
      return false;
    }
  }
}


class L20nUnitTraitsState extends L20nUnitState {
  constructor(l20nUnit) {
    super(l20nUnit);

    const traits = this.l20nUnit.entity.traits;
    this.values = [];
    this.traitLabels = [];
    for (let i = 0; i < traits.length; i++) {
      this.values.push(traits[i].value.source);
      let key = FTLASTSerializer.dumpExpression(traits[i].key);
      this.traitLabels.push(key);
    }
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: true,
      isRichModeEnabled: false,
    }
  }

  getPluralFormName(index) {
    if (this.traitLabels !== undefined) {
      return `[${this.traitLabels[index]}]`;
    }
  }

  getShortPluralFormName(index) {
    return this.getPluralFormName(index);
  }

  setEmptyEntity(localeCode) {
    const resource = FTLASTParser.parseResource(`unit = ${getEmptyTraitsPattern(this.traitLabels)}`);
    this.l20nUnit.entity = resource[0].body[0];
    this.values = new Array(this.traitLabels.length).fill('');
  }

  update(i, value) {
    this.values[i] = value;
    if (value !== '') {
      const variantL20nUnit = new L20nUnit(value);
      this.l20nUnit.entity.traits[i].value.elements[0].value = variantL20nUnit.entity.value;
    } else {
      //TODO: mark non-full state
    }

  }
}


class L20nUnitRawState extends L20nUnitState {
  constructor(l20nUnit) {
    super(l20nUnit);
    this.values = [l20nUnit.value];
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: false,
      isRichModeEnabled: true,
    }
  }

  setEmptyEntity(localeCode) {
    this.l20nUnit.entity.value.elements[0].value = '';
    // TODO: check if the next line is necessary here
    this.l20nUnit.value = '';
    this.values = [''];
  }

  update(i, value) {
    // equivalent this.values = [value];
    this.values[i] = value;

    const updatedL20nUnit = new L20nUnit(value);
    if (updatedL20nUnit.entity !== null) {
      this.l20nUnit.entity = updatedL20nUnit.entity;
    }
  }
}


class L20nUnit {
  constructor(value) {
    // value should what we get from .ftl file exactly (with all quotes and syntax)
    this.entity = null;
    this.state = null;
    this.value = value;
    if (!!value) {
      this.parse();
    }
  }

  parse() {
    try {
      this.entity = FTLASTParser.parseResource(`unit = ${this.value}`)[0].body[0];
      this.initState();
    } catch (e) {
      if (e.name === 'L10nError') {
        this.state = new L20nUnitRawState(this);
        this.state.error = e;
      } else {
        throw e;
      }
    }
  }

  initEmptyBySource(source, localeCode) {
    const sourceL20nUnit = new L20nUnit(source);
    this.state = sourceL20nUnit.state;
    this.state.setEmptyEntity(localeCode);
    this.entity = this.state.l20nUnit.entity;
    this.state.l20nUnit = this;
  }

  updateValue(i, value) {
    this.state.update(i, value);
    try {
      if (this.state.values.every(val => val === '')) {
        this.value = '';
      } else {
        this.value = this.dump();
      }
    } catch (e) {
      if (e.name === 'L20nEditorError') {
        // should this.value be changed ???
      } else {
        throw e;
      }
    }
  }

  dump() {
    try {
      const value = FTLASTSerializer.dumpPattern(this.entity.value);

      if (this.entity.traits.length) {
        var traits = FTLASTSerializer.dumpMembers(this.entity.traits, 2);
        return value + '\n' + traits;
      } else {
        return value;
      }
    } catch (e) {
      throw new L20nEditorError(e.message);
    }
  }

  initState() {
    if (this.entity === null) {
      return;
    }

    if (this.hasSimpleValue()) {
      this.state = new L20nUnitSimpleState(this);
    } else if (this.hasL20nPlurals()) {
      this.state = new L20nUnitPluralsState(this);
    } else if (this.hasL20nTraits()) {
      this.state = new L20nUnitTraitsState(this);
    } else {
      this.state = new L20nUnitRawState(this);
    }
  }

  hasSimpleValue() {
    if (this.entity === null) {
      return false;
    }
    const value = this.entity.value;
    return (
      !!value &&
      value.elements.length === 1 &&
      value.elements[0].type === 'TextElement'
    );
  }

  hasL20nPlurals() {
    if (this.entity === null) {
      return false;
    }
    const value = this.entity.value;
    return (
      !!value &&
      value.elements.length === 1 &&
      value.elements[0].type === 'Placeable' &&
      value.elements[0].expressions[0].type === 'SelectExpression' &&
      !!value.elements[0].expressions[0].expression.callee &&
      value.elements[0].expressions[0].expression.callee.name === 'PLURAL'
    );

  }

  hasL20nTraits() {
    if (this.entity === null) {
      return false;
    }
    const traits = this.entity.traits;
    return (
      traits !== undefined &&
      traits !== null &&
      traits.length > 0
    );
  }

  handleStateAction(action, options, callback) {
    this.state[action](options);
    this.value = this.dump();
    callback();
  }
}


function gatherPluralForms(localeCode, sourcePluralForms) {
  const pluralForms = getPluralForms(localeCode);
  for (let i = 0; i < sourcePluralForms.length; i++) {
    let sourcePluralForm = sourcePluralForms[i];
    const indexOfDelimeter = sourcePluralForms[i].indexOf(',');
    if (indexOfDelimeter >= 0) {
      sourcePluralForm = sourcePluralForm.substring(0, indexOfDelimeter);
    }
    if (pluralForms.indexOf(sourcePluralForm) < 0) {
      pluralForms.push(sourcePluralForms[i]);
    }
  }
  return pluralForms;
}


function getEmptySelectorPattern(variants, { selectorVariable = 'var' } = {}) {
  const variantsPattern = variants.map((x) => `[${x}] ""`).join('\n');
  return `{ ${selectorVariable} -> \n ${variantsPattern} \n}`;
}


function getEmptyTraitsPattern(traitLabels) {
  const traitsPattern = traitLabels.map((x) => `[${x}] ""`).join('\n');
  return `\n${traitsPattern}\n`;
}


export default L20nUnit;
