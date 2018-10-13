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
            let result= JSON.parse(sessionStorage.getItem('user'));
            if(false){
                return angular.merge({},result,{
                    showImgTitle:true,//文书显示图片而非标题 邵阳
                    // hideRegion:true,  //黔南州中院 外部会诊 隐藏病区
                    // syncMidMed:true,//黔南州中院  手术核算单 同步术中药品
                    // syncMidMed:true,//黔南州中院  手术核算单 同步术中药品
                    optLevelListStyle:true,//麻醉记录单 手术分类default['一级', '二级', '三级', '四级']else['1', '2', '3', '4'];
                    outOperConfirm:true,//麻醉记录单 出室确认
                    eventCurrentTime2hours:true,//添加事件默认不能超过当前事件 
                    setSubType:true,//加载模板传subtype
                    // anesthesiaSummaryInspect:true,//麻醉总结/麻醉记录单二    验证必填项
                    optLevelRequire:false,//黔南州中医院基本信息才必填手术等级
                    NurseEnterOperRoomUrl:'midNursRecordLog_syzxyy',//护士开始手术url
                    enterPacuUrl:'pacuRecovery_base',//入PACU路由地址

                })
            }else{
                return result;
            }
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
        // 判断文书提交后是否可以修改
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