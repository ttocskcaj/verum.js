/**
MIT License

Copyright (c) 2017 Jack Scott

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */
$.fn.verum = function (options) {
    // Default settings
    var defaults = {
        'passClass': 'validation-pass',
        'failClass': 'validation-pass',
        'feedbackClass': 'validation-feedback'
    };
    // Merge default settings with options passed in.
    var settings = $.extend(defaults, options);
    var rules = settings.rules;
    var excluded = settings.excluded;
    var form = this;

    /**
     * Form submit listener.
     * When the form is submitted, run validation and only submit if all passes.
     */
    form.submit(function (e) {
        // Loop through each item in the form and validate it.
        form.children().each(function () {
            var formObject = $(this).find('input, select, textarea');
            if (!excluded.contains(formObject.attr('name'))) {
                if (!validate(rules, formObject, settings)) {
                    e.preventDefault();
                    console.log('Validation failed');
                    return false;
                }
            }
            return true;
        });
    });

    // Loop through each item in the form and add a keyup listener.
    this.children().each(function () {
        var formObject = $(this).find('input, select, textarea');
        if (!excluded.contains(formObject.attr('name'))) {
            // On each keyup, validate the item.
            formObject.keyup(function () {
                validate(rules, formObject, settings);

            });
        }
    });

};

/**
 * Validation function.
 *
 * @param rules A list of rules separated by |
 * @param formObject The object to validate.
 * @param settings The array of settings.
 * @returns {boolean} True if pass, false if fail.
 */
function validate(rules, formObject, settings) {
    var objectName = formObject.attr('name');
    var ret = true;
    if (rules.hasOwnProperty(objectName)) {
        var rulesArray = rules[objectName].split('|');
        for (var i in rulesArray) {
            var parts = [null, null];
            var rule = rulesArray[i];
            if (rule.split(':')[1]) {
                parts = rule.split(':');
            }
            else parts[0] = rule;

            var formGroup = $(formObject).parent();
            if (!checkRule(formObject.val(), parts[0], parts[1])) {
                formGroup.removeClass(settings.passClass);
                formGroup.addClass(settings.failClass);
                formGroup.find(settings.feedbackClass).show();

                ret = false;
                break;

            }
            else {

                formGroup.removeClass(settings.failClass);
                formGroup.addClass(settings.passClass);
                formGroup.find(settings.feedbackClass).hide();


                ret = true;

            }
        }
    }
    return ret;
}

/**
 * Checks a given input by a given rule.
 * @param input The string to test.
 * @param rule The rule to check.
 * @param extra Extra data needed for the rule such as min/max length
 * @returns {*}
 */
function checkRule(input, rule, extra) {
    switch (rule) {
        case 'min':
            return input.length >= extra;
            break;
        case 'max':
            return input.length <= extra;
            break;
        case 'required':
            return input.length > 0;
            break;
        case 'name' :
            return /^[A-Za-z0-9 '-]*$/.test(input);

        case 'username' :
            return /^[A-Za-z0-9_]*$/.test(input);

        case 'email' :
            return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(input);

        case 'cellphone' :
            return /^(027|022|021|029|025){1}[0-9]{5,7}$/.test(input);

        case 'matches' :
            return $('[name=' + extra + ']').val() == input;
        default :
            return 'Validation Error: The rule "' + rule + '" does not exist.';

    }
}
