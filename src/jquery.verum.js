$.fn.verum = function (options) {
    var defaults = {
        'passClass': 'validation-pass',
        'failClass': 'validation-pass',
        'feedbackClass': 'validation-feedback'
    };
    var settings = $.extend(defaults, options);
    var rules = settings.rules;
    var excluded = settings.excluded;
    var form = this;
    form.submit(function (e) {
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
    this.children().each(function () {
        var formObject = $(this).find('input, select, textarea');
        if (!excluded.contains(formObject.attr('name'))) {
            formObject.keyup(function () {
                validate(rules, formObject, settings);

            });
        }
    });

};
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
