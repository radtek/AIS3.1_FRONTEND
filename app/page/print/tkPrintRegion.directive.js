module.exports = tkPrintRegion;

function tkPrintRegion() {
    return {
        restrict: 'A',
        scope: {
            tkPrintRegion: "="
        },
        link: function(scope, elem, attrs) {
            elem.on('click', function(event) {
                if ($('#' + attrs.tkPrintRegion).length) {
                    localStorage.htmlStr = $('#' + attrs.tkPrintRegion).prop('outerHTML');
                }
            });
        }
    }
}
