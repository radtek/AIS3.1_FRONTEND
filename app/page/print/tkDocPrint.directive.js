module.exports = tkDocPrint;

function tkDocPrint() {
    return {
        restrict: 'AE',
        scope: {},
        replace: true,
        compile: function(elem, attrs) {
            $('body').empty().append(localStorage.htmlStr).width(0).height('initial').css('min-width', '0px');
            $('html').width(0).height('initial').css('min-width', '0px');
        }
    }
}
