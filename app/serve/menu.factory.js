module.exports = menu;

menu.$inject = ['$filter'];

function menu($filter) {
    return {
        // 分组
        group: function(data, crumbs) {
            if (!data)
                return;
            var temp = [{
                name: 'begining',
                arr: []
            }, {
                name: 'features',
                arr: []
            }, {
                name: 'management',
                arr: []
            }];
            for (var a = 0; a < data.length; a++) {
                if (data[a].isLeftMenu == 0)
                    continue;

                data[a].isOpen = false;
                data[a].active = false;
                if (data[a].parentId > 0) {
                    if (crumbs.length > 1 && data[a].url == crumbs[1].url) {
                        data[a].isOpen = true;
                        data[a].active = true;
                    }
                    continue;
                } else if (crumbs[0] && crumbs[0].id == data[a].id) {
                    data[a].active = true;
                    data[a].isOpen = true;
                }

                if (data[a].target == 'begining')
                    temp[0].arr.push(data[a]);
                else if (data[a].target == 'features')
                    temp[1].arr.push(data[a]);
                else if (data[a].target == 'management') {
                    var pages = getChild(data[a], data);
                    if (pages.length > 0)
                        data[a].pages = pages;
                    temp[2].arr.push(data[a]);
                }
            }
            return temp;
        },
        // 获取当前操作
        opt: function(url, data) {
            var obj = {},
                crumbs = [],
                tabsMenu = [],
                btnsMenu = [],
                docTableId="",
                currMenuId="",
                permission = "";
            for (var a = 0; a < data.length; a++) {
                if (url != data[a].url || data[a].type == 0)
                    continue;

                permission = data[a].permission;
                docTableId = data[a].docTableId;
                currMenuId = data[a].id;

                // 获取面包屑
                crumbs = getCrumbs(data[a], data);
                // 获取同级的tab
                tabsMenu = getTab(data[a], data);

                // 获取菜单按钮
                btnsMenu = getButton(data[a], data);
            }
            obj.crumbs = crumbs;
            obj.tabsMenu = tabsMenu;
            obj.permission = permission;
            obj.docTableId = docTableId;
            obj.currMenuId = currMenuId;
            obj.btnsMenu = btnsMenu;
            return obj;
        },
        target: function(item, data) {
            var arr = [],
                pages = [],
                menuItem;
            sessionStorage.removeItem("menuItem");
            data.forEach(function(i) {
                arr = i.arr;
                arr.forEach(function(j) {
                    if (angular.equals(item, j)) {
                        j.active = true;
                        j.isOpen = !j.isOpen;
                        menuItem = j;
                    } else {
                        pages = j.pages;
                        if (item.parentId == j.id) {
                            j.isOpen = true
                            pages.forEach(function(k) {
                                k.active = false;
                                if (item.id == k.id) {
                                    k.active = true;
                                    menuItem = k;
                                }
                            });
                        } else {
                            if (item.pages.length <= 0)
                                j.active = false;
                            j.isOpen = false;
                            pages.forEach(function(k) {
                                k.active = false;
                            });
                        }
                    }
                })
            });
            return data;
        }
    }

    // 获取被选中的菜单
    function setState(url, item, data) {
        var flag = false;
        var arr = $filter('filter')(data, function(v, k) {
            return url == item.url && url == v.url;
        });
        if (arr.length > 0)
            flag = true;
        return flag;
    }

    // 获取子级
    function getChild(item, data) {
        var arr = [];
        if (item.type == 0) {
            arr = $filter('filter')(data, function(v, k) {
                return v.parentId == item.id && v.isLeftMenu == 1;
            });
        }
        return arr;
    }

    // 获取面包屑
    function getCrumbs(item, data, arr) {
        if (arr == undefined)
            arr = [];
        var temp = [];
        if (item.parentId <= 0)
            arr.unshift(item);
        else {
            if (!(item.type == 0 && item.isLeftMenu == 0))
                arr.unshift(item);
            temp = $filter('filter')(data, function(v, k) {
                return v.id == item.parentId;
            });
            if (temp.length > 0)
                getCrumbs(temp[0], data, arr);
        }
        return arr;
    }

    // 获取tab菜单
    function getTab(item, data) {
        var arr = [];
        if (item.isLeftMenu == 0) {
            arr = $filter('filter')(data, function(v, k) {
                return v.parentIds == item.parentIds && item.type == 1 && item.url.length > 0;
            });
        }
        return arr.sort(compare('sort'));
    }

    // 获取菜单按钮
    function getButton(item, data) {
        var arr = [];
        arr = $filter('filter')(data, function(v, k) {
            return v.parentId == item.id && v.type == 0 && v.isLeftMenu == 0;
        });
        return arr;
    }

    function compare(field){
        return function(a, b){
            var sort1 = a[field];
            var sort2 = b[field];
            return sort1 - sort2;
        }
    }
}