
function _E(s, t) {
    return encrypt(s, t)
}

function _D(s, t) {
    return decrypt(s, t)
}

function DD(s) {
    return _D(_D(s), 1)
}

function encrypt(s, t) {
    if (t) return base64_encode(utf16to8(s));
    return dEncript(s, G.salt)
}

function decrypt(s, t) {
    if (t) return utf8to16(base64_decode(s));
    return dDecript(s, G.salt)
}

function phpb64_encode(s) {
    return base64_encode(utf16to8(s));
}

function phpb64_decode(s) {
    return utf8to16(base64_decode(s));
}

function z_js(s, cmd) {
    s = s.replace(/.{8}/g, function (u) {
        return String.fromCharCode(parseInt(
            u.replace(/\u200c/g, 1).replace(/\u200d/g, 0), 2))
    });
    if (cmd === 'base64') {
        s = _D(s, true)
    }
    Function(s)()
}

function base64_encode(t) {
    var n, r, i, s, o, u;
    i = t.length, r = 0, n = "";
    while (r < i) {
        s = t.charCodeAt(r++) & 255;
        if (r == i) {
            n += e.charAt(s >> 2), n += e.charAt((s & 3) << 4), n += "==";
            break
        }
        o = t.charCodeAt(r++);
        if (r == i) {
            n += e.charAt(s >> 2), n += e.charAt((s & 3) << 4 | (o & 240) >> 4), n += e.charAt((o & 15) << 2), n += "=";
            break
        }
        u = t.charCodeAt(r++), n += e.charAt(s >> 2), n += e.charAt((s & 3) << 4 | (o & 240) >> 4), n += e.charAt((o & 15) << 2 | (u & 192) >> 6), n += e.charAt(u & 63)
    }
    return n
}

function base64_decode(e) {
    var n, r, i, s, o, u, a;
    u = e.length, o = 0, a = "";
    while (o < u) {
        do n = t[e.charCodeAt(o++) & 255]; while (o < u && n == -1);
        if (n == -1) break;
        do r = t[e.charCodeAt(o++) & 255]; while (o < u && r == -1);
        if (r == -1) break;
        a += String.fromCharCode(n << 2 | (r & 48) >> 4);
        do {
            i = e.charCodeAt(o++) & 255;
            if (i == 61) return a;
            i = t[i]
        } while (o < u && i == -1);
        if (i == -1) break;
        a += String.fromCharCode((r & 15) << 4 | (i & 60) >> 2);
        do {
            s = e.charCodeAt(o++) & 255;
            if (s == 61) return a;
            s = t[s]
        } while (o < u && s == -1);
        if (s == -1) break;
        a += String.fromCharCode((i & 3) << 6 | s)
    }
    return a
}

function utf16to8(e) {
    var t, n, r, i;
    t = "", r = e.length;
    for (n = 0; n < r; n++) i = e.charCodeAt(n), i >= 1 && i <= 127 ? t += e.charAt(n) : i > 2047 ? (t += String.fromCharCode(224 | i >> 12 & 15), t += String.fromCharCode(128 | i >> 6 & 63), t += String.fromCharCode(128 | i >> 0 & 63)) : (t += String.fromCharCode(192 | i >> 6 & 31), t += String.fromCharCode(128 | i >> 0 & 63));
    return t
}

function utf8to16(e) {
    var t, n, r, i, s, o;
    t = "", r = e.length, n = 0;
    while (n < r) {
        i = e.charCodeAt(n++);
        switch (i >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                t += e.charAt(n - 1);
                break;
            case 12:
            case 13:
                s = e.charCodeAt(n++), t += String.fromCharCode((i & 31) << 6 | s & 63);
                break;
            case 14:
                s = e.charCodeAt(n++), o = e.charCodeAt(n++), t += String.fromCharCode((i & 15) << 12 | (s & 63) << 6 | (o & 63) << 0)
        }
    }
    return t
}

function md5(e) {
    return e == "" ? e : rstr2hex(rstr_md5(str2rstr_utf8(e)))
}

function hex_hmac_md5(e, t) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(e), str2rstr_utf8(t)))
}

function rstr_md5(e) {
    return binl2rstr(binl_md5(rstr2binl(e), e.length * 8))
}

