
var toolArray = {
        /**
         * 获取数组的元素个数/获取字符串的长度
         * @param o 数组
         * @returns
         */
        count : function(o) {
            var t = typeof o;
            if(t == 'string'){
                return o.length;
            }else if(t == 'object'){
                var n = 0;
                for(var i in o){
                    n++;
                }
                return n;
            }
            return false;
        },
        
        /**
         * 移除指定值的元素
         * @param o 数组
         * @param v 值
         * @returns
         * @example
        var a = [1,2,3,4];
        var b = toolArray.remove(a, 2);
         */
        remove : function(o, v) {
            for (var k in o) {
                if (o[k] == v) {
                    o.splice(k, 1);
                }
            }
            return o;
        },
        
        /**
         * 检查数组中是否存在某个值
         * @param v 值
         * @param o 数组
         * @returns {Boolean}
         */
        inArray : function(v, o) {
            for (var k in o) {
                if (o[k] == v) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 将回调函数作用到给定数组的单元上
         * @param fun 函数
         * @param o 数组
         * @returns
         */
        map : function(fun, o) {
            for (var k in o) {
                fun(o[k]);
            }
            return o;
        }
}
