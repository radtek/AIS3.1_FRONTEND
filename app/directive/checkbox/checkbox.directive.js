module.exports = Checkbox;

Checkbox.$inject = ['$rootScope', '$timeout'];

function Checkbox($rootScope, $timeout) {
    return {
        template: require('./checkbox.html'),
        less: require('./checkbox.less'),
        restrict: 'E',
        require: '?^ngModel',
        transclude: true,
        scope: {
            model: '=ngModel',
            ngTrueValue: '=',
            ngFalseValue: '=',
            ngDisabled: '=ngDisabled'
        },
        link: function(scope, elem, attrs, ctrl) {
            let trueVal = (scope.ngTrueValue != undefined) ? scope.ngTrueValue : true;
            let falseVal = (scope.ngFalseValue != undefined) ? scope.ngFalseValue : '';
            if (ctrl) {
                scope.$watch('model', (n, o) => {
                    if (scope.model == trueVal) {
                        scope.checkboxVal = true;
                        $(elem).find('input').prop('checked', true);
                    } else if (scope.model != trueVal) {
                        scope.checkboxVal = false;
                        $(elem).find('input').prop('checked', false);
                    }
                })
            }

            $(elem).find('input').on('change', (ev) => {
                scope.checkboxVal = ev.currentTarget.checked;
                if (ev.currentTarget.checked == true) {
                    $(this).prop('checked', true);
                    if (ctrl) {
                        ctrl.$setViewValue(trueVal);
                    }

                } else if (!ev.currentTarget.checked) {
                    $(this).prop('checked', false);
                    if (ctrl) {
                        ctrl.$setViewValue(falseVal);
                    }

                }
            });

            if (attrs.ngDisabled) {
                scope.$watch(
                    scope.$eval.bind(scope.$parent, attrs.ngDisabled),
                    (n, o) => {
                        if (n) {
                            $(elem).find('input').prop('disabled', true).parent().css({ cursor: 'no-drop' });
                        } else {
                            $(elem).find('input').prop('disabled', false).parent().css({ cursor: 'default' });
                        }
                    }
                );
            }
        }
    }
}