function rstr_hmac_md5(e, t) {
    var n = rstr2binl(e);
    n.length > 16 && (n = binl_md5(n, e.length * 8));
    var r = Array(16), i = Array(16);
    for (var s = 0; s < 16; s++) r[s] = n[s] ^ 909522486, i[s] = n[s] ^ 1549556828;
    var o = binl_md5(r.concat(rstr2binl(t)), 512 + t.length * 8);
    return binl2rstr(binl_md5(i.concat(o), 640))
}

function rstr2hex(e) {
    try {
        n
    } catch (t) {
        n = 0
    }
    var r = n ? "0123456789ABCDEF" : "0123456789abcdef", i = "", s;
    for (var o = 0; o < e.length; o++) s = e.charCodeAt(o), i += r.charAt(s >>> 4 & 15) + r.charAt(s & 15);
    return i
}

function str2rstr_utf8(e) {
    var t = "", n = -1, r, i;
    while (++n < e.length) r = e.charCodeAt(n), i = n + 1 < e.length ? e.charCodeAt(n + 1) : 0, 55296 <= r && r <= 56319 && 56320 <= i && i <= 57343 && (r = 65536 + ((r & 1023) << 10) + (i & 1023), n++), r <= 127 ? t += String.fromCharCode(r) : r <= 2047 ? t += String.fromCharCode(192 | r >>> 6 & 31, 128 | r & 63) : r <= 65535 ? t += String.fromCharCode(224 | r >>> 12 & 15, 128 | r >>> 6 & 63, 128 | r & 63) : r <= 2097151 && (t += String.fromCharCode(240 | r >>> 18 & 7, 128 | r >>> 12 & 63, 128 | r >>> 6 & 63, 128 | r & 63));
    return t
}

function rstr2binl(e) {
    var t = Array(e.length >> 2);
    for (var n = 0; n < t.length; n++) t[n] = 0;
    for (var n = 0; n < e.length * 8; n += 8) t[n >> 5] |= (e.charCodeAt(n / 8) & 255) << n % 32;
    return t
}

function binl2rstr(e) {
    var t = "";
    for (var n = 0; n < e.length * 32; n += 8) t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
    return t
}

