module.exports = iconSelect;

function iconSelect() {
    return {
        restrict: 'AE',
        scope: {
            path: '=ngModel',
            config: '=iConfig',
            disabled: '=ngDisabled'
        },
        template: '<div class="imgs" ng-mouseleave="moveLeave()">' +
            '<div class="icon" ng-click="showIcons()"><img src=""/></div>' +
            '<div class="icons" ng-show="iconDisp">' +
            '<div ng-click="hideIcons(item)" ng-repeat="item in config"><img src="{{item.codeValue}}" /></div>' +
            '</div>' +
            '</div>',
        css: ['.imgs {',
            '   position: relative;',
            '   height: 28px;',
            '   width: 28px;',
            '   .icon {',
            '       height: 100%;',
            '       width: 100%;',
            '       border: 1px solid #aaa;',
            '    }',
            '    img {',
            '       height: inherit;',
            '       width: inherit;',
            '    }',
            '    .icons {',
            '       display: flex;',
            '       position: absolute;',
            '       background-color: #eee;',
            '       left: -5px;',
            '       border-radius: 3px;',
            '       width: 124px;',
            '       flex-wrap: wrap;',
            '       z-index: 1;',
            '       padding: 2px;',
            '    }',
            '    .icons div {',
            '        width: 26px;',
            '        height: 26px;',
            '        margin: 2px;',
            '    }',
            '}'
        ].join(""),
        link: function(scope, em, attr, ctrl) {
            scope.iconDisp = false;
            if (!scope.path)
                scope.path = scope.config[0].path;
            em.find('.icon img').attr('src', scope.path);

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
                em.find('.icon img').attr('src', item.codeValue);
            }

            // 离开层
            scope.moveLeave = function() {
                scope.iconDisp = false;
            }
        }
    }
}
