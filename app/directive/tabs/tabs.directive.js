module.exports = digiTabs;

function digiTabs() {
    return {
        template: require('./tabs.html'),
        less: require('./tabs.less'),
        replact: true,
        restrict: 'AE',
        scope: {
            tabs: '='
        },
        link: link,
        controller: ['$scope', '$state', controller]
    }

    function controller($scope, $state) {
        $scope.state = $state;
    }

    function link(scope, elem, attrs) {
        scope.leftUseLess = true;
        scope.rightUseLess = false;
        scope.isArrowHide = true;
        scope.$watch('tabs', function() {
            initTabs();
        }, true);
        scope.$watch('state.current.name', function(n, o) {
            angular.forEach(scope.tabs, function(tab, ind) {
                // if (tab.url.indexOf(n) >= 0) {
                //     scope.tabIndex = ind;
                // }
                // console.log(tab.url.substr(0,tab.url.indexOf('(')));
                if (tab.url.indexOf('(') === -1) {
                    if (tab.url === n) {
                        scope.tabIndex = ind;
                    }
                } else if (tab.url.substr(0,tab.url.indexOf('('))  === n) {
                    scope.tabIndex = ind;
                }
            })
        })

        function initTabs() {
            $(function() {
                $('#digi-tabs').css('left', 0); //当tabIndex改变时，这里不能设置为0
                if ($('#digi-tabs').width() < $('#digi-tabs-container').width()) {
                    $('#tab-scroll-right').hide();
                    $('#tab-scroll-left').hide();
                } else {
                    $('#tab-scroll-right').show();
                    $('#tab-scroll-left').show();
                }

                let $tabBox = $('#digi-tabs');
                let currLeft = $('#digi-tabs').css('left');
                let navTabWidth = $('#digi-tabs-container').width();
                $('#tab-scroll-right').unbind('mousedown')
                    .on('mousedown', (ev) => {
                        let currLeft = parseInt($tabBox.css('left'));
                        let totalWidth = $('#digi-tabs').width();
                        //判断是否已到最右边
                        if (currLeft > navTabWidth - totalWidth) {
                            let left = 0;
                            if (totalWidth + currLeft >= 2 * navTabWidth) {
                                left = currLeft - navTabWidth + 'px';

                            } else {
                                left = currLeft - (totalWidth + currLeft - navTabWidth) + 'px';
                                $('#tab-scroll-right').addClass('use-less');
                            }
                            $('#tab-scroll-left').removeClass('use-less');
                            $('#digi-tabs').animate({ left: left }, 1000);
                        } else {
                            $('#tab-scroll-right').addClass('use-less');
                        }


                    });
                $('#tab-scroll-left').unbind('mousedown')
                    .on('mousedown', (ev) => {
                        let currLeft = parseInt($tabBox.css('left'));
                        let totalWidth = $('#digi-tabs').width();
                        //判断是否已到最左边
                        if (currLeft < 0) {
                            let left = 0;
                            if (Math.abs(currLeft) > navTabWidth) {
                                left = currLeft + navTabWidth + 'px';

                            } else {
                                left = '0px';
                                $('#tab-scroll-left').addClass('use-less');
                            }
                            $('#tab-scroll-right').removeClass('use-less');
                            $('#digi-tabs').animate({ left: left }, 1000);
                        } else {
                            $('#tab-scroll-left').addClass('use-less');
                        }

                    });

            });
        }
    }
}
