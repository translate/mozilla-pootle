/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


function loadL20nFormatAdaptor(props, onLoad) {
  require.ensure(['editor/formats/l20n/L20nAdapror.js'], (require) => {
    const adaptor = require('editor/formats/l20n/L20nAdapror.js');
    onLoad(props, adaptor.default);
  }); 
}

export function getFormats() {
  return {
    ftl: loadL20nFormatAdaptor,
    l20n: loadL20nFormatAdaptor,
  };
}
