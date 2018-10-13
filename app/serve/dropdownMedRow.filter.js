/*
 * 下拉选择项在渲染时，结构重构
 */
module.exports = dropdownMedRowFilter;

dropdownMedRowFilter.$inject = ['$sce'];

function dropdownMedRowFilter($sce) {
    return function(label, query, item, options, element) {
    	var str;
    	if(item.priceMinPackage != undefined)
    		str = '&nbsp;&nbsp;<span>￥'+ item.priceMinPackage +'</span>';
    	else if(item.price != undefined)
    		str = '&nbsp;&nbsp;<span>￥'+ item.price +'</span>';
        return $sce.trustAsHtml('<div><div>'+ label + str +'</div><label>'+ item.spec +'</label></div>');
    };
}