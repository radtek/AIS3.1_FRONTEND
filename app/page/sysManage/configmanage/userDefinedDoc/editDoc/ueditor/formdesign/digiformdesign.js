/*
* 设计器私有的配置说明 
* 一
* UE.leipiFormDesignUrl  插件路径
* 
* 二
*UE.getEditor('myFormDesign',{
*          toolleipi:true,//是否显示，设计器的清单 tool
*/
UE.leipiFormDesignUrl = 'formdesign';
/**
 * 文本框
 * @command textfield
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'textfield');
 * ```
 */
UE.plugins['text'] = function () {
	var me = this,thePlugins = 'text';
	me.commands[thePlugins] = {
		execCommand:function () {
			var dialog = new UE.ui.Dialog({
				iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/text.html',
				name:thePlugins,
				editor:this,
				title: '文本框',
				cssRules:"width:600px;height:360px;",
				buttons:[
				{
					className:'edui-okbutton',
					label:'确定',
					onclick:function () {                                              
						dialog.close(true);
					}
				},
				{
					className:'edui-cancelbutton',
					label:'取消',
					onclick:function () {
						dialog.close(false);
					}
				}]
			});
			dialog.render();
			dialog.open();
		}
	};
	var popup = new baidu.editor.ui.Popup( {
		editor:this,
		content: '',
		className: 'edui-bubble',
		_edittext: function () {
			  baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
			  me.execCommand(thePlugins);              
			  this.hide();
		},
		_delete:function(){
			if( window.confirm('确认删除该控件吗？') ) {               
				baidu.editor.dom.domUtils.remove(this.anchorEl,false);
			}
			this.hide();
		}
	} );
	popup.render();
	me.addListener( 'mouseover', function( t, evt ) {
		evt = evt || window.event;
		var el = evt.target || evt.srcElement;
        var leipiPlugins = el.getAttribute('leipiplugins');
		if ( /input/ig.test( el.tagName ) && leipiPlugins==thePlugins) {
			var html = popup.formatHtml(
				'<nobr>文本框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
			if ( html ) {
				popup.getDom( 'content' ).innerHTML = html;
				popup.anchorEl = el;
				popup.showAnchor( popup.anchorEl );
			} else {
				popup.hide();
			}
		}
	});
};

/**
 * 日历时间
 * @command textfield
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'textfield');
 * ```
 */
UE.plugins['datetime'] = function () {
    var me = this,thePlugins = 'datetime';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/datetime.html',
                name:thePlugins,
                editor:this,
                title: '日历时间控件',
                cssRules:"width:600px;height:360px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {                                              
                        dialog.close(true);
                    }
                },
                {
                    className:'edui-cancelbutton',
                    label:'取消',
                    onclick:function () {
                        dialog.close(false);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
    var popup = new baidu.editor.ui.Popup( {
        editor:this,
        content: '',
        className: 'edui-bubble',
        _edittext: function () {
              baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
              me.execCommand(thePlugins);              
              this.hide();
        },
        _delete:function(){
            if( window.confirm('确认删除该控件吗？') ) {               
                baidu.editor.dom.domUtils.remove(this.anchorEl,false);
            }
            this.hide();
        }
    } );
    popup.render();
    me.addListener( 'mouseover', function( t, evt ) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var leipiPlugins = el.getAttribute('leipiplugins');
        if ( /datetime-picker/ig.test( el.tagName ) && leipiPlugins==thePlugins) {
            var html = popup.formatHtml(
                '<nobr>日历时间控件: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
            if ( html ) {
                popup.getDom( 'content' ).innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor( popup.anchorEl );
            } else {
                popup.hide();
            }
        }
    });
};

/**
 * 单选框组
 * @command radios
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'radio');
 * ```
 */
UE.plugins['radios'] = function () {
    var me = this,thePlugins = 'radios';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/radios.html',
                name:thePlugins,
                editor:this,
                title: '单选框组',
                cssRules:"width:590px;height:370px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                },
                {
                    className:'edui-cancelbutton',
                    label:'取消',
                    onclick:function () {
                        dialog.close(false);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
    var popup = new baidu.editor.ui.Popup( {
        editor:this,
        content: '',
        className: 'edui-bubble',
        _edittext: function () {
              baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
              me.execCommand(thePlugins);
              this.hide();
        },
        _delete:function(){
            if( window.confirm('确认删除该控件吗？') ) {
                baidu.editor.dom.domUtils.remove(this.anchorEl,false);
            }
            this.hide();
        }
    } );
    popup.render();
    me.addListener( 'mouseover', function( t, evt ) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var leipiPlugins = el.getAttribute('leipiplugins');
        if ( /span/ig.test( el.tagName ) && leipiPlugins==thePlugins) {
            var html = popup.formatHtml(
                '<nobr>单选框组: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
            if ( html ) {
                var elInput = el.getElementsByTagName("input");
                var rEl = elInput.length>0 ? elInput[0] : el;
                popup.getDom( 'content' ).innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor( rEl);
            } else {
                popup.hide();
            }
        }
    });
};
/**
 * 复选框组
 * @command checkboxs
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'checkboxs');
 * ```
 */
UE.plugins['checkboxs'] = function () {
    var me = this,thePlugins = 'checkboxs';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/checkboxs.html',
                name:thePlugins,
                editor:this,
                title: '复选框组',
                cssRules:"width:600px;height:400px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                },
                {
                    className:'edui-cancelbutton',
                    label:'取消',
                    onclick:function () {
                        dialog.close(false);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
    var popup = new baidu.editor.ui.Popup( {
        editor:this,
        content: '',
        className: 'edui-bubble',
        _edittext: function () {
              baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
              me.execCommand(thePlugins);
              this.hide();
        },
        _delete:function(){
            if( window.confirm('确认删除该控件吗？') ) {
                baidu.editor.dom.domUtils.remove(this.anchorEl,false);
            }
            this.hide();
        }
    } );
    popup.render();
    me.addListener( 'mouseover', function( t, evt ) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var leipiPlugins = el.getAttribute('leipiplugins');
        if ( /span/ig.test( el.tagName ) && leipiPlugins==thePlugins) {
            var html = popup.formatHtml(
                '<nobr>复选框组: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
            if ( html ) {
                var elInput = el.getElementsByTagName("input");
                var rEl = elInput.length>0 ? elInput[0] : el;
                popup.getDom( 'content' ).innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor( rEl);
            } else {
                popup.hide();
            }
        }
    });
};
/**
 * 多行文本框
 * @command textarea
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'textarea');
 * ```
 */
UE.plugins['textarea'] = function () {
    var me = this,thePlugins = 'textarea';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/textarea.html',
                name:thePlugins,
                editor:this,
                title: '多行文本框',
                cssRules:"width:600px;height:330px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                },
                {
                    className:'edui-cancelbutton',
                    label:'取消',
                    onclick:function () {
                        dialog.close(false);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
    var popup = new baidu.editor.ui.Popup( {
        editor:this,
        content: '',
        className: 'edui-bubble',
        _edittext: function () {
              baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
              me.execCommand(thePlugins);
              this.hide();
        },
        _delete:function(){
            if( window.confirm('确认删除该控件吗？') ) {
                baidu.editor.dom.domUtils.remove(this.anchorEl,false);
            }
            this.hide();
        }
    } );
    popup.render();
    me.addListener( 'mouseover', function( t, evt ) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        if ( /textarea/ig.test( el.tagName ) ) {
            var html = popup.formatHtml(
                '<nobr>多行文本框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
            if ( html ) {
                popup.getDom( 'content' ).innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor( popup.anchorEl );
            } else {
                popup.hide();
            }
        }
    });
};
/**
 * 下拉菜单
 * @command select
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'select');
 * ```
 */
UE.plugins['select'] = function () {
    var me = this,thePlugins = 'select';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/select.html',
                name:thePlugins,
                editor:this,
                title: '下拉菜单',
                cssRules:"width:590px;height:470px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                },
                {
                    className:'edui-cancelbutton',
                    label:'取消',
                    onclick:function () {
                        dialog.close(false);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
    var popup = new baidu.editor.ui.Popup( {
        editor:this,
        content: '',
        className: 'edui-bubble',
        _edittext: function () {
              baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
              me.execCommand(thePlugins);
              this.hide();
        },
        _delete:function(){
            if( window.confirm('确认删除该控件吗？') ) {
                baidu.editor.dom.domUtils.remove(this.anchorEl,false);
            }
            this.hide();
        }
    } );
    popup.render();
    me.addListener( 'mouseover', function( t, evt ) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var leipiPlugins = el.getAttribute('leipiplugins');
        if ( /select|span/ig.test( el.tagName ) && leipiPlugins==thePlugins) {
            var html = popup.formatHtml(
                '<nobr>下拉菜单: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
            if ( html ) {
                if(el.tagName=='SPAN')
                {
                    var elInput = el.getElementsByTagName("select");
                    el = elInput.length>0 ? elInput[0] : el;
                }
                popup.getDom( 'content' ).innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor( popup.anchorEl );
            } else {
                popup.hide();
            }
        }
    });

};
UE.plugins['template'] = function () {
    var me = this,thePlugins = 'template';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/template.html',
                name:thePlugins,
                editor:this,
                title: '表单模板',
                cssRules:"width:640px;height:380px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
};



UE.plugins['error'] = function () {
    var me = this,thePlugins = 'error';
    me.commands[thePlugins] = {
        execCommand:function () {
            var dialog = new UE.ui.Dialog({
                iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+'/error.html',
                name:thePlugins,
                editor:this,
                title: '异常提示',
                cssRules:"width:400px;height:130px;",
                buttons:[
                {
                    className:'edui-okbutton',
                    label:'确定',
                    onclick:function () {
                        dialog.close(true);
                    }
                }]
            });
            dialog.render();
            dialog.open();
        }
    };
};


UE.registerUI('text_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('text');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"文本框",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -896px -42px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});



UE.registerUI('textarea_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('textarea');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"文本域",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -927px -41px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});

UE.registerUI('datetime_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('datetime');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"日历时间控件",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -823px -20px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});

UE.registerUI('select_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('select');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"下拉框",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -871px -41px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});

UE.registerUI('radios_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('radios');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"单选框组",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -846px -41px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});
UE.registerUI('checkboxs_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            editor.execCommand('checkboxs');
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"复选框组",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -821px -41px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });
/*
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
*/
    //因为你是添加button,所以需要返回这个button
    return btn;
});


UE.registerUI('template_leipi',function(editor,uiName){
    if(!this.options.toolleipi)
    {
        return false;
    }
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            //try {
                editor.execCommand('template');
                //leipiFormDesign.fnCheckForm('save');
            //} catch ( e ) {
             //   alert('打开模板异常');
            //}
            
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"表单模板",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -844px -21px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
        }
    });

    //因为你是添加button,所以需要返回这个button
    return btn;
});
