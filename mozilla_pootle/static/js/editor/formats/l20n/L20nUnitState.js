/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import { FTLASTParser, FTLASTSerializer } from 'l20n';

import L20nEditorVariantHeader from './L20nEditorVariantHeader';
import L20nEditorVariantLabel from './L20nEditorVariantLabel';
import L20nPluralFormHeader from './L20nPluralFormHeader';
import { PluralsContext, createTraitsContextClass } from './L20nVariantContext';


class L20nUnitState {
  constructor(l20nUnit) {
    this.l20nUnit = l20nUnit;
    this.values = [];
  }

  getEditorAreaHeaderProps(index) {
    return null;
  }

  getEditingAreaHeaderComponent() {
    return L20nEditorVariantHeader;
  }

  getVariantLabelComponent() {
    return L20nEditorVariantLabel;
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: false,
      isRichModeEnabled: true,
    }
  }

  getEditorViewUnitState() {
    return this.getEditorState();
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

    this.ctx = new PluralsContext(this.pluralForms);
  }

  extractPluralFormName(variant) {
    return FTLASTSerializer.dumpExpression(variant.key);
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: true,
      isRichModeEnabled: false,
    }
  }

  setEmptyEntity(localeCode) {
    this.pluralForms = gatherPluralForms(localeCode, this.pluralForms);
    this.ctx.update(this.pluralForms);
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

  setDefault(index) {
    for (let i = 0; i < this.variants.length; i++ ) {
      this.variants[i].default = (i === index);
      this.pluralForms[i] = this.extractPluralFormName(this.variants[i]);
    }
    this.ctx.update(this.pluralForms);
  }

  removePluralForm(index) {
    this.variants.splice(index, 1);
    this.pluralForms.splice(index, 1);
    this.ctx.update(this.pluralForms);
    this.values.splice(index, 1);
  }

  getEditorAreaHeaderProps(index) {
    if (index < this.variants.length) {
      return {
        default: this.variants[index].default,
        title: this.ctx.getTitle(index),
      }
    }
  }

  getEditingAreaHeaderComponent() {
    return L20nPluralFormHeader;
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

    this.ctx = createTraitsContextClass(this.traitLabels);
  }

  getEditorState() {
    return {
      values: this.values,
      hasPlurals: true,
      isRichModeEnabled: false,
    }
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

  getEditorAreaHeaderProps(index) {
    if (index < this.traitLabels.length) {
      return {
        title: this.ctx.getTitle(index),
      }
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


export {
  L20nUnitPluralsState,
  L20nUnitRawState,
  L20nUnitSimpleState,
  L20nUnitTraitsState
};
