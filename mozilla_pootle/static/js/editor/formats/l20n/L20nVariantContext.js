/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */



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


export function createTraitsContextClass(traitLabels) {
  if (traitLabels.length && traitLabels[0].indexOf('xul/label') >= 0) {
    return new AccessKeyTraitsContext(traitLabels);
  }
  return new TraitsContext(traitLabels);
}


class VariantContext {
  constructor(labels) {
    this.labels = labels;
  }

  update(labels) {
    this.labels = labels;
  }
}


class PluralsContext extends VariantContext {
  getTitle(index) {
    if (this.labels !== undefined && index < this.labels.length) {
      return t('Plural form [%(key)s]', { key: this.labels[index] });
    }
  }

  getShortTitle(index) {
    if (this.labels !== undefined && index < this.labels.length) {
      return `[${this.labels[index]}]`;
    }
  }

}


class TraitsContext extends VariantContext {
  getTitle(index) {
    if (this.labels !== undefined) {
      return `[${this.labels[index]}]`;
    }
  }

  getShortTitle(index) {
    return this.getTitle(index);
  }
}


class AccessKeyTraitsContext extends TraitsContext {
  getTitle(index) {
    if (this.labels !== undefined) {
      if (this.labels[index].indexOf('label') >= 0) {
        return null;
      }
      return `[${this.labels[index]}]`;
    }
  }

  getShortTitle(index) {
    return this.getTitle(index);
  }
}

export { PluralsContext };
