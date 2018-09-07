module.exports = scrollUp;

scrollUp.$inject = ['$timeout', '$interval'];

function scrollUp($timeout, $interval) {
    return {
        restrict: 'E',
        replace: true,
        scope: { data: '=' },
        template: '<li layout ng-repeat="item in data"><div flex="20"><b>{{item.title}}</b></div><div flex>{{item.content}}</div><div flex="20">{{item.time | date: "MM-dd hh:mm"}}</div><div flex="15">{{item.createUser}}</div></li>',
        link: link
    }

    function link(scope, el) {
        $timeout(function() {
            var box = $(el).parent(),
                i = 0,
                ms = 3000,
                timer,
                boxHeight = box.parent().height(),
                liLen = box.children("li").length,
                liHeight = box.children("li").height() + parseInt(box.children("li").css('border-bottom-width'));

            if (liLen * liHeight > boxHeight) {
                box.html(box.html() + box.html());

                // 开启定时器
                timer = $interval(slide, ms);

                // 清除定时器
                box.hover(function() {
                    $interval.cancel(timer);
                }, function() {
                    $interval.cancel(timer);
                    timer = $interval(slide, ms);
                })
            }

            function slide() {
                if (parseInt(box.css("margin-top")) > (-liLen * liHeight)) {
                    i++;
                    box.animate({
                        marginTop: '-' + liHeight * i + "px"
                    }, "slow");
                } else {
                    i = 0;
                    box.css("margin-top", "0px");
                }
            }
        });
    }
}