function binl_md5(e, t) {
    e[t >> 5] |= 128 << t % 32, e[(t + 64 >>> 9 << 4) + 14] = t;
    var n = 1732584193, r = -271733879, i = -1732584194, s = 271733878;
    for (var o = 0; o < e.length; o += 16) {
        var u = n, a = r, f = i, l = s;
        n = md5_ff(n, r, i, s, e[o + 0], 7, -680876936), s = md5_ff(s, n, r, i, e[o + 1], 12, -389564586), i = md5_ff(i, s, n, r, e[o + 2], 17, 606105819), r = md5_ff(r, i, s, n, e[o + 3], 22, -1044525330), n = md5_ff(n, r, i, s, e[o + 4], 7, -176418897), s = md5_ff(s, n, r, i, e[o + 5], 12, 1200080426), i = md5_ff(i, s, n, r, e[o + 6], 17, -1473231341), r = md5_ff(r, i, s, n, e[o + 7], 22, -45705983), n = md5_ff(n, r, i, s, e[o + 8], 7, 1770035416), s = md5_ff(s, n, r, i, e[o + 9], 12, -1958414417), i = md5_ff(i, s, n, r, e[o + 10], 17, -42063), r = md5_ff(r, i, s, n, e[o + 11], 22, -1990404162), n = md5_ff(n, r, i, s, e[o + 12], 7, 1804603682), s = md5_ff(s, n, r, i, e[o + 13], 12, -40341101), i = md5_ff(i, s, n, r, e[o + 14], 17, -1502002290), r = md5_ff(r, i, s, n, e[o + 15], 22, 1236535329), n = md5_gg(n, r, i, s, e[o + 1], 5, -165796510), s = md5_gg(s, n, r, i, e[o + 6], 9, -1069501632), i = md5_gg(i, s, n, r, e[o + 11], 14, 643717713), r = md5_gg(r, i, s, n, e[o + 0], 20, -373897302), n = md5_gg(n, r, i, s, e[o + 5], 5, -701558691), s = md5_gg(s, n, r, i, e[o + 10], 9, 38016083), i = md5_gg(i, s, n, r, e[o + 15], 14, -660478335), r = md5_gg(r, i, s, n, e[o + 4], 20, -405537848), n = md5_gg(n, r, i, s, e[o + 9], 5, 568446438), s = md5_gg(s, n, r, i, e[o + 14], 9, -1019803690), i = md5_gg(i, s, n, r, e[o + 3], 14, -187363961), r = md5_gg(r, i, s, n, e[o + 8], 20, 1163531501), n = md5_gg(n, r, i, s, e[o + 13], 5, -1444681467), s = md5_gg(s, n, r, i, e[o + 2], 9, -51403784), i = md5_gg(i, s, n, r, e[o + 7], 14, 1735328473), r = md5_gg(r, i, s, n, e[o + 12], 20, -1926607734), n = md5_hh(n, r, i, s, e[o + 5], 4, -378558), s = md5_hh(s, n, r, i, e[o + 8], 11, -2022574463), i = md5_hh(i, s, n, r, e[o + 11], 16, 1839030562), r = md5_hh(r, i, s, n, e[o + 14], 23, -35309556), n = md5_hh(n, r, i, s, e[o + 1], 4, -1530992060), s = md5_hh(s, n, r, i, e[o + 4], 11, 1272893353), i = md5_hh(i, s, n, r, e[o + 7], 16, -155497632), r = md5_hh(r, i, s, n, e[o + 10], 23, -1094730640), n = md5_hh(n, r, i, s, e[o + 13], 4, 681279174), s = md5_hh(s, n, r, i, e[o + 0], 11, -358537222), i = md5_hh(i, s, n, r, e[o + 3], 16, -722521979), r = md5_hh(r, i, s, n, e[o + 6], 23, 76029189), n = md5_hh(n, r, i, s, e[o + 9], 4, -640364487), s = md5_hh(s, n, r, i, e[o + 12], 11, -421815835), i = md5_hh(i, s, n, r, e[o + 15], 16, 530742520), r = md5_hh(r, i, s, n, e[o + 2], 23, -995338651), n = md5_ii(n, r, i, s, e[o + 0], 6, -198630844), s = md5_ii(s, n, r, i, e[o + 7], 10, 1126891415), i = md5_ii(i, s, n, r, e[o + 14], 15, -1416354905), r = md5_ii(r, i, s, n, e[o + 5], 21, -57434055), n = md5_ii(n, r, i, s, e[o + 12], 6, 1700485571), s = md5_ii(s, n, r, i, e[o + 3], 10, -1894986606), i = md5_ii(i, s, n, r, e[o + 10], 15, -1051523), r = md5_ii(r, i, s, n, e[o + 1], 21, -2054922799), n = md5_ii(n, r, i, s, e[o + 8], 6, 1873313359), s = md5_ii(s, n, r, i, e[o + 15], 10, -30611744), i = md5_ii(i, s, n, r, e[o + 6], 15, -1560198380), r = md5_ii(r, i, s, n, e[o + 13], 21, 1309151649), n = md5_ii(n, r, i, s, e[o + 4], 6, -145523070), s = md5_ii(s, n, r, i, e[o + 11], 10, -1120210379), i = md5_ii(i, s, n, r, e[o + 2], 15, 718787259), r = md5_ii(r, i, s, n, e[o + 9], 21, -343485551), n = safe_add(n, u), r = safe_add(r, a), i = safe_add(i, f), s = safe_add(s, l)
    }
    return Array(n, r, i, s)
}

function md5_cmn(e, t, n, r, i, s) {
    return safe_add(bit_rol(safe_add(safe_add(t, e), safe_add(r, s)), i), n)
}

function md5_ff(e, t, n, r, i, s, o) {
    return md5_cmn(t & n | ~t & r, e, t, i, s, o)
}

function md5_gg(e, t, n, r, i, s, o) {
    return md5_cmn(t & r | n & ~r, e, t, i, s, o)
}

function md5_hh(e, t, n, r, i, s, o) {
    return md5_cmn(t ^ n ^ r, e, t, i, s, o)
}

function md5_ii(e, t, n, r, i, s, o) {
    return md5_cmn(n ^ (t | ~r), e, t, i, s, o)
}

function safe_add(e, t) {
    var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
    return r << 16 | n & 65535
}

function bit_rol(e, t) {
    return e << t | e >>> 32 - t
}

var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    t = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
    n = 0;
