/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import expect from 'expect';
import { describe, it } from 'mocha';

import L20nUnit from './L20nUnit';


describe('parse', () => {
  const tests = [
    {
      description: 'simple value',
      value: 'foo bar',
      expectedState: {
        values: ['foo bar'],
        type: 'simple',
      },
      expectedEditorState: {
        values: ['foo bar'],
        hasPlurals: false,
        isRichModeEnabled: false,
      }
    },

    {
      description: 'empty string',
      value: '""',
      expectedState: {
        values: [''],
        type: 'simple',
      },
      expectedEditorState: {
        values: [''],
        hasPlurals: false,
        isRichModeEnabled: false,
      }
    },

    {
      description: 'multiline value',
      value: '\n  | foo\n  | bar',
      expectedState: {
        values: ['foo\nbar'],
        type: 'simple',
      },
      expectedEditorState: {
        values: ['foo\nbar'],
        hasPlurals: false,
        isRichModeEnabled: false,
      }
    },

    {
      description: 'plurals value',
      value: '{ PLURAL($num) ->\n  [one] { $num } apple\n *[other] { $num } apples\n}',
      expectedState: {
        values: ['{ $num } apple', '{ $num } apples'],
        pluralForms: ['one', 'other, default'],
        type: 'plurals',
      },
      expectedEditorState: {
        values: ['{ $num } apple', '{ $num } apples'],
        hasPlurals: true,
        isRichModeEnabled: false,
      }
    },

    {
      description: 'traits',
      value: '\n  [label] File\n  [accesskey] F',
      expectedState: {
        values: ['File', 'F'],
        traitLabels: ['label', 'accesskey'],
        type: 'traits',
      },
      expectedEditorState: {
        values: ['File', 'F'],
        hasPlurals: true,
        isRichModeEnabled: false,
      }
    },

    {
      description: 'complex',
      value: 'foo { $var ->\n *[default] { $var } bar\n} baz',
      expectedState: {
        values: ['foo { $var ->\n *[default] { $var } bar\n} baz'],
      },
      expectedEditorState: {
        values: ['foo { $var ->\n *[default] { $var } bar\n} baz'],
        hasPlurals: false,
        isRichModeEnabled: true,
      }
    },

  ];

  it('parses empty (undefined) unit', () => {
    // empty string initializes undefined unit
    // you have to use quited "" empty string to pass a real empty string
    const l20nUnit = new L20nUnit('');
    expect(l20nUnit.state).toEqual(null);
    expect(l20nUnit.entity).toEqual(null);
  });

  tests.forEach((test) => {
    it(`parses ${test.description}`, () => {
      const l20nUnit = new L20nUnit(test.value);
      expect(l20nUnit.dump()).toEqual(test.value);
      expect(l20nUnit.state.getEditorState()).toEqual(test.expectedEditorState);
    });
  });

});
