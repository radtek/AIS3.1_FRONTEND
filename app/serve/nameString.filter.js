module.exports = nameString;

nameString.$inject = ['$sce'];

function nameString() {
    return function(list) {
        var str = '';
        if (!list || list.length < 1) return str;
        list.forEach(function(item) {
        	if (str == '')
        		str = item.name;
        	else
        		str += '，' + item.name;
        });
        return str;
    }
}