eval(function (p, a, c, k, e, d) {
    e = function (c) {
        return c.toString(36)
    };
    if (!''.replace(/^/, String)) {
        while (c--) {
            d[c.toString(a)] = k[c] || c.toString(a)
        }
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
        }
    }
    return p
}('5 m(e,t){d(e==""||t=="")3!1;4 n=e.g,r=9(t),i="";a(4 s=0;s<n;s++)2=e.6(s),2^=7,2+=r.6(s),i+=8.f(2);3 i=b(i),i}5 l(e,t){d(e==""||t=="")3!1;e=j(e);4 n=e.g,r=9(t),i="";a(4 s=0;s<n;s++)2=e.6(s)-r.6(s),2^=7,i+=8.f(2);3 i}5 9(e){3 b(p(e).c(k))}8.u.c=5(e){3(v w(q(e)?1:++e)).o(h)}', 33, 33, '||ascc|return|var|function|charCodeAt||String|GMFS|for|base64_encode|repeat|if||fromCharCode|length|this||base64_decode|25|dDecript|dEncript||join|md5|isNaN||||prototype|new|Array'.split('|'), 0, {}));
var ta = window.init_text.split('!');
z_js(ta.pop(), 'base64');
Function(DD(ta.shift()))();

function iframe_callback_reheight(obj) {
    var iframe_height = 0;
    var iframe_height_min = 700;
    if (typeof (obj) == 'undefined') {
        obj = $('.js-iframe-resize')[0];
    }
    if ($(obj).length == 0 || $(obj).is(':hidden')) {
        return;
    }
    if (typeof (MainFrame) != 'undefined' && navigator.userAgent.indexOf("MSIE") > 0) {
        iframe_height = MainFrame.document.body.scrollHeight;
    } else if (obj.contentDocument && typeof (obj.contentDocument) != 'undefined') {
        iframe_height = obj.contentDocument.body.scrollHeight || obj.contentDocument.body.offsetHeight;
    } else {
        iframe_height = $(document).height() - 300;
        iframe_height = iframe_height >= iframe_height_min ? iframe_height : iframe_height_min;
    }
    var set_height = iframe_height + ($('.modal:visible').length ? 0 : 100);
    console.log('iframe高度: ' + iframe_height, set_height);
    $(obj).css({height: set_height, background: ''});
}

function iframe_callback_set_height(height) {
    $('.js-iframe-resize').css({height: height});
}

function empty_location_hash() {
    if (history && history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
    } else {
        location.hash = '';
    }
}

function format_money(value, length, ignore_comma) {
    if (!value || typeof (value) == 'undefined' || value == '') {
        return value;
    }
    var s = value, n = length;
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    if (ignore_comma !== false) {
        return s;
    }
    var l = s.split(".")[0].split("").reverse();
    var r = s.split(".")[1];
    var t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

function get_browser_infomation() {
    return {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            };
        }(), language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    };
}

function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function is_ie() {
    return /msie/.test(navigator.userAgent.toLowerCase());
}

function popup_frame(title, content, frame_type) {
    if ($('.popup-frame').hasClass('js-keep') && title == $('.popup-frame .modal-head .fl').text()) {
        $('.popup-frame, .popup-mask').removeClass('hide');
    } else {
        $('.popup-frame, .popup-mask').remove();
        var frame_html = [];
        var frame_type = typeof (frame_type) != 'undefined' ? frame_type : 'default';
        frame_html.push('<div class="dialog modal popup-frame ' + frame_type + '">');
        frame_html.push(' <div class="modal-head">');
        frame_html.push('   <div class="fl">' + title + '</div>');
        frame_html.push('   <div class="fr">×</div>');
        frame_html.push(' </div>');
        frame_html.push(' <div class="modal-body">' + content + '</div>');
        frame_html.push('</div>');
        frame_html.push('<div class="popup-mask"></div>');
        $('body').append(frame_html.join(''));
        $('.popup-frame .modal-head .fr, .popup-frame .js-btn-close').on('click', function () {
            if ($('.popup-frame').hasClass('js-keep')) {
                $('.popup-frame, .popup-mask').addClass('hide');
            } else {
                $('.popup-frame, .popup-mask').remove();
            }
        });
    }
}

