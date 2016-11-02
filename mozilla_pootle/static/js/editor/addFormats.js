/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */


function loadL20nFormatAdaptor(props, onLoad) {
  require.ensure(['./formats/l20n/L20nAdaptor.js'], (require) => {
    const adaptor = require('./formats/l20n/L20nAdaptor.js');
    onLoad(props, adaptor.default);
  }); 
}

export function addFormats() {
  PTL.editor.addFormats({
    ftl: loadL20nFormatAdaptor,
    l20n: loadL20nFormatAdaptor,
  });
}
