module.exports = uiGridServe;

uiGridServe.$inject = ['$rootScope', '$timeout'];

function uiGridServe($rootScope, $timeout) {
    var promise,
        self = this;

    return {
        // 设置params
        params: function(opt) {
            var params = {
                pageNo: 1,
                pageSize: 15,
                sort: '',
                orderBy: '',
                filters: [],
                state: ''
            }
            if (typeof(opt) == 'object' && !angular.equals({}, opt))
                self.params = angular.extend(params, opt);
            else
                self.params = params;

            return self.params;
        },
        // 设置uiGrid的配置项
        option: function(opt, callback) {
            var gridOpt = {
                enableFiltering: true, // 过滤栏，默认false
                enableGridMenu: true, // 配置按钮，默认false
                enablePagination: true, // 分页，默认true                
                useExternalPagination: true, // 支持外部分页
                enableColumnMenus:false,//表头列的菜单按钮，默认false
				useExternalFiltering: true, // 使用外部过滤
                useExternalSorting: true, // 使用外部排序
                showGridFooter: false, // 页脚，默认false
                rowHeight: 40, // 行高，默认30
                paginationPageSizes: [5, 15, 30, 50], // 每页显示个数选项
                paginationPageSize: 15, // 每页显示个数
                /* 【自定义添加的属性】默认为 1
                 *  0：不支持uiGrid分页，并且不响应uiGrid所有事件
                 *  1：支持uiGrid分页，并且响应sortChanged、paginationChanged、filterChanged等所有事件，相当于后端分页
                 *  2：支持uiGrid分页，并且不响应uiGrid所有事件，相当于前端分页
                 *  一般的uiGrid分页显示数据，只需要设置 paginationState 就可以了。
                 */
                paginationState: 1,
                exporterFieldCallback:function(grid,row,col,value){//全部列字符串化
                    return "\t"+value;
                }
            };

            if (typeof(opt) == 'object' && !angular.equals({}, opt))
                self.gridOpt = angular.extend(gridOpt, opt);
            else
                self.gridOpt = gridOpt;

            // 设置paginationState在不同状态下uiGrid其它属性的变化
            if (self.gridOpt.paginationState == 0)
                self.gridOpt.showGridFooter = true;

            if (self.gridOpt.paginationState != 1) {
                self.gridOpt.useExternalPagination = false;
                self.gridOpt.useExternalFiltering = false;
                self.gridOpt.useExternalSorting = false;
                if (self.params) {
                    self.params.pageNo = undefined;
                    self.params.pageSize = undefined;
                }
            }

            if (self.gridOpt.paginationState == 2 && !opt.paginationPageSizes)
                self.gridOpt.paginationPageSizes = [15];

            // 设置uiGrid的pageSize
            if (self.params) {
                self.gridOpt.paginationCurrentPage = self.params.pageNo;
                self.gridOpt.paginationPageSize = self.params.pageSize;
            }

            gridOpt.onRegisterApi = function(gridApi) {
                $rootScope.gridApi = gridApi;
                if (self.gridOpt.useExternalSorting) {
                    gridApi.core.on.sortChanged($rootScope, function(grid, cols) {
                        if (cols.length == 0) {
                            self.params.orderBy = '';
                        } else if (cols.length == 1) {
                            self.params.orderBy = cols[0].sort.direction;
                            self.params.sort = cols[0].colDef.field;
                        } else if (cols.length > 1) {
                            self.params.orderBy = [];
                            self.params.sort = [];
                            angular.forEach(cols, function(item) {
                                self.params.orderBy.push(item.sort);
                                self.params.sort.push(item.colDef.field);
                            })
                        }
                        callback && callback();
                    });
                }
                if (self.gridOpt.useExternalPagination) {
                    gridApi.pagination.on.paginationChanged($rootScope, function(newPage, pageSize) {
                        self.params.pageNo = newPage;
                        self.params.pageSize = pageSize;
                        callback && callback(self);
                    });
                }
                if (self.gridOpt.useExternalFiltering) {
                    gridApi.core.on.filterChanged($rootScope, function() {
                        var _this = this;
                        if (promise) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function() {
                            var filterArr = [];
                            angular.forEach(_this.grid.columns, function(column) {
                                var fieldName = column.field,
                                    value = column.filters[0].term;
                                filterArr.push({
                                    field: fieldName,
                                    value: value ? value : ''
                                });
                            });
                            self.params.filters = filterArr;
                            callback && callback();
                        }, 1000)
                    });
                }
                if (gridApi.selection) {
                    gridApi.selection.on.rowSelectionChanged($rootScope, function(row) {
                        console.log(row)
                    })
                }
            }
            return self.gridOpt;
        },
        // 单元格被选中时触发
        cellFocus: function(row, col, fields, list) {
            var res = [];
            for (var field of fields) {
                if (field != col.field && row[field])
                    res.push(row[field]);
            }
            col.colDef.editDropdownOptionsArray = list.filter((field) => {
                var i = 0;
                for (; i < res.length; i++) {
                    if (field.userName == res[i]) {
                        break;
                    }
                }
                return i == res.length;
            });
            return col;
        },
        // 打印
        exports: function(name) {
            if (!name)
                name = new Date().getTime();
            self.gridOpt.exporterCsvFilename = name + '.csv',
                self.gridOpt.exporterOlderExcelCompatibility = true, //为true时不使用utf-16编码
                $rootScope.gridApi.exporter.csvExport('all', 'all');
        }
    }
}