module.exports = coverup;

function coverup() {
    return {
        restrict: 'EA',
        template: '<div class="modal fade" id="loadingModal"><div class="loading-modal"><div class="progress progress-striped active" style="margin-bottom: 0;"><div class="progress-bar" style="width: 100%;"></div></div><h5 style="font-weight: bold;">正在处理，请稍后...</h5></div></div>'
    }
}
