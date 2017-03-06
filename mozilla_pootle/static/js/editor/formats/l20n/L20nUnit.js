/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import { FTLASTParser, FTLASTSerializer, getPluralForms } from 'l20n';

import { L20nUnitSimpleState, L20nUnitPluralsState,
         L20nUnitTraitsState, L20nUnitRawState } from './L20nUnitState';


function getEmptyTextElementL20nEntity(value) {
  const textElementResource = FTLASTParser.parseResource('unit = ""');
  textElementResource[0].body[0].value.elements[0].value = value;

  return textElementResource[0].body[0];
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

  handleStateAction(valueIndex, action, callback) {
    this.state[action](valueIndex);
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
