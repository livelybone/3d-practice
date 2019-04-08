(function ($) {
  $.fn.numberAnimate = function (setting) {
    var defaults = {
      speed: 1000,//动画速度
      num: 0, //初始化值
      iniAnimate: true, //是否要初始化动画效果
      symbol: ',',//默认的分割符号，千，万，千万
      dot: 0 //保留几位小数点
    };
    //如果setting为空，就取default的值
    setting = $.extend(defaults, setting);

    this.initNum = parseFloat(setting.num).toFixed(setting.dot);

    //如果对象有多个，提示出错
    if ($(this).length > 1) {
      alert("just only one obj!");
      return;
    }

    //如果未设置初始化值。提示出错
//  if(setting.num == ""){
//  	console.log(setting.num);
//    alert("must set a num!");
//    return;
//  }
    var nHtml = '<div class="mt-number-animate-dom flex-column" data-num="{{num}}">' +
      '<span class="mt-number-animate-span flex-row">0</span>' +
      '<span class="mt-number-animate-span flex-row">1</span>' +
      '<span class="mt-number-animate-span flex-row">2</span>' +
      '<span class="mt-number-animate-span flex-row">3</span>' +
      '<span class="mt-number-animate-span flex-row">4</span>' +
      '<span class="mt-number-animate-span flex-row">5</span>' +
      '<span class="mt-number-animate-span flex-row">6</span>' +
      '<span class="mt-number-animate-span flex-row">7</span>' +
      '<span class="mt-number-animate-span flex-row">8</span>' +
      '<span class="mt-number-animate-span flex-row">9</span>' +
      '<span class="mt-number-animate-span flex-row">.</span>' +
      '</div>';

    //数字处理
    var numToArr = function (num) {
      num = parseFloat(num).toFixed(setting.dot);
      var arrStr = null;
      if (typeof(num) === 'number') {
        arrStr = num.toString().split("");
      } else {
        arrStr = num.split("");
      }
      //console.log(arrStr);
      return arrStr;
    };

    //设置DOM symbol:分割符号
    var setNumDom = function (arrStr) {
      var shtml = '<div class="mt-number-animate flex-row">';
      for (var i = 0, len = arrStr.length; i < len; i++) {
        if (i !== 0 && (len - i) % 3 === 0 && setting.symbol !== "" && arrStr[i] !== ".") {
          shtml += '<div class="mt-number-animate-dot">' + setting.symbol + '</div>' + nHtml.replace("{{num}}", arrStr[i]);
        } else {
          shtml += nHtml.replace("{{num}}", arrStr[i]);
        }
      }
      shtml += '</div>';
      return shtml;
    };

    //执行动画
    this.runAnimate = function () {
      $(this).find(".mt-number-animate-dom").each(function () {
        var num = $(this).attr("data-num");
        num = (num === "." ? 10 : num);
        var spanHei = $(this).height() / 11; //11为元素个数
        var thisTop;
        if (num === 0) {
          thisTop = 0;
        } else {
          thisTop = -num * spanHei + "px";
        }
        if (thisTop !== $(this).css("top")) {
          if (setting.iniAnimate) {
            //HTML5不支持
            if (!window.applicationCache) {
              $(this).animate({
                top: thisTop
              }, setting.speed);
            } else {
              $(this).css({
                'transform': 'translateY(' + thisTop + ')',
                '-ms-transform': 'translateY(' + thisTop + ')', /* IE 9 */
                '-moz-transform': 'translateY(' + thisTop + ')', /* Firefox */
                '-webkit-transform': 'translateY(' + thisTop + ')', /* Safari 和 Chrome */
                '-o-transform': 'translateY(' + thisTop + ')',
                '-ms-transition': setting.speed / 1000 + 's',
                '-moz-transition': setting.speed / 1000 + 's',
                '-webkit-transition': setting.speed / 1000 + 's',
                '-o-transition': setting.speed / 1000 + 's',
                'transition': setting.speed / 1000 + 's'
              });
            }
          } else {
            setting.iniAnimate = true;
            $(this).css({
              top: thisTop
            });
          }
        }
      });
    };

    this.onResize = function (spanHei) {
      $(this).find(".mt-number-animate-dom").each(function () {
        var num = $(this).attr("data-num");
        num = (num === "." ? 10 : num);
        var spanHei = spanHei || parseFloat(document.documentElement.style.fontSize) * .7; //11为元素个数
        var thisTop;
        if (num === 0) {
          thisTop = 0;
        } else {
          thisTop = -num * spanHei + "px";
        }
        if (thisTop !== $(this).css("top")) {
          if (setting.iniAnimate) {
            //HTML5不支持
            if (!window.applicationCache) {
              $(this).animate({
                top: thisTop
              }, setting.speed);
            } else {
              $(this).css({
                'transform': 'translateY(' + thisTop + ')',
                '-ms-transform': 'translateY(' + thisTop + ')', /* IE 9 */
                '-moz-transform': 'translateY(' + thisTop + ')', /* Firefox */
                '-webkit-transform': 'translateY(' + thisTop + ')', /* Safari 和 Chrome */
                '-o-transform': 'translateY(' + thisTop + ')',
                '-ms-transition': 0 + 's',
                '-moz-transition': 0 + 's',
                '-webkit-transition': 0 + 's',
                '-o-transition': 0 + 's',
                'transition': 0 + 's'
              });
            }
          } else {
            setting.iniAnimate = true;
            $(this).css({
              top: thisTop
            });
          }
        }
      });
    };

    //初始化
    this.init = function () {
      //初始化
      $(this).html(setNumDom(numToArr(setting.num)));
      this.runAnimate();
    };

    //重置参数
    this.resetData = function (num) {
      if (this.initNum !== parseFloat(num).toFixed(setting.dot)) {
        this.initNum = parseFloat(num).toFixed(setting.dot);
        var newArr = numToArr(num);
        var $dom = $(this).find(".mt-number-animate-dom");
        if ($dom.length < newArr.length || $dom.length > newArr.length) {
          $(this).html(setNumDom(newArr));
        } else {
          $dom.each(function (index, el) {
            $(this).attr("data-num", newArr[index]);
          });
        }
        this.runAnimate();
      }
    };
    //init
    this.init();
    return this;
  }
})(jQuery);