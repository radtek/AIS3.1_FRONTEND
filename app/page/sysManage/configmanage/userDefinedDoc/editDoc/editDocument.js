$(document).ready(function () {
    var url =window.parent.location.href;
    var docThemeId = sessionStorage.getItem('docThemeId');//url.split('/')[url.split('/').length-1];
    var user = JSON.parse(sessionStorage.getItem('user'));
    var roomId = sessionStorage.getItem('roomId');
    var doc={};
    var ipPort = 'http://192.168.5.5:8189/';
    var btnActive = false;
    var editOption={
                //allowDivTransToP: false,//阻止转换div 为p
                toolleipi:true,//是否显示，设计器的 toolbars
                textarea: 'design_content',   
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                toolbars:[[
                 'source', '|', 'undo', 'redo', '|','bold', 'italic', 'underline', 'fontborder', 'strikethrough','superscript', 'subscript',  'removeformat','formatmatch', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist','|','rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal',  'spechars', 'simpleupload', 'wordimage', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols','pagebreak','|' ]],
                //focus时自动清空初始化时的内容
                //autoClearinitialContent:true,
                //关闭字数统计
                wordCount:false,
                //关闭elementPath
                elementPathEnabled:false,
                //默认的编辑区域高度
                initialFrameHeight:600 ,
                //提交到后台的数据是否包含整个html字符串
                allHtmlEnabled:true,
                // 是否自动长高,默认false
                autoHeightEnabled:false
                ///,iframeCssUrl:"css/bootstrap/css/bootstrap.css" //引入自身 css使编辑器兼容你网站css
                //更多其他参数，请参考ueditor.config.js中的配置项
    };
    var leipiEditor = UE.getEditor('myFormDesign',editOption); 
    $.ajax({
        type: 'POST',               
        contentType:'application/json;charset=UTF-8',               
        url : ipPort+'document/seachDocThemeById',
        dataType : 'json',
        processData:false,
        headers: { 'x-token': user.token, 'beid': user.beid, 'roomId': roomId, 'username': user.userName,'Accept': 'application/json, text/plain, */*'},// 
        data :JSON.stringify({'docThemeId' : docThemeId}),
        success : function(data){
            doc = data.docTheme;
            var originalHtml = doc.originalHtml;
            if(!!originalHtml){
                leipiEditor.addListener('ready', function (editor) { 
                    leipiEditor.setContent('');
                    leipiEditor.execCommand('inserthtml',originalHtml);
                });
            }                                 
        }
    });   
       
    var leipiFormDesign = {
        /*执行控件*/
        exec : function (method) {
            leipiEditor.execCommand(method);
        }
    };

    $("#btnsave").click(function(){
        //保存       
        doc.originalHtml = leipiEditor.getContent();
        doc.createTime=new Date(doc.createTime);
        doc.docTitleFormbean=undefined;
        if(!doc.originalHtml){
            alert('文书内容不能为空！')
            return false;            
        }
        $.ajax({
            type: 'POST',               
            contentType:'application/json;charset=UTF-8',               
            url : ipPort+'document/saveDocTheme',
            dataType : 'json',
            processData:false,
            headers: { 'x-token': user.token, 'beid': user.beid, 'roomId': roomId, 'username': user.userName,'Accept': 'application/json, text/plain, */*'},// 
            data :JSON.stringify(doc),
            success : function(data){
                if(data.resultCode=='1'){
                    alert('保存成功');
                }                           
            }
        });

    });

    $("#btnsubmit").click(function(){
        //提交审核
        doc.themeState=2;    
        doc.originalHtml=leipiEditor.getContent();
        if(!doc.originalHtml){
            alert('文书内容不能为空！')
            return false;            
        }
        
        var docTitleList=[];
        var template=doc.originalHtml;
        
        //使用正则方式获得解析后要最终展示在页面上的parseHtml和相关表和字段数据
        var preg =  /(\|-<span(((?!<span).)*leipiplugins=\"(radios|checkboxs|select|datetime)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select|datetime-picker|oi-select).*?(<\/select>|<\/textarea>|<\/datetime-picker>|<\/oi-select>|\/>))/gi,
            preg_attr =/(\w+)=\"(.?|.+?)\"/gi,preg_group =/<input.*?\/>/gi;
            
            var template_parse = template,template_data = new Array(),add_fields=[],checkboxs=0;

            var pno = 0;
            var fields=0;
            template.replace(preg, function(plugin,p1,p2,p3,p4,p5,p6){
                   
                var parse_attr = new Array(),attr_arr_all = new Object(),name = '', select_dot = '' , is_new=false;
                var p0 = plugin;
                var tag = p6 ? p6 : p4;

                console.log(tag + " \n- t1 - "+p1 +" \n-2- " +p2+" \n-3- " +p3+" \n-4- " +p4+" \n-5- " +p5+" \n-6- " +p6);

                if(tag == 'radios' || tag == 'checkboxs'){
                    plugin = p2;
                }else if(tag == 'select'){
                    plugin = plugin.replace('|-','');
                    plugin = plugin.replace('-|','');
                }
                plugin.replace(preg_attr, function(str0,attr,val) {
                       
                        if(attr=='name')
                        {
                            if(val=='leipiNewField')
                            {
                                is_new=true;
                                fields++;
                                val = 'data_'+fields;
                            }
                            name = val;
                        }
                        
                        if(tag=='select' && attr=='value')
                        {
                            if(!attr_arr_all[attr]) attr_arr_all[attr] = '';
                            attr_arr_all[attr] += select_dot + val;
                            select_dot = ',';
                        }else
                        {
                            attr_arr_all[attr] = val;
                        }
                        var oField = new Object();
                        oField[attr] = val;
                        parse_attr.push(oField);
                }) 
                /*alert(JSON.stringify(parse_attr));return;*/
                if(tag =='checkboxs') /*复选组  多个字段 */
                {
                    plugin = p0;
                    plugin = plugin.replace('|-','');
                    plugin = plugin.replace('-|','');
                    var name = 'checkboxs_'+checkboxs;
                    attr_arr_all['parse_name'] = name;
                    attr_arr_all['name'] = '';
                    attr_arr_all['value'] = '';
                    
                    attr_arr_all['content'] = '<span leipiplugins="checkboxs"  title="'+attr_arr_all['title']+'">';
                    var dot_name ='', dot_value = '';
                    p5.replace(preg_group, function(parse_group) {
                           
                        var is_new=false,option = new Object();
                        parse_group.replace(preg_attr, function(str0,k,val) {
                            if(k=='name')
                            {
                                if(val=='leipiNewField')
                                {
                                    is_new=true;
                                    fields++;
                                    val = 'data_'+fields;
                                }

                                attr_arr_all['name'] += dot_name + val;
                                dot_name = ',';

                            }
                            else if(k=='value')
                            {
                                attr_arr_all['value'] += dot_value + val;
                                dot_value = ',';

                            }
                            option[k] = val;    
                        });
                        
                        if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                        attr_arr_all['options'].push(option);
                        //if(!option['checked']) option['checked'] = '';
                        var checked = option['checked'] !=undefined ? 'checked="checked"' : '';
                        attr_arr_all['content'] +='<input type="checkbox" name="'+option['name']+'" value="'+option['value']+'"  '+checked+'/>'+option['value']+'&nbsp;';

                        if(is_new)
                        {
                            var arr = new Object();
                           // arr['name'] = option['name'];
                            //arr['leipiplugins'] = attr_arr_all['leipiplugins'];
                            //arr['title'] = attr_arr_all['title']

                            arr['fieldName'] = option['name'];
                            arr['plugins'] = attr_arr_all['leipiplugins'];
                            arr['title'] = attr_arr_all['title'];
                            arr['docThemeId'] = doc.docThemeId;
                            arr['fieldType'] ="varchar";
                            
                            if(!!attr_arr_all['ismast']){
                                arr['ismast'] = parseInt(attr_arr_all['ismast']);
                            }
                            arr['other'] = attr_arr_all['parse_name'];


                            add_fields.push(arr);

                        }

                    });
                    attr_arr_all['content'] += '</span>';
                    //parse
                    template = template.replace(plugin,attr_arr_all['content']);
                    template_parse = template_parse.replace(plugin,'{'+name+'}');
                    template_parse = template_parse.replace('{|-','');
                    template_parse = template_parse.replace('-|}','');
                    template_data[pno] = attr_arr_all;
                    checkboxs++;

                }
                else if(name){
                    if(tag =='radios') /*单选组  一个字段*/
                    {
                        plugin = p0;
                        plugin = plugin.replace('|-','');
                        plugin = plugin.replace('-|','');
                        attr_arr_all['value'] = '';
                        attr_arr_all['content'] = '<span leipiplugins="radios" name="'+attr_arr_all['name']+'" title="'+attr_arr_all['title']+'">';
                        var dot='';
                        p5.replace(preg_group, function(parse_group) {
                               
                            var option = new Object();
                            parse_group.replace(preg_attr, function(str0,k,val) {
                                if(k=='value')
                                {
                                    attr_arr_all['value'] += dot + val;
                                    dot = ',';
                                }
                                option[k] = val;    
                            });
                            option['name'] = attr_arr_all['name'];
                            if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                            attr_arr_all['options'].push(option);
                            //if(!option['checked']) option['checked'] = '';
                            var checked = option['checked'] !=undefined ? 'checked="checked"' : '';
                            attr_arr_all['content'] +='<input type="radio" name="'+attr_arr_all['name']+'" value="'+option['value']+'"  '+checked+'/>'+option['value']+'&nbsp;';

                        });
                        attr_arr_all['content'] += '</span>';

                    }else
                    {
                        attr_arr_all['content'] = is_new ? plugin.replace(/leipiNewField/,name) : plugin;
                    }
                    //attr_arr_all['itemid'] = fields;
                    //attr_arr_all['tag'] = tag;
                    template = template.replace(plugin,attr_arr_all['content']);
                    template_parse = template_parse.replace(plugin,'{'+name+'}');
                    template_parse = template_parse.replace('{|-','');
                    template_parse = template_parse.replace('-|}','');
                    if(is_new)
                    {
                        var arr = new Object();
                        arr['fieldName'] = name;
                        arr['plugins'] = attr_arr_all['leipiplugins'];
                        arr['title'] = attr_arr_all['title'];
                        arr['docThemeId'] = doc.docThemeId;
                        arr['fieldType'] ="varchar";
                        if(arr['plugins']=='datetime'){
                            arr['fieldType'] ='datetime';
                            arr['other'] = attr_arr_all['orgtype'];
                        }
                        if(attr_arr_all['leipiplugins']=='text' || attr_arr_all['leipiplugins']=='textarea'){
                            arr['fieldType'] = (attr_arr_all['orgtype']=="text" || attr_arr_all['leipiplugins']=='textarea')?"varchar":attr_arr_all['orgtype'];
                            if(!!attr_arr_all['maxlength']){
                                arr['maxlength'] = parseInt(attr_arr_all['maxlength']);
                            }
                            if(arr['fieldType'] =="int" || arr['fieldType'] =="float"){
                                if(!!attr_arr_all['max']){
                                  arr['maxdoc'] = parseFloat(attr_arr_all['max']);
                                }
                                if(!!attr_arr_all['min']){
                                  arr['mindoc'] = parseFloat(attr_arr_all['min']);
                                }
                            }                            
                        }
                        if(attr_arr_all['leipiplugins']=='select'){
                            arr['isDynamicSql'] = parseInt(attr_arr_all['orgdatatype']);
                            arr['maxlength'] = 30;
                            if(parseInt(arr['isDynamicSql'])==1){
                                arr['dynamicSql'] = attr_arr_all['txtsql'].replace(/&#39;/g,'\'');                                
                            }
                        }
                        if(!!attr_arr_all['ismast']){
                            arr['ismast'] = parseInt(attr_arr_all['ismast']);
                        }
                        //leipiplugins=\"text\" orgtype=\"text\";
                        //add_fields[arr['name']] = arr;
                        add_fields.push(arr);
                    }
                   // template_data[pno] = attr_arr_all;

                   
                }
               // pno++;
            })

            // var parse_form = new Object({
            //     'fields':fields,//总字段数
            //     'template':template,//完整html
            //     'parse':template_parse,//控件替换为{data_1}的html
            //     'data':template_data,//控件属性
            //     'add_fields':add_fields//新增控件
            // });
            // var jsonForm= JSON.stringify(parse_form);&#39;
        docTitleList=add_fields;
        doc.parseHtml=template.replace(/\{\|-/g,'').replace(/-\|\}/g,'').replace(/&#39;/g,'\'');
        //分页标记做多有3个。一般只分两页，一个分页符号的。
        doc.parseHtml=doc.parseHtml.replace("_ueditor_page_break_tag_","").replace("_ueditor_page_break_tag_","").replace("_ueditor_page_break_tag_","");
        doc.createTime=new Date(doc.createTime);
        doc.docTitleFormbean=undefined;

        var data={"docTheme":doc,"docTitleList":docTitleList};  
        btnActive = false;
        //参数   {"docTheme":文书对象,"docTitleList":标题对象列表}
        $.ajax({
            type: 'POST',               
            contentType:'application/json;charset=UTF-8',               
            url : ipPort+'document/batchSaveDocTitle',
            dataType : 'json',
            processData:false,
            headers: { 'x-token': user.token, 'beid': user.beid, 'roomId': roomId, 'username': user.userName,'Accept': 'application/json, text/plain, */*'},// 
            data :JSON.stringify(data),
            success : function(data){
                btnActive = true;
                if(data.resultCode=='1'){
                    alert('提交审核成功');                    
                }else {
                    alert('提交审核失败！');
                }                          
            }
        });        
    }); 

    
});