module.exports = IHttp;

IHttp.$inject = ['$rootScope', '$http', '$q', 'encrypt', 'toastr'];

function IHttp($rootScope, $http, $q, encrypt, toastr) {
    var tempModule;
    return {
        login: function(data) {
            var def = $q.defer();
            if (data.module == 'ctrlcent' || data.module == 'pacu' || data.module == 'lrgscrn') {
                tempModule = 'ctrlcent';
            }
            if (data.module == 'oprm') {
                tempModule = 'oprm';
            }
            $http({
                method: 'POST',
                url: $rootScope.baseUrl + 'sys/login?username=' + data.username + '&password=' + encrypt.md5(data.password) + '&logionBeid=' + data.logionBeid + '&module=' + tempModule,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(rs) {
                if (rs.data.resultCode != '1')
                    toastr.error(rs.data.resultMessage);
                def.resolve(rs);
            }, function(err) {
                console.log(new Date().toLocaleString(), err);
                toastr.error("服务器连接异常");
            });
            return def.promise;
        },
        logout: function() {
            var def = $q.defer(),
                user = JSON.parse(sessionStorage.getItem('user'));

            $http({
                method: 'POST',
                url: $rootScope.baseUrl + 'sys/logout?username=' + user.userName,
                headers: { 'beid': user.beid }
            }).then(function(rs) {
                if (rs.data.resultCode != '1')
                    toastr.error(rs.data.resultMessage);
                def.resolve(rs);
            }, function(err) {
                console.log(new Date().toLocaleString(), err);
                toastr.error("服务器连接异常");
            });
            return def.promise;
        },
        /* url: api路径
         * data: 参数
         * msg: 自定义的提示消息 module
         */
        post: function(url, data, msg) {
            var def = $q.defer(),
                user = JSON.parse(sessionStorage.getItem('user')),
                roomId = sessionStorage.getItem('roomId'),
                iElement = $rootScope.iElement;
            if (iElement)
                iElement.prop('disabled',true);
            $http({
                method: 'POST',
                url: $rootScope.baseUrl + url,
                headers: { 'x-token': user.token, 'beid': user.beid, 'roomId': roomId ? roomId : '', 'username': user.userName },
                data: data
            }).then(function(rs) {
                msg = msg ? msg : rs.data.resultMessage;
                if (iElement)
                    iElement.prop('disabled',false);
                $rootScope.iElement = null;
                if(rs.data.resultCode!='1' && msg){                                 
                    toastr.error(msg);
                    if(rs.data.resultCode==401 || rs.data.resultCode==402){
                        $rootScope.$state.go('login');
                        sessionStorage.clear();
                    }
                }
                def.resolve(rs);
            }, function(err) {
                console.log(new Date().toLocaleString(), err);
                toastr.error("服务器连接异常");
            });
            return def.promise;
        },
        get: function(url) {
            var def = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).then(function(rs) {
                def.resolve(rs);
            }, function(err) {
                console.log(new Date().toLocaleString(), err);
            });
            return def.promise;
        }
    }
}