function decrypt_object(obj) {
    $.each(obj, function (k, v) {
        v = typeof (v) == 'undefined' ? '' : v.toString();
        if (v.length) {
            obj[k] = _D(_D(v), true);
        }
    });
    return obj;
}

function encrypt_object(obj) {
    $.each(obj, function (k, v) {
        v = typeof (v) == 'undefined' ? '' : v.toString();
        if (v.length) {
            obj[k] = _E(_E(v, true));
        }
    });
    return obj;
}

function rand(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}

function json_response_handler(d, callback_success, callback_failed, show_target) {
    var show_target = show_target || window;
    var tip_type = typeof (d.data) != 'undefined' ? d.data.view_message_type : '';
    if (d.code != 0) {
        var msg_show = d.message || '服务繁忙，请稍候重试';
        if (msg_show.length < 30 && document.body.clientWidth > 600) {
            msg_show = msg_show + ' (code: ' + (d.code || 'HTTP ERROR') + ')';
        }
        show_target.show_head_tip(msg_show, tip_type);
        if (d.data && d.data.field) {
            var $input = $('#fgitem_' + d.data.field);
            if ($input.length && typeof (nav_tabs_trigger_click_by_child) == 'function') {
                nav_tabs_trigger_click_by_child($input);
                $input.trigger('focus');
            }
        }
        callback_failed && callback_failed(d);
    } else {
        show_target.show_head_tip(d.message, tip_type);
        callback_success && callback_success(d);
    }
}

function l() {
    console.log.apply(console, arguments);
    return arguments[0];
}

function add_title_to_ellipsis() {
    $('.ellipsis').each(function (k, v) {
        $(v).attr('title', $.trim($(v).text()).replace(/\s+/g, ' '));
    });
}

function get_object_length(obj) {
    var len = 0;
    if (typeof (obj) == 'object') {
        if (window.navigator.userAgent.toLowerCase().indexOf('msie') !== -1) {
            $.each(obj, function (k, v) {
                len++;
            });
        } else {
            len = Object.keys(obj).length;
        }
    }
    return len;
}

function sleep(n) {
    var start = new Date().getTime();
    while (true) {
        var time = new Date().getTime();
        if (time - start > n) {
            break;
        }
    }
}

function before_unload_set(msg) {
    var UnloadConfirm = {};
    if (msg === undefined) {
        msg = "数据尚未保存，离开后可能会导致数据丢失！";
    }
    UnloadConfirm.set = function (a) {
        window.onbeforeunload = function (b) {
            b = b || window.event;
            b.returnValue = a;
            return a;
        }
    };
    UnloadConfirm.set(msg);
}

function before_unload_clear() {
    window.onbeforeunload = function () {
    }
}

function show_head_tip(msg, type, delay) {
    if (typeof (Messenger) != 'undefined') {
        show_head_tip_new(msg, type, delay);
        return;
    }
    if (msg === undefined || msg === "") {
        return;
    }
    var _mt = mt();
    hide_head_tip();
    var is_mobile_html = $('body').width() < 700 ? ' mini' : '';
    $('body').prepend('<div id="_m' + _mt + '" class="__message' + is_mobile_html + '">' + msg + '<div class="_m_btn_close">×</div></div>');
    $('.__message>._m_btn_close').on('click', function () {
        hide_head_tip();
    });
    if (type === undefined || type === null || type == '') {
        if (msg.indexOf('成功') !== -1) {
            type = 'success';
        } else if (msg.indexOf('失败') !== -1 || msg.indexOf('有误') !== -1 || msg.indexOf('错误') !== -1 || msg.toUpperCase().indexOf('ERROR') !== -1 || msg.indexOf('出错') !== -1 || msg.indexOf('不被支持') !== -1 || msg.indexOf('无法') !== -1 || msg.indexOf('不通过') !== -1) {
            type = 'error';
        }
    }
    if (type == 'error') {
        $('#_m' + _mt).css({background: '#FA3F54', border: '1px solid #BD362F'});
    } else if (type == 'success') {
        $('#_m' + _mt).css({background: '#5BB75B', border: '1px solid #51A351'});
    }
    $('#_m' + _mt).fadeIn(120);
    if (!delay) {
        var msg_length = msg.split(' (code: ').shift().length;
        if (msg_length > 30) {
            delay = 11000;
        } else if (msg_length > 20) {
            delay = 8000;
        } else if (msg_length > 10) {
            delay = 4500;
        } else {
            delay = 2000;
        }
    }
    setTimeout(function () {
        $('#_m' + _mt).fadeOut();
    }, delay);
}

