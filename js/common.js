/**
 * @author liping
 * @date 2018-04-13
 * @qq：814091973
 * @remark1: 参数传入风格（参数个数<3的用普通的传参数实现，参数位置需要一一对应；>3的采用json对象传入，内部参数无序;==3的两种均可用）
 * @remark2: 变量、方法等命名规范：基本采用驼峰式写法，若有回调，则cb_开头，后面紧接驼峰式写法
 * 
 * 【content1】：loading、toast组件（需要配合样式和小图标）
 * 【content2】：常用时间操作（获取当前日期、日期加减等）
 * 【content3】：常用数组操作（数组按指定key分组、数组去重等）
 * 【footer】：公用的方法（参数合并、创建dom等）
 */

//============【content1】自定义常用ui插件(loadding、toast...) ============
function Lpui() {}
Lpui.prototype = {
    showLoading:function(options){
        /**
         * 【显示loading提示框】
         * @opacity(Number) :       loading 后面的遮罩层 透明度（default:.2）,(legalValue:0~1范围)
         * @msg(String) :           loading 时的提示文字，(default:'加载中...')
         * @duration(Number)：      loading 的显示时间，一般需要自动关闭时才需要用到，(default:0)
         **/
        //get options
        var deftOpt = {
            opacity:.2,
            msg:"加载中...",
            duration:0
        };
        var opt = combineKey(deftOpt,options);

        this.removeLoading();
        //draw loading html
        var loading = createDom('div',{"id":"lpui_loading","className":"lpui-loading-wrapper"},''); //loading wrapper
        var opacity_setting = 'opacity:'+opt.opacity;                                               //opacity setting
        var loading_mask = createDom('div',{className:'lpui-mask','style':opacity_setting},'');     //loading mask
        var loading_box = createDom('div',{className:'lpui-loading-box'},'');                       //loading box
        var loading_icon = createDom('i',{className:'lpui-loading-icon'},'');                       //loading icon
        var loading_content = createDom('p',{className:'lpui-loading-content'},'');                 //loading content
        loading_content.innerText = opt.msg;
        loading_box.appendChild(loading_icon);
        loading_box.appendChild(loading_content);
        loading.appendChild(loading_mask);
        loading.appendChild(loading_box);
        document.body.appendChild(loading);                                                         //add loading dom to the page
        var ts = this;
        if(opt.duration) setTimeout(ts.removeLoading,opt.duration);                                 //loading remove auto
    },
    removeLoading:function(){
        /**
         * 【隐藏loading提示框】
         **/
        var loading = document.getElementById("lpui_loading");
        if(loading) document.body.removeChild(loading);
    },
    showToast:function(options){
        /**
         * 【显示toast提示框】
         * @title(String) :         toast 标题文字，（default:'提示'）
         * @msg(String) :           toast 提示内容，（default:'内容'）
         * @type(String)：          toast 提示框类型，（default:'info'）,（legalValue:'info'/'error'/'success'/'warn'）
         * @width(Number)：         toast 外层box的宽度，（default:200）
         * @opacity(Number) :       loading 后面的遮罩层 透明度（default:.2）,(legalValue:0~1范围)
         * @handleClose(Boolean)：  toast 是否带手动关闭，（default:false）
         * @duration(Number)：      toast 设定自动关闭时间 （default:2500）
         **/
        //get options
        var deftOpt = {
            title:"提示",
            msg:"内容",
            type:"info",
            width:200,
            opacity:.2,
            handleClose:false,
            duration:2500
        };

        var opt = combineKey(deftOpt,options);

        this.removeToast();
        //draw toast html
        var toast = createDom('div',{"id":"lpui_toast","className":"lpui_toast-wrapper"},"");                                       //toast wrapper
        var opacity_setting = 'opacity:'+opt.opacity;                                                                               //toast setting
        var toast_mask = createDom('div',{className:'lpui-mask','style':opacity_setting},'');                                       //toast mask
        var toast_box = createDom('div',{"className":"lpui-toast-box"},'');                                                         //toast box
        if(opt.width) toast_box.style.width = opt.width +'px';
        var toast_title = createDom('h2',{"className":"lpui-toast-title"},'');                                                      //toast title
        var toast_title_ic_close = createDom('em',{"className":"lpui-icon lpui-toast-ic-close","title":"点击关闭"},'');              //toast title icon close
        var toast_title_txt = createDom('span',{"className":"lpui-toast-title-txt"},opt.title);                                     //toast title content
        var toast_content = createDom('div',{"className":"lpui-toast-content"},"");                                                 //toast content
        var toast_content_ic_type = createDom('em',{"id":"lpui_toast","className":"lpui-icon lpui-toast-ic-"+opt.type},"");         //toast type icon
        var toast_content_txt = createDom('span',{"className":"lpui-toast-content-txt"}, opt.msg);                                  //toast content txt
        var ts = this;
        if(opt.handleClose){                                                                                                        //toast handle close
            toast_title.appendChild(toast_title_ic_close);
            toast_title.onclick = function(){ts.removeToast();}
        }
        toast_title.appendChild(toast_title_txt);
        toast_content.appendChild(toast_content_ic_type);
        toast_content.appendChild(toast_content_txt);
        toast_box.appendChild(toast_title);
        toast_box.appendChild(toast_content);
        toast.appendChild(toast_mask);
        toast.appendChild(toast_box);
        document.body.appendChild(toast);                                                                                           //add toast dom to the page
        if(opt.duration) setTimeout(ts.removeToast,opt.duration);                                                                   //toast close auto

    },
    removeToast:function(){
        /**
         * 【隐藏toast提示框】
         **/
        var toast = document.getElementById("lpui_toast");
        if(toast) document.body.removeChild(toast);
    }
}
var lpui = new Lpui();



