const jqueryDatetimepicker = require('jquery-datetimepicker');
module.exports = jqueryDatetimepicker;

function datetimePicker() {
    return {
        template: require('./datetimePicker.html'),
        restrict: "EA",
        require: "ngModel",
        scope: {
            model: '=ngModel',
            required: '=required',
            notAllowBlank: '=notAllowBlank'
        },
        css: require('./jquery.datetimePicker.css'),
        link: function(scope, element, attrs, ctrl) {
            $(element).find('input').css('outline', 'none');

            ctrl.$render = function() {
                if (typeof scope.model !== undefined)
                    $(element).find('input').val(scope.model);
            };

            var d = new Date();
            var maxday = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            var minday = (d.getFullYear() - 100) + "-1-1";
            var step = 1;
            $(element).find('input').datetimepicker({               
                format: attrs.format || 'Y-m-d H:i',
                datepicker: attrs.datepicker == "false" ? false : true,
                timepicker: attrs.timepicker == "false" ? false : true,
                minDate: !!attrs.mindate ? attrs.mindate : minday,
                maxDate: !!attrs.maxdate ? attrs.maxdate : maxday,
                step: !!attrs.step ? attrs.step : step,
                onClose: function() {
                    $(element).blur();
                },
                allowBlank: !scope.notAllowBlank
            });
            jQuery.datetimepicker.setLocale('ch');

            $(element).on('blur', function() {
                scope.$parent.$apply(function() {
                    var datetime = $(element).find('input').val();
                    ctrl.$setViewValue(datetime);
                });
            });

            scope.$watch('model', (n, o) => {
                ctrl.$setViewValue(!!n ? n : "");
            })
        }
    }
}

module.exports = datetimePicker;