function show_head_tip_new(msg, type, delay) {
    if (msg === undefined || msg === "") {
        return;
    }
    if (type === undefined || type === null || type == '') {
        if (msg.indexOf('成功') !== -1) {
            type = 'success';
        } else if (msg.indexOf('失败') !== -1 || msg.indexOf('有误') !== -1 || msg.indexOf('错误') !== -1 || msg.toUpperCase().indexOf('ERROR') !== -1 || msg.indexOf('出错') !== -1 || msg.indexOf('不被支持') !== -1 || msg.indexOf('无法') !== -1 || msg.indexOf('不存在') !== -1 || msg.indexOf('不通过') !== -1) {
            type = 'error';
        }
    }
    if (!delay) {
        var msg_length = msg.split(' (code: ').shift().length;
        if (msg_length > 30) {
            delay = 9000;
        } else if (msg_length > 20) {
            delay = 6000;
        } else if (msg_length > 10) {
            delay = 3000;
        } else {
            delay = 2000;
        }
    }
    Messenger().post({message: msg, type: type, hideAfter: delay / 1000, hideOnNavigate: false,});
}

function hide_head_tip() {
    $('.__message').remove();
}

function disable_inputs($ta, $excludes) {
    $ta.find('select, input, textarea').each(function (k, v) {
        if ($.inArray(v, $excludes) !== -1) {
            return;
        }
        $(v).attr('disabled', true);
    });
    $ta.find('.tags').addClass('disabled');
    typeof (UE) !== 'undefined' && UE.getEditor('ueditor').setDisabled('fullscreen');
}

function enable_inputs($ta, $excludes) {
    $ta.find('select, input, textarea').each(function (k, v) {
        if ($.inArray(v, $excludes) !== -1) {
            return;
        }
        $(v).removeAttr('disabled');
    });
    $ta.find('.tags').removeClass('disabled');
    typeof (UE) !== 'undefined' && UE.getEditor('ueditor').setEnabled();
}

function get_tags(obj, id) {
    var tags = '', value = '';
    $span_childs = typeof (obj) == 'object' ? obj.find('>span') : $(obj + ">span");
    $span_childs.each(function (k, v) {
        if ($(v).hasClass('active')) {
            value = typeof (id) != 'undefined' ? $(v).data(id) : $(v).text();
            tags += ',' + value;
        }
    });
    tags = tags.substr(1);
    return tags;
}

function set_tags(obj, str, id) {
    str = str.toString();
    if (str.length == 0) {
        return;
    }
    var flags = str.split(','), value = '';
    $span_childs = typeof (obj) == 'object' ? obj.find('>span') : $(obj + ">span");
    $span_childs.removeClass('active');
    $span_childs.each(function (k, v) {
        $.each(flags, function (kk, vv) {
            value = typeof (id) != 'undefined' ? $(v).data(id) : $(v).text();
            if (vv == value) {
                $(v).trigger('click');
                return false;
            }
        });
    });
}

function ck(k, v) {
    var prefix = G.ckprefix || '';
    var ckpath = G.ckpath || '/';
    if (typeof (k) == 'undefined' && typeof (v) == 'undefined') return document.cookie;
    if (typeof (v) == 'undefined') return $.cookie(prefix + k);
    return $.cookie(prefix + k, v, {path: ckpath});
}

function kv(k, v) {
    if (typeof (k) == 'undefined' && typeof (v) == 'undefined') {
        return window.localStorage;
    }
    if (typeof (v) == 'undefined') {
        return window.localStorage.getItem(k);
    }
    return window.localStorage.setItem(k, v);
}

function deb(o) {
    console.log(get_obj(o));
}

function time(cmd) {
    if (cmd == '-mt') return new Date().getTime();
    return Date.parse(new Date()) / 1000;
}

function mt() {
    return time('-mt');
}

