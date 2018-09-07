require('./jquery.ztree.core.min.js');
require('./jquery.ztree.exedit.min.js');
require('./jquery.ztree.excheck.min.js');
function zTree() {
    return {
        restrict: 'E',
        scope: {
            zOption: '=',
            zConfig: '=',
            ztree: '='
        },
        css: require('./metroStyle/metroStyle.css'),
        link: link
    }

    function link(scope, el) {
        var setting = scope.zConfig.setting;
        setting.callback = {};
        
        if (scope.zConfig && scope.zConfig.event) {
            bindevent();
        }

        scope.$watch(function() {
            return scope.zOption;
        }, function(value) {
            if (value)
                refreshTree();
        }, true);

        //点击菜单项
        function onMouseDown(event, treeId, treeNode) {
            scope.zSelected = treeNode;
            if (!scope.$$phase) {
                scope.$apply();
            }
        }

        function refreshTree() {
            $.fn.zTree.init($(el), setting, scope.zOption);
            scope.ztree = $.fn.zTree.getZTreeObj($(el).attr('id'));
        }

        function bindevent() {
            if (angular.isArray(scope.zConfig.event)) {
                angular.forEach(scope.zConfig.event, function(value, key) {
                    for (var e in value) {
                        setting.callback[e] = value[e];
                    }
                });
            }
        }
    }
}

module.exports = zTree;
