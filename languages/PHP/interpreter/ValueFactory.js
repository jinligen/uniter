/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    'js/util',
    './Value/Array',
    './Value/Boolean',
    './Value/Float',
    './Value/Integer',
    './Value/Null',
    './Value/Object',
    './Value/String'
], function (
    util,
    ArrayValue,
    BooleanValue,
    FloatValue,
    IntegerValue,
    NullValue,
    ObjectValue,
    StringValue
) {
    'use strict';

    function ValueFactory() {

    }

    util.extend(ValueFactory.prototype, {
        createArray: function (value) {
            return new ArrayValue(this, value);
        },
        createBoolean: function (value) {
            return new BooleanValue(this, value);
        },
        createFloat: function (value) {
            return new FloatValue(this, value);
        },
        createInteger: function (value) {
            return new IntegerValue(this, value);
        },
        createNull: function () {
            return new NullValue(this);
        },
        createObject: function (value) {
            return new ObjectValue(this, value);
        },
        createString: function (value) {
            return new StringValue(this, value);
        }
    });

    return ValueFactory;
});