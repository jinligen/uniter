/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash'),
    engineTools = require('../tools'),
    nowdoc = require('nowdoc'),
    phpTools = require('../../tools');

describe('PHP Engine object method bridge integration', function () {
    var engine;

    function check(scenario) {
        engineTools.check(function () {
            return {
                engine: engine
            };
        }, scenario);
    }

    beforeEach(function () {
        engine = phpTools.createEngine();
    });

    describe('exposing as global PHP variables', function () {
        _.each({
            'plain object from JavaScript with instance method': {
                code: nowdoc(function () {/*<<<EOS
<?php
    return $tools->addThisDotMyvalueTo(16);
EOS
*/;}), // jshint ignore:line
                expose: {
                    'tools': {
                        addThisDotMyvalueTo: function (number) {
                            return number + this.myValue;
                        },
                        myValue: 5
                    }
                },
                expectedResult: 21,
                expectedResultType: 'integer',
                expectedStderr: '',
                expectedStdout: ''
            },
            'plain object from JavaScript with prototype method': {
                code: nowdoc(function () {/*<<<EOS
<?php
    return $tools->getValue();
EOS
*/;}), // jshint ignore:line
                expose: {
                    'tools': Object.create({
                        getValue: function () {
                            return 'me';
                        }
                    })
                },
                expectedResult: 'me',
                expectedResultType: 'string',
                expectedStderr: '',
                expectedStdout: ''
            },
            'calling PHP closure from JS': {
                code: nowdoc(function () {/*<<<EOS
<?php
$tools->setAdder(function ($num1, $num2) {
    return $this->start + $num1 + $num2;
});
return $tools->getValue(4, 2);
EOS
*/;}), // jshint ignore:line
                expose: function () {
                    var adder;

                    return {
                        'tools': {
                            getValue: function (num1, num2) {
                                return adder.call({start: 10}, num1, num2);
                            },
                            setAdder: function (newAdder) {
                                adder = newAdder;
                            }
                        }
                    };
                },
                expectedResult: 16,
                expectedResultType: 'integer',
                expectedStderr: '',
                expectedStdout: ''
            },
            'calling PHP closure from JS with null thisObj': {
                code: nowdoc(function () {/*<<<EOS
<?php
$tools->setCallback(function () {
    var_dump($this);
});
return $tools->callBack(4, 2);
EOS
*/;}), // jshint ignore:line
                expose: function () {
                    var callback;

                    return {
                        'tools': {
                            callBack: function () {
                                callback.call(null);
                            },
                            setCallback: function (newCallback) {
                                callback = newCallback;
                            }
                        }
                    };
                },
                expectedResult: null,
                expectedResultType: 'null',
                expectedStderr: '',
                expectedStdout: nowdoc(function () {/*<<<EOS
NULL

EOS
*/;}) // jshint ignore:line
                }
        }, function (scenario, description) {
            describe(description, function () {
                check(scenario);
            });
        });
    });
});