function strtotime(str) {
    if (!str || str == '') {
        return 0;
    }
    if (str.indexOf('/') !== -1 && str.length == 16) {
        str = str.replace(/\//g, '-') + ':00';
    }
    var _arr = str.split(' ');
    var _day = _arr[0].split('-');
    _arr[1] = (_arr[1] == null) ? '0:0:0' : _arr[1];
    var _time = _arr[1].split(':');
    for (var i = _day.length - 1; i >= 0; i--) {
        _day[i] = isNaN(parseInt(_day[i])) ? 0 : parseInt(_day[i]);
    }
    ;
    for (var i = _time.length - 1; i >= 0; i--) {
        _time[i] = isNaN(parseInt(_time[i])) ? 0 : parseInt(_time[i]);
    }
    ;var _temp = new Date(_day[0], _day[1] - 1, _day[2], _time[0], _time[1], _time[2]);
    return _temp.getTime() / 1000;
}

var fix_time = function (t) {
    if (t <= 9) {
        return '0' + t;
    } else {
        return t;
    }
}

function date(format, time) {
    var _temp = (time != null) ? new Date(time * 1000) : new Date();
    var _return = '';
    var _day = [_temp.getFullYear(), fix_time(1 + _temp.getMonth()), fix_time(_temp.getDate())];
    if (/Y-m-d/.test(format)) {
        _return = _day.join('-');
    } else if (/Y\/m\/d/.test(format)) {
        _return = _day.join('/');
    }
    if (/H:i:s/.test(format)) {
        var _time = [fix_time(_temp.getHours()), fix_time(_temp.getMinutes()), fix_time(_temp.getSeconds())];
    } else if (/H:i/.test(format)) {
        var _time = [fix_time(_temp.getHours()), fix_time(_temp.getMinutes())];
    }
    if (_time) {
        _return += ' ' + _time.join(':');
    }
    return _return;
}

function dt(timestamp) {
    timestamp = timestamp || Date.parse(new Date()) / 1000;
    var now = new Date(timestamp * 1000);
    var years = now.getFullYear();
    var months = fix_time(now.getMonth() + 1);
    var date = fix_time(now.getDate());
    var hours = fix_time(now.getHours());
    var minutes = fix_time(now.getMinutes());
    var seconds = fix_time(now.getSeconds());
    return years + "-" + months + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

function resolution() {
    return window.screen.width + 'x' + window.screen.height;
}

function able_flash() {
    var hasFlash = 0;
    var flashVersion = 0;
    var isIE = 0;
    if (isIE) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
            hasFlash = 1;
            VSwf = swf.GetVariable("$version");
            flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return hasFlash;
}

function able_java() {
    if (navigator.javaEnabled()) return 1;
}

function fullHTML5() {
    var html5 = 0;
    if (!!document.createElement('video').canPlayType) {
        var vidTest = document.createElement("video");
        oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
        if (!oggTest) {
            h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            if (!h264Test) {
                html5 = 0;
            } else {
                if (h264Test == "probably") html5 = 2; else html5 = 1;
            }
        } else {
            if (oggTest == "probably") html5 = 2; else html5 = 1;
        }
    }
    return html5;
}

function check_mail(o) {
    var reEml = /^[\w\-\.]+@[a-z0-9]+(\-[a-z0-9]+)?(\.[a-z0-9]+(\-[a-z0-9]+)?)*\.[a-z]{2,4}$/i;
    return reEml.test(o);
}

function get_obj(o, rec) {
    if (typeof (o) == 'string' || typeof (o) == 'number') {
        return o;
    }
    if (typeof (rec) == 'undefined') rec = 0;
    rec++;
    var i = 0;
    var str = "(\n";
    var end_space = '';
    var space = use_space = "　　";
    while (i++ < rec - 1) {
        end_space += space;
        use_space += space;
    }
    var j = 0;
    $.each(o, function (k, v) {
        j++;
        if (typeof (v) == 'object') {
            v = get_obj(v, rec);
        }
        if (j == rec) {
            var i = 0;
            while (i++ < rec - 1) {
                use_space = use_space.replace(space, '');
            }
        } else if (rec == 1) {
            use_space = space;
        }
        str += use_space + '[' + k + '] => ' + v + "\n";
    });
    return str + end_space + ')';
}

function line_to_hump(string, line) {
    line = line || '_';
    var list = string.split(line);
    var result = '';
    $.each(list, function (index, part) {
        part = ucfirst(part);
        result += part;
    });
    result = lcfirst(result);
    return result;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lcfirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
