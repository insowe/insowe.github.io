var App = /** @class */ (function () {
    function App(_vals) {
        this.langCode = '';
        this.vals = _vals;
    }
    App.prototype.init = function () {
        var time = new Date();
        var year = time.getFullYear();
        $('.yearString').text(year);
        this.langCode = this.getQuery('lang') == '' ? 'tw' : this.getQuery('lang');
        this.getTranslate(this.langCode);
        console.log(this.vals['ie']);
        if (this.vals['ie'] == 11) {
            $('html').css({
                'overflow': 'hidden',
                'height': '100%'
            });
            $('body').css({
                'overflow': 'auto',
                'height': '100%'
            });
        }
    };
    App.prototype.addClass = function (ele, classStr) {
        $(ele).addClass(classStr);
    };
    App.prototype.removeClass = function (ele, classStr) {
        $(ele).removeClass(classStr);
    };
    App.prototype.toggleClass = function (ele, classStr) {
        $(ele).toggleClass(classStr);
    };
    App.prototype.menuClick = function (ele) {
        var section = '.' + $(ele).data('section');
        if (this.vals['ie'] != 11) {
            $('html, body').animate({ scrollTop: $(section).offset().top - $('#header').height() }, 500);
        }
        else {
            $('body').animate({ scrollTop: $('body').scrollTop() + $(section).offset().top - $('#header').height() }, 500);
        }
    };
    App.prototype.getTranslate = function (langCode) {
        var _this = this;
        var langs = ['en', 'tw'];
        var langJS = null;
        $.ajax({
            url: 'plugin/' + langCode + '.json',
            type: 'GET',
            dataType: 'json'
        }).done(function (resp) {
            _this.translate(resp);
        }).fail(function (jqXHR, textStatus) {
            console.log('collection error: ' + textStatus);
        });
    };
    App.prototype.translate = function (jsdata) {
        $.each($('[tkey]'), function (idx, ele) {
            var strTr = jsdata[$(ele).attr('tkey')];
            $(ele).html(strTr);
        });
    };
    App.prototype.getQuery = function (name) {
        var queryString = window.location.search.substring(1);
        var stringArray = queryString.split("&");
        for (var i = 0; i < stringArray.length; i++) {
            var string = stringArray[i].split("=");
            if (string[0] == name)
                return string[1];
        }
        return "";
    };
    App.prototype.changeLang = function () {
        if (this.langCode == 'tw') {
            location.search = '?lang=en';
        }
        else {
            location.search = '?lang=tw';
        }
    };
    return App;
}());
var Index = /** @class */ (function () {
    function Index(_vals) {
        this.vals = _vals;
    }
    Index.prototype.init = function () {
        var _this = this;
        this.vuePage = new Vue({
            el: '#index',
            data: {
                workData: {
                    category: [],
                    work: []
                },
                lightBox: {
                    img: {
                        imgName: '',
                        workName: ''
                    },
                    blog: {}
                },
                lang: this.vals['lang']
            },
            methods: {
                setCategoryClass: function (work) {
                    var temp = '';
                    $.each(work['tag']['en'], function (idx, ele) {
                        temp = temp + ele + ' ';
                    });
                    return temp;
                },
                setCategoryName: function (work) {
                    var _this = this;
                    var temp = '';
                    $.each(work['tag'][this.lang], function (idx, ele) {
                        if (idx != work['tag'][_this.lang].length - 1) {
                            temp = temp + ele + '/';
                        }
                        else {
                            temp = temp + ele;
                        }
                    });
                    return temp;
                }
            }
        });
        var swiper;
        $(window).load(function () {
            _this.aniDone();
            setTimeout(function () {
                swiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: {
                        delay: 2500
                    }
                });
                swiper.on('slideChange', function () {
                    $('.phoneInner').removeClass('active');
                    $('.phoneInner')[swiper.realIndex].classList.add("active");
                    //console.log( $('.phoneInner')[swiper.realIndex]);
                });
            }, 300);
        });
        console.log(this.vals['ie']);
        if (this.vals['ie'] != 11) {
            $(window).on('scroll', function () {
                _this.checkSectionPos();
            });
        }
        else {
            $('body').on('scroll', function () {
                _this.checkSectionPos();
            });
        }
        $(window).resize(function () {
            _this.windowH = $(window).height();
            _this.windowW = $(window).width();
            if (_this.vuePage.$data['workData']['work'].length != 0) {
                _this.setWork();
            }
        }).resize();
        $('.s1 .scrollBtn').on('click', function () {
            if (_this.vals['ie'] != 11) {
                $('html, body').animate({ scrollTop: $('.s2').offset().top }, 500);
            }
            else {
                $('html, body').animate({ scrollTop: $('body').scrollTop() + $('.s2').offset().top - $('#header').height() }, 500);
            }
        });
        this.getWork();
        $(".s3 .workBox").mCustomScrollbar({
            axis: "x",
            theme: "dark"
        });
        $("#insoweLightBoxWork").mCustomScrollbar({
            theme: "dark"
        });
    };
    Index.prototype.aniDone = function () {
        setTimeout(function () {
            $('.main').addClass('loading');
            $('.loadingMask').hide();
            $('#index .s1').addClass('active');
            setTimeout(function () {
                $('#index .s1').addClass('active2');
            }, 300);
        }, 1000);
    };
    Index.prototype.checkSectionPos = function () {
        var _this = this;
        var scrollTop = 0;
        var insoweSection = $('.insoweItem').not('.insoweOpen');
        var scrollBtm = 0;
        if (this.vals['ie'] != 11) {
            scrollTop = $(document).scrollTop();
        }
        else {
            scrollTop = $('body').scrollTop();
        }
        scrollBtm = scrollTop + this.windowH;
        insoweSection.each(function (idx, section) {
            var top = 0;
            var btm = 0;
            if (_this.vals['ie'] != 11) {
                top = $(section).offset().top + 150;
            }
            else {
                top = scrollTop + $(section).offset().top + 150;
            }
            btm = top + $(section).height();
            if ((top >= scrollTop && top <= scrollBtm) ||
                (btm >= scrollTop && btm <= scrollBtm) ||
                (top <= scrollTop && btm >= scrollBtm) ||
                (top >= scrollTop && btm <= scrollBtm)) {
                $(section).addClass('insoweOpen');
            }
        });
    };
    Index.prototype.getWork = function () {
        var _this = this;
        $.ajax({
            url: 'plugin/work.json',
            type: 'GET',
            dataType: 'json'
        }).done(function (resp) {
            _this.vuePage.$data['workData'] = resp;
            setTimeout(function () {
                _this.setWork();
            }, 500);
        }).fail(function (jqXHR, textStatus) {
            console.log('collection error: ' + textStatus);
        });
    };
    Index.prototype.setWork = function () {
        var workWallWidth = $('.s3 .content .work').width() * Math.ceil($('.s3 .content .work.active').length / 2);
        var workWallHeight = $('.s3 .content .work').width() * 2;
        $('.s3 .content .workWall').css({
            'width': workWallWidth,
            'height': workWallHeight
        });
        $(".s3 .workBox").mCustomScrollbar("destroy");
        $(".s3 .workBox").mCustomScrollbar({
            axis: "x",
            theme: "dark"
        });
    };
    Index.prototype.setCategory = function (ele) {
        var work = '.s3 .content .' + $(ele).data('category');
        $('.s3 .content .categoryItem a').removeClass('active');
        $(ele).addClass('active');
        $('.s3 .content .work').removeClass('active');
        $(work).addClass('active');
        $('.s3 .content .categoryMenu .selectBtn span').text($(ele).text());
        $('.s3 .categoryMenu ul').removeClass('active');
        this.setWork();
    };
    Index.prototype.setLightBoxImg = function (imgName, workName) {
        this.vuePage.$data['lightBox']['img']['imgName'] = imgName;
        this.vuePage.$data['lightBox']['img']['workName'] = workName;
        $('.insoweLightBox').show();
        $('.insoweLightBox .inner.work').css('display', 'inline-block');
        if ($(window).width() > 1024) {
            $("#insoweLightBoxWork").mCustomScrollbar("destroy");
            $("#insoweLightBoxWork").mCustomScrollbar({
                theme: "dark"
            });
        }
        else {
            $("#insoweLightBoxWork").mCustomScrollbar("destroy");
        }
    };
    Index.prototype.hideWorkImg = function () {
        $('.insoweLightBox').hide();
        this.vuePage.$data['lightBox']['img']['imgName'] = '';
        this.vuePage.$data['lightBox']['img']['workName'] = '';
    };
    Index.prototype.contactResult = function () {
        $('.s8 .contact .userName').val('');
        $('.s8 .contact .userMail').val('');
        $('.s8 .contact .userMSG').val('');
        if (this.vuePage.$data['lang'] == 'tw') {
            $('.s8 .contact .formMsg').text('發送成功！').addClass('active');
        }
        else {
            $('.s8 .contact .formMsg').text('Success!').addClass('active');
        }
    };
    return Index;
}());
