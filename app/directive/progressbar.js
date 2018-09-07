module.exports = progressbar;

function progressbar() {
    return {
        restrict: 'EA',
        template: '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">正在加载，请稍等</div></div>'
    }
}
