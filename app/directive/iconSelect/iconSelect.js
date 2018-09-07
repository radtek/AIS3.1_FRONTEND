module.exports = iconSelect;

function iconSelect() {
    return {
        restrict: 'AE',
        scope: {
            path: '=ngModel',
            config: '=iConfig',
            disabled: '=ngDisabled'
        },
        template: '<div class="iconSelectImgs" ng-mouseleave="moveLeave()">' +
            '<div class="icon" ng-click="showIcons()"><img src=""/></div>' +
            '<div class="icons" ng-show="iconDisp">' +
            '<div ng-click="hideIcons(item)" ng-repeat="item in config"><img ng-src="{{item.codeValue}}" /></div>' +
            '</div>' +
            '</div>',
        less: require('./iconSelect.less'),
        link: function(scope, em, attr, ctrl) {
            scope.iconDisp = false;
            if (!scope.path)
                scope.path = scope.config[0].path;
            $(em[0]).find('.icon img').attr('src', scope.path);

            // 显示层
            scope.showIcons = function() {
                if (scope.disabled)
                    return;
                scope.iconDisp = !scope.iconDisp;
            }

            // 隐藏层
            scope.hideIcons = function(item) {
                scope.iconDisp = false;
                scope.path = item.codeValue;
                $(em[0]).find('.icon img').attr('src', item.codeValue);
            }

            // 离开层
            scope.moveLeave = function() {
                scope.iconDisp = false;
            }
        }
    }
}