//============【content2】自定义常用时间操作(当前时间、倒计时、时间加减、当月有几天...) ============
function LpDt(){
    this.dt = new Date();
    this.y = this.dt.getFullYear();         //当年
    this.m = this.dt.getMonth() + 1;        //当月
    this.w = this.dt.getDay();              //今日周几
    this.d = this.dt.getDate();             //当日
    this.h = this.dt.getHours();            //当前时
    this.f = this.dt.getMinutes();          //当前分
    this.s = this.dt.getSeconds();          //当前秒
    this.ms = this.dt.getMilliseconds();    //当前毫秒
    this.timestamp = this.dt.valueOf();     //当前的时间戳（精确到毫秒：13位数）
}
LpDt.prototype = {
    isLeapYear:function(year){
        /**
         * 【判断指定年份否为闰年】
         * @year(Number || String)：指定的年份，（default:当年），（eg:2018）
         * => return(Boolean):      返回值：是否为闰年
         **/
        year = (year ? year : this.y).toString().substr(0,4);  //若传入了完整的日期，则截取前4位年份
        var isLeapYear = (year%400 == 0 || year%4 == 0 && year%100 !=0) ? true : false;
        return isLeapYear;
    },
    timestampToDateStr:function(timestamp,separator){
        /**
         * 【时间戳转日期时间】
         * @timestamp(Number) : 时间戳,（default:当前时间）
         * @separator(String) : 分隔符,（default:'-'）
         * => return(String):   返回值：转换后的日期
         **/
        timestamp = timestamp ? timestamp : this.timestamp;
        if(typeof timestamp == "string") timestamp = Number(timestamp);   //避免传入时间戳加了引号成string时做的优化
        separator = separator ? separator : '-';
        if(timestamp.toString().length == 10) timestamp = timestamp*1000 ;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var dt = new Date(timestamp);
        var y,m,d,h,m,s;
        y = dt.getFullYear();
        m = (dt.getMonth()+1 < 10 ? '0'+(dt.getMonth()+1) : dt.getMonth()+1);
        d = dt.getDate() < 10 ? '0'+dt.getDate() : dt.getDate();
        h = dt.getHours() < 10 ? '0'+dt.getHours() : dt.getHours();
        m = dt.getMinutes() < 10 ? '0'+dt.getMinutes() : dt.getMinutes();
        s = dt.getSeconds() < 10 ? '0'+dt.getSeconds() : dt.getSeconds();
        if(timestamp.toString().length == 13) s += ':'+ dt.getMilliseconds();
        var date = y+ separator + m + separator + d + ' ' + h + ':' + m + ':' +s;
        return date;
    },
    dateToTimestamp:function(date){
        /**
         * 【日期时间转时间戳】
         * @date(String) :      日期,（default:当前时间）
         * => return(Number):   返回值：转换后的时间戳
         **/
        date = date ? date : this.getNowTime();
        if(typeof date == "string"){
            date = new Date(date);  //日期格式的date 需要转成Object的类型的才能使用相关Date属性和方法
        }
        return date.getTime();
    },
    dateOperator: function (options) {
        /**
         * 【根据传入的开始日期、计算间隔（单位：天）、操作类型（加减操作）、分隔符 得到目标日期】
         * @startTime(String) : 从哪天开始计算,（default：当天）
         * @countDays(Number) : 每次加减的天数（单位：天）
         * @type(String)：      日期加减操作，(default:'+')（可选值：+/-）
         * @separator(String)： 日期分隔符，(default:'-')（eg:2018-01-01）
         * => return(String):   返回值：换算后的日期
         **/
        //get options
        var deftOpt = {
            startTime:this.getToday(this.separator),
            countDays:1,
            type:'+',
            separator:'-'
        };
        var opt = combineKey(deftOpt,options);
        var r = new Date(opt.startTime);  //转换成中国标准时间
        r = r.getTime();                                                    //标准时间 转 毫秒 便于计算
        if (opt.type == '+') {
            r = r + opt.countDays * 24 * 60 * 60 * 1000;
        } else if (opt.type == '-') {
            r = r - opt.countDays * 24 * 60 * 60 * 1000;
        } else {
            return false;
        }
        r = new Date(r);                                                     //换算好后 把毫秒 转 标准时间 便于对象取值（r.getMonth()+1 取月、r.getDate()取天等）
        var yy = r.getFullYear();
        var mm = (r.getMonth() + 1)< 10 ? '0' + (r.getMonth() + 1) : (r.getMonth() + 1);
        var dd = r.getDate()< 10 ? ('0' + r.getDate()) : r.getDate();
        var target_day = yy + opt.separator + mm + opt.separator + dd;
        return target_day;
    },
    getDateArr: function (startTime, endTime) {
        /**
         * 【根据传入的起止时间来算中间的日期间隔，返回日期数组】
         * @startTime(String) : 从哪天开始计算,（default:当天）
         * @endTime(String) :   到哪天结束
         * => return(Array):    返回值:指定起止日期范围内的日期数组
         **/
        startTime = startTime ? startTime : this.getToday();
        endTime = endTime ? endTime : this.getToday();
        var dateArr = [startTime]; //默认包括第一项
        while (startTime != endTime) {
            startTime = this.dateOperator({
                startTime:startTime
            });
            dateArr.push(startTime);
        }
        return dateArr;
    },
    getToday: function (separator) {
        /**
         * 【当天日期】
         * @separator(String)： 日期分隔符，(default:'-')，（legalValue:'-'/'/'）（eg:2018-01-01 or eg:2018/01/01）
         * => return(String):   返回值：当前日期
         **/
        separator = separator ? separator : '-';
        var today = this.y + separator + (this.m < 10 ? '0' + this.m : this.m) + separator + (this.d < 10 ? '0' + this.d : this.d);
        return today;
    },
    getNowTime: function (separator) {
        /**
         * 【获取当前时间，精确到秒】
         * @separator(String)： 日期分隔符，（default:'-'），（eg:2018-01-01 01:00）
         * => return(String):   返回值：当前时间
         **/
        separator = separator ? separator : '-';
        var nowTime = this.y + separator + (this.m < 10 ? '0' + this.m : this.m) + separator + (this.d < 10 ? '0' + this.d : this.d) + ' ' + (this.h < 10 ? '0' + this.h : this.h) + ':' + (this.f < 10 ? '0' + this.f : this.f) + ':' + (this.s < 10 ? '0' + this.s : this.s);
        return nowTime;
    },
    getWeeksByYear:function(year){
        /**
         * 【统计指定年份有几周，向下取整，取周的汇总】
         * @year(Number || String)：    指定年份,（default:当年),（eg:2018）
         * => return(Number):           返回值：指定年份总周数
         **/
        year = year ? year : this.y;
        var countDays = this.isLeapYear(year) ? 366 : 365;//获取该年的总天数，按除以7来向下取整，不满7天的不算一周
        var countWeeks = Math.floor(countDays/7);
        return countWeeks;
    },
    countDaysByDate :function(year,month){
        /**
         * 【统计指定年月有几天】
         * @year(Number || String)：  指定年份,（default:当年),（eg:2018）
         * @month(Number || String)： 指定月份,（default:当月),（eg:04）
         * => return(Number):         返回值：指定月份总天数
         **/
        month = month ? month : this.m;
        year = year ? year : this.y;
        var  countDays;
        switch (month){
            case 2:
                countDays = this.isLeapYear(year) ? 29 : 28; //2月平月：闰年29，非闰28
                break;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                countDays = 31;                           //大月：31
                break;
            default:
                countDays = 30;                           //小月：30
                break
        }
        return countDays;
    },
    countDown:function (options){
        /**
         * 【倒计时：从当前时间算起，固定时间的倒计时（单位：秒）】
         * @times(Number)：      需要倒计时的时间（单位：秒）,（default:60)
         * @format(String)：     倒计时显示的单位，（default:'秒'),(legalValue:'天时分秒'/'天'/'天时'/'天时分'/'天时分秒'）可选某个，也可组合
         * @callback(Function)： 计时器每次改遍时间后的回调方法，便于把计算后的值传出
         **/

        //get options
        var deftOpt = {
                times:60,
                format:'秒',
                callback:null
            };
        var opt = combineKey(deftOpt,options);
        var timer=null;
        timer=setInterval(function(){
            var d=0,h=0,m=0,s=0;
            d = Math.floor(opt.times / (60 * 60 * 24));
            h = Math.floor(opt.times / (60 * 60)) - (d * 24);
            m = Math.floor(opt.times / 60) - (d * 24 * 60) - (h * 60);
            s = Math.floor(opt.times) - (d * 24 * 60 * 60) - (h * 60 * 60) - (m * 60);
            if (d < 10) d = '0' + d;
            if (h < 10) h = '0' + h;
            if (m < 10) m = '0' + m;
            if (s < 10) s = '0' + s;
            var r = '';
            if(!opt.format){
                r = s + '秒';
            }else{
                if(opt.format.indexOf('天') != -1) r += d + '天';
                if(opt.format.indexOf('时') != -1) r += h + '时';
                if(opt.format.indexOf('分') != -1) r += m + '分';
                if(opt.format.indexOf('秒') != -1) r += s + '秒';
            }
            opt.callback(r);
            opt.times--;
        },1000);
        if(opt.times<=0){
            clearInterval(timer);
        }
    }
}
var lpdt = new LpDt();





