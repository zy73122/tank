
/*
//类似print_r
var Mylog = {
        debug : function() {
            var n = arguments.length;
            var re_mut = [];
            re_mut.pusk([/\{/g, "\{\n"]); //替换前，替换后  
            re_mut.pusk([/\}\s*,/g, "\n},"]);
            re_mut.pusk([/,\s*\{/g, ",\n{"]);
            re_mut.pusk([/\[\{/g, "[\n{"]);
            re_mut.pusk([/\}\]/g, "\n}\n]"]);
            for (var i = 0; i < arguments.length; i++) {
                var t = arguments[i].toSource();
                var s = '';
                for (var j in re_mut) {
                    s += ' ';
                    var re = re_mut[j][0];
                    var rp = re_mut[j][1];
                    t = t.replace(re, rp);
                }
                cc.log(">>>" + t);
            }
        },
        empty : function(str) {
            var isEmpty = false;
            switch (typeof(str))
            {
            case "undefined": //未定义
                isEmpty = true;
                break;
            case "number":
                if (str == 0) {
                    isEmpty = true;
                }
                break;
            case "string":
                if (str == "") {
                    isEmpty = true;
                }
                break;
            case "boolean":
                if (str == false) {
                    isEmpty = true;
                }
                break;
            case "object": //对象,数组 和null
                if (str === null) {
                    isEmpty = true;
                }
                isEmpty = true;
                for (var k in str) {
                    if (!this.empty(str[k])) {
                        isEmpty = false;
                        break;
                    }
                }
                break;
            case "function":
                break;
            }
            return isEmpty;
        }
};
*/

/*
//类继承的测试
    cc.TestClass = function(){};
    cc.TestClass.extend = cc.Class.extend;

    var TestSubClass = cc.TestClass.extend({
        ctor:function(v){
            cc.log('11' + v);
        }
    });
    var a = new TestSubClass(2);
 */
