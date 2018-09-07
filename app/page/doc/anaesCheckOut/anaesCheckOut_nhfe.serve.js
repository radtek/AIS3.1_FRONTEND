module.exports = anaesCheckOutServe;

anaesCheckOutServe.$inject = ['$rootScope', 'IHttp'];

function anaesCheckOutServe($rootScope, IHttp) {

    return {
        addCharge: function(option) {
            return IHttp.post('document/insertPackagesItem', option);
        },
        addBilling: function(option) {
            return IHttp.post('document/saveEventBilling', option);
        },
        save: function(option, isNeedSort) {
            option.isNeedSort = isNeedSort;
            return IHttp.post('statistics/updateMedIoCharge', option);
        },
        delPack: function(id) {
            return IHttp.post('document/deletePackagesItem', { pkItId: id });
        },
        delEte: function(id) {
            return IHttp.post('document/deleteBilling', { ebId: id });
        }
    }
}