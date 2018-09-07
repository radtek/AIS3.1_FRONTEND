const crypto = require('crypto');

module.exports = encrypt;

function encrypt(){
	return {
		md5: function(str){
			return crypto.createHash('md5').update(str, 'utf8').digest('hex');
		}
	}
}
