module.exports = auth;

auth.$inject = ['IHttp', 'baseConfig'];

function auth(IHttp, baseConfig) {
    return {
        // 登录
        login: function(userInfo) {
            return IHttp.login(userInfo).then(function(rs) {
                if (rs.data.resultCode == 1) {
                    sessionStorage.setItem('user', JSON.stringify(rs.data.user));
                    sessionStorage.setItem('menu', JSON.stringify(rs.data.menus));
                    if (rs.data.roomId)
                        sessionStorage.setItem('roomId', rs.data.roomId);
                }
                return rs;
            });
        },
        // 退出
        logout: function() {
            for (var item in sessionStorage) {
                if (item != 'ipConfig')
                    sessionStorage.removeItem(item)
            }
            localStorage.clear();
            // return IHttp.logout().then(function(rs) {
            //     sessionStorage.clear();
            //     return rs;
            // });
        },
        // 是否有效的用户
        isAuthenticated: function() {
            return !!JSON.parse(sessionStorage.getItem('user'));
        },
        // 当前登录的用户信息
        loginUser: function() {
            return JSON.parse(sessionStorage.getItem('user'));
        },
        // 用户权限
        userPermission: function() {
            return JSON.parse(sessionStorage.getItem('menu'));
        },
        // 当前模块
        curModule: function(name) {
            var user = this.loginUser();
            user.module = name;
            sessionStorage.setItem('user', JSON.stringify(user));
        },
        // 获取roomId
        getRoomId: function() {
            if(sessionStorage.getItem('roomId') != 'undefined')
                return JSON.parse(sessionStorage.getItem('roomId'));
            else
                return '';
        },
        getDocAuth: function() {
            let bConfig = baseConfig.getOther(),
                user = this.loginUser(),
                saveActive = false;
            if (bConfig.majorUpdateFinishDoc == 1 && bConfig.assistantUpdateFinishDoc != 1) { //麻醉科主任和护士长也可以修改提交后的文书
                if (user.roleType === 'ANAES_DIRECTOR' || user.roleType === 'HEAD_NURSE' || user.roleType === 'ADMIN')
                    saveActive = true;
            }else if (bConfig.majorUpdateFinishDoc != 1 && bConfig.assistantUpdateFinishDoc == 1) {
                if (user.roleType === 'ANAES_DOCTOR' || user.roleType === 'NURSE' || user.roleType === 'ADMIN')
                    saveActive = true;
            }else if (bConfig.majorUpdateFinishDoc == 1 && bConfig.assistantUpdateFinishDoc == 1) {
                saveActive = true;
            }
            return saveActive;
        }
    }
}