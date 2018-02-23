;( function ($) {
        'use strict';

        function vsAttrToArray() {

            this.set_defaults = function () {
                this.key = [];
                this.array = null;
                this.element = null;
                this.val_req = false;
            };

            this.set_key = function ($key) {
                var $this = this;
                if ( $key !== '' && typeof $key === 'object' ) {
                    $.each($key, function ($k, $v) {
                        $this.key.push($v);
                    })
                }
            };

            this.render_array = function () {
                var $this = this;
                $.each($this.key, function ($key, $value) {
                    $this.array = $this.hook_array($key, $value, $this.array);
                });
                return $this.array;
            };

            this.hook_array = function ($CK, $value, $arr) {
                if ( $arr === undefined ) {
                    $arr = this.array;
                }


                var $this = this;

                if ( $arr === null ) {
                    $arr = {};
                    $arr[$value] = null;
                } else if ( typeof $arr === 'object' || typeof $arr === 'array' ) {
                    $.each($arr, function ($key, $val) {
                        if ( $val === null ) {
                            if ( $arr[$key] === null ) {
                                $arr[$key] = {};
                            }

                            $arr[$key][$value] = ( ( $this.key.length - 1 ) === $CK && $this.val_req === true ) ? $this.element.val() : null;
                        } else if ( typeof $val === 'object' || typeof $val === 'array' ) {
                            $arr[$key] = $this.hook_array($CK, $value, $arr[$key]);
                        } else {
                        }
                    })
                } else {
                }

                return $arr;
            };

            this.run_regex = function ($name) {
                var $regex = /\w+(?!\[)[\w&.\-]+\w+/g;
                var $m = null;
                var $this = this;

                while ( ( $m = $regex.exec($name) ) !== null ) {
                    if ( $m.index === $regex.lastIndex ) {
                        $regex.lastIndex++;
                    }
                    $this.set_key($m);
                }

                return true;
            };

            this.get = function ($name, $element, $val) {
                var $this = this;
                $this.element = $element;
                $this.val_req = $val;
                this.run_regex($name);
                var $data = this.render_array();
                this.set_defaults();
                return $data;
            };

            this.get_key = function ($name) {
                this.run_regex($name);
                return ( this.key[0] !== undefined ) ? this.key[0] : null;
            };

            this.array_merge = function () {
                var args = Array.prototype.slice.call(arguments)
                var argl = args.length
                var arg
                var retObj = {}
                var k = ''
                var argil = 0
                var j = 0
                var i = 0
                var ct = 0
                var toStr = Object.prototype.toString
                var retArr = true

                for ( i = 0; i < argl; i++ ) {
                    if ( toStr.call(args[i]) !== '[object Array]' ) {
                        retArr = false
                        break
                    }
                }

                if ( retArr ) {
                    retArr = []
                    for ( i = 0; i < argl; i++ ) {
                        retArr = retArr.concat(args[i])
                    }
                    return retArr
                }

                for ( i = 0, ct = 0; i < argl; i++ ) {
                    arg = args[i]
                    if ( toStr.call(arg) === '[object Array]' ) {
                        for ( j = 0, argil = arg.length; j < argil; j++ ) {
                            retObj[ct++] = arg[j]
                        }
                    } else {
                        for ( k in arg ) {
                            if ( arg.hasOwnProperty(k) ) {
                                if ( parseInt(k, 10) + '' === k ) {
                                    retObj[ct++] = arg[k]
                                } else {
                                    retObj[k] = arg[k]
                                }
                            }
                        }
                    }
                }

                return retObj
            };

            this.array_merge_recursive = function (arr1, arr2) {
                var idx = '';
                if ( arr1 && Object.prototype.toString.call(arr1) === '[object Array]' &&
                    arr2 && Object.prototype.toString.call(arr2) === '[object Array]' ) {
                    for ( idx in arr2 ) {
                        arr1.push(arr2[idx])
                    }
                } else if ( ( arr1 && ( arr1 instanceof Object ) ) && ( arr2 && ( arr2 instanceof Object ) ) ) {
                    for ( idx in arr2 ) {
                        if ( idx in arr1 ) {
                            if ( typeof arr1[idx] === 'object' && typeof arr2 === 'object' ) {
                                arr1[idx] = this.array_merge_recursive(arr1[idx], arr2[idx]);
                            } else if ( typeof arr1[idx] === 'array' && typeof arr2 === 'array' ) {
                                arr1[idx] = this.array_merge(arr1[idx], arr2[idx]);
                            } else {
                                arr1[idx] = arr2[idx]
                            }
                        } else {
                            arr1[idx] = arr2[idx]
                        }
                    }
                }
                return arr1
            }

            this.set_defaults();
        }

        $.fn.inputToArray = function ($options) {
            var $ary = {};
            var $settings = $.extend({
                key: 'name',
                value: true,
            }, $options);

            var $arr = new vsAttrToArray();
            this.each(function () {
                var $name = $(this).attr($settings.key);
                if ( $name !== undefined ) {
                    var $r = $arr.get($name, $(this), $settings.value);
                    $ary = $arr.array_merge_recursive($r, $ary);
                }
            });
            return $ary;

        };

        $.fn.inputArrayKey = function ($name) {
            if ( $name === undefined ) {
                $name = 'name';
            }
            var $name = $(this).attr($name);
            if ( $name === undefined ) {
                return false;
            }
            var $arr = new vsAttrToArray();
            return $arr.get_key($name);
        }

    }(jQuery) );
