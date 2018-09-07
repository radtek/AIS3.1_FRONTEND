module.exports = dropdownAddRowFilter;

dropdownAddRowFilter.$inject = ['$sce'];

function dropdownAddRowFilter($sce) {
    return function(label, query, item, options, element) {
    	if(item && item.item && (item.item.spec || item.item.firm)){
    		item=item.item;
    	}       
    	item.firm=item.firm?item.firm:'';//不让没厂家的数据显示 undefined
        var html = '<div>' + label + '</div><small style="margin-left: 15px; margin-right: 15px;">'+ item.spec+'</small><small>'+ item.firm+'</small>';
        if(!item.firm&&!item.spec)var html = '<div>' + label + '</div>';//规格厂家都没就不加ROW
        return $sce.trustAsHtml(html);
    };
}