//============【content3】自定义常用对象操作(数组按制定key分组、数组去重、数组按指定key排序、url参数与json互转...) ============
function LpObj(){}
LpObj.prototype = {
    urlParamsToJson: function (str) {
        /**
         * 【url参数转json】
         * @str(String) :       传入的url字符串（default:取当前地址栏）(eg:'http://www.baidu.com?a=1&b=2&c=3')
         * => return(Object):   返回值：json （eg:{a:1,b:2,c:3}）
         **/
        if (!str) str = location.href;// var url = "www.baidu.com?userid=6001&toid=123";
        var obj = {};
        str.replace(/([^?&]+)=([^?&]+)/g, function (s, v, k) {
            obj[v] = decodeURIComponent(k);
            return k + '=' + v;
        });
        return obj;
    },
    jsonToUrlParams: function (obj, firstHasChartAnd) {
        /**
         * 【json格式的参数转成字符串拼接到url上时使用】
         * @obj(Object) :                需要转成地址栏参数字符串的json对象
         * @firstHasChartAnd(Boolean) :  转换后的字符串首字符是否为&  （eg:&a=1&b=2&c=3）
         * * => return(String):          返回值：带&字符拼接好的string（eg:a=1&b=2&c=3）
         **/
        var params_arr = [];
        for (var i in obj) {
            params_arr.push("&" + i + "=" + obj[i]);
        }
        var str = params_arr.join("");
        if (!firstHasChartAnd) str = str.substring(1); //第一个字符不要&（一般直接跟在?后面才不要&）
        return str;
    },
    objDeepCopy:function(obj){
        /**
         * 【深拷贝对象】
         * @obj(Object) :      需要深拷贝的对象
         * => return(Object):  返回值：拷贝后的新对象
         **/
        var newO = {};
        if (obj instanceof Array)  newO = [];
        for ( var key in obj) {
            var val = obj[key];
            newO[key] = typeof val === 'object' ? arguments.callee(val) : val;
        }
        return newO;
    },
    getRandomItem:function(data){
        var len = data.length;
        var ran = parseInt(Math.random()*len); // array idx < array.length
        return data[ran];
    },
    removeTheSameByKey:function(data,key){
        /**
         * 【数组按key去重】
         * @data(Array) :     需要去重的目标数组
         * @key(String) :     根据该key值去重
         * => return(Array):  返回值：去重后的数组
         **/
        var obj = {}, arr = [];
        for (var i = 0; i < data.length; i++) {
            if (!obj[data[i][key]]) {
                obj[data[i][key]] = true;    //存入hash表
                arr.push(data[i]);           //把当前数组的当前项push到临时数组里面
            }
        }
        return arr;
    },
    groupByKey:function(data,key,keyArray){
        /**
         * 【数组按key分组】
         * @data(Array) :     需要分组的目标数组
         * @key(String) :     根据该key值分组
         * @keyArray(Array) : 最外面的分组是否还需要其他字段（这些字段只能为现有的字段中取）
         * => return(Array):  返回值：分组后的数组
         **/
        keyArray = keyArray&&keyArray.length ? keyArray : [];
        var map = {};
        var list = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (!map[item[key]]) {
                var obj = {};
                obj[key] = item[key]; //主键1
                for(var x in keyArray){         //其他键
                    obj[keyArray[x]] = item[keyArray[x]]
                }
                obj.newArr = [];
                obj.newArr.push(item);
                list.push(obj);
                map[item[key]] = item;

            } else {
                for (var j in list) {
                    if (list[j][key] == item[key]) {
                        list[j].newArr.push(item);
                        break;
                    }
                }
            }
        }
        return list;
    },
    sortByKey:function(data,key,type){
        /**
         * 【数组按key排序】
         * @data(Array) :     需要排序的目标数组
         * @key(String) :     根据该key值排序
         * @action(String) :  排序方式:默认升序(default:'up'),(legalValue:'up/down')
         * => return(Array):  返回值：排序后的数组
         **/
        type = type ? type : 'up';//默认升序

        var r = data.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        if(type == "down") r = r.reverse(); //降序
        return r;
    },
    sortByRandom:function(data){
        /**
         * 【随机数组：数组乱序】
         * @data(Array) :     需要随机排序的目标数组
         * => return(Array):  返回值：排序后的数组
         **/
        var len = data.length;
        var newArr = [];
        for(var i=0;i<len;i++){
            if(!data.length) break;
            var ran = parseInt(Math.random()*data.length);  // array idx < array.length
            newArr.push(data[ran]);
            data.splice(ran,1);                             //为避免添加重复的项，每选出一项后需要从原数组中清除该项
        }
        return newArr;
    }
}
var lpobj = new LpObj();




//============【footer】common function ============
function combineKey(defaultOpt,newOpt){
    //合并配置项，以传进来的为主，没有则使用旧的配置项
    for(var i in newOpt){
        if(newOpt[i]) defaultOpt[i] = newOpt[i];

    }
    return defaultOpt;
}
function createDom(tag,attrJson,txt){
    //动态创建dom(dom标签名称、属性json、innerText值)
    var obj = document.createElement(tag);
    for(var i in attrJson){
        obj[i] = attrJson[i];
        var idx = i.indexOf('style');
        if(idx != -1) obj.style.cssText = attrJson[i]; //若是css样式操作，则把样式放cssText里统一传入
    }
    if(txt) obj.innerText = txt;
    return obj;
}
function setTextById(objId,textContent){
    //给指定id的dom元素赋innerText值
    document.getElementById(objId).innerText = textContent;
}