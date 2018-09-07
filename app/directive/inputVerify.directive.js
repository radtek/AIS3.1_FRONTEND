module.exports = transform;

function transform() {
    var tfConfig = {
        number: function(input, opt) {
            var v = input.target.value,
                min = opt.min || input.target.min,
                max = opt.max || input.target.max;
            if (typeof min == 'string') {
                if (min.length > 0)
                    min = parseFloat(min);
                else
                    min = 0;
            }
            if (typeof max == 'string') {
                if (max.length > 0)
                    max = parseFloat(max);
                else
                    max = 0;
            }
            if (typeof v == 'string') {
                if (v.length > 0)
                    v = parseFloat(v);
                else
                    v = '';
            }
            return v === '' ? '' : (min === 0 && max === 0 ? v : (v <= min ? min : (v > max ? max : v)))
        }
    };
    return {
        restrict: 'A',
        scope: {
            model: '=ngModel'
        },
        link: function(scope, el, attr, ctrl) {
            $(function() {
                $(el).blur(function(e) {
                    if (attr.transform === 'number' && attr.type === 'number') {
                        scope.model = tfConfig.number(e, { min: attr.min, max: attr.max });
                        e.target.value = scope.model;
                    }
                });

                $(el).keydown(function(e) {
                    if (e.keyCode === 38 || e.keyCode === 40) {
                        e.preventDefault();
                    }
                });

                $(el).mousewheel(function(e) {
                    e.preventDefault();
                })
            })

        }
    }
}