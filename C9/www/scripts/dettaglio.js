$("body").removeClass("update");
$("body").addClass("loading");
var myScroll;
var position;
var aggiorna = false;
var dispositivo = "";
var schemetw = ""
var schemefb = "";
var apptwitter = "NO";
var appfacebook = "NO";
var gara = 0;
function slide(direction, color, slowdownfactor, hrf) {
    if (!hrf) {
        setTimeout(function () {
            // update the page inside this timeout
            //document.querySelector("#title").innerHTML = direction;
            //document.querySelector("html").style.background = color;
        }, 20);
    }
    // not passing in options makes the plugin fall back to the defaults defined in the JS API
    var theOptions = {
        "direction": "right", // 'left|right|up|down', default 'left' (which is like 'next')
        "duration": 500, // in milliseconds (ms), default 400
        "slowdownfactor": 3, // overlap views (higher number is more) or no overlap (1), default 4
        "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
        "href": hrf,
        "androiddelay": 150, // same as above but for Android, default 70
        "winphonedelay": 250, // same as above but for Windows Phone, default 200,
        "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        "fixedPixelsBottom": 0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    window.plugins.nativepagetransitions.slide(
        theOptions,
        function () {
            console.log('------------------- slide transition finished');
        },
        function (msg) {
            console.log('error: ' + msg);
        });
}
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}
function updatePosition() {
    //position.innerHTML = this.y >> 0;
    if (this.y > 20) {
        aggiorna = true;
    }
    if (device.platform == "windows") {
        $('.dett').bind('click', false);
    }
}
function aggiorna_pagina() {
    //position.innerHTML = this.y >> 0;
    if ((aggiorna) && (this.y == 0)) {
        location.reload();
        aggiorna = false;
    }
    if (device.platform == "windows") {
        setTimeout(function () {
            $('.dett').unbind('click', false);
        }, 100);
    }
}

function loaded() {
    //position = document.getElementById('position');

    myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });

    myScroll.on('scroll', updatePosition);
    myScroll.on('scrollEnd', aggiorna_pagina);

}


(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        var giornata = getURLParameter('giornata');
        var campionato = getURLParameter('campionato');
        gara = getURLParameter('gara');
        var squadra_c9 = "";
        var squadra_c9_p = "";
        var giornataprec = parseInt(giornata) - 1;
        var giornatasucc = parseInt(giornata) + 1;
        var giornatahtml = "";
        if (giornataprec == 0) {
            giornatahtml = "<h3>GIORNATA " + giornata + "<a href=\"dettaglio.html?giornata=" + giornatasucc + "&campionato=" + campionato + "\" id=\"slide_next\"><img src=\"images/arrow-right.png\" alt=\"\" /></a></h3>";
        }
        else {
            giornatahtml = "<h3><a href=\"dettaglio.html?giornata=" + giornataprec + "&campionato=" + campionato + "\" id=\"slide_prev\"><img src=\"images/arrow-left.png\" alt=\"\" /></a>GIORNATA " + giornata + "<a href=\"dettaglio.html?giornata=" + giornatasucc + "&campionato=" + campionato + "\" id=\"slide_next\"><img src=\"images/arrow-right.png\" alt=\"\" /></a></h3>";
        }
        document.getElementById("giornata").innerHTML = giornatahtml;

        var push = PushNotification.init({
            "android": {
                "senderID": "146415675457"
            },
            "ios": { "alert": "true", "badge": "false", "sound": "true" },
            "windows": {}
        });

        push.on('notification', function (data) {
            console.log("notification event");
            var res = data.additionalData.additionalData.split(";");
            location.href = 'dettaglio.html?campionato=' + res[0] + '&giornata=' + res[1] + '&squadra=' + res[2] + '&gara=' + res[3];
            push.finish(function () {
                console.log('finish successfully called');
            });
        });


        var link = "http://www.pallavoloc9.it/php/dettaglio-json.php?giornata=" + giornata + "&campionato=" + campionato;
        var isneedtoKillAjax = true; // set this true

        // Fire the checkajaxkill method after 10 seonds
        setTimeout(function () {
            checkajaxkill();
        }, 15000);

        function checkajaxkill() {

            // Check isneedtoKillAjax is true or false, 
            // if true abort the getJsonRequest

            if (isneedtoKillAjax) {
                isneedtoKillAjax = false;
                myAjaxCall.abort();
                $("body").removeClass("loading");
                $("body").addClass("update");
            } else {
                $("body").removeClass("loading");
            }

        }
        var myAjaxCall = $.getJSON(link, function (data) {
            isneedtoKillAjax = false;
            var output = "<ul>";
            var prossime = "<ul>";
            var cont = 0;
            for (var j in data.risultati) {
                var object = data.risultati[j];

                var spancasa, spanospiti = "";
                cont++;
                for (var i in object) {
                    var prossima = object[i].prossima;
                    if (prossima == 0) {
                        var array = object[i].risultato.split("-");

                        if (object[i].squadracasa.length > 29)
                            spancasa = object[i].squadracasa.substring(0, 29);
                        else spancasa = object[i].squadracasa;

                        if (object[i].squadraospite.length > 29)
                            spanospiti = object[i].squadraospite.substring(0, 29);
                        else spanospiti = object[i].squadraospite;
                        squadra_c9_p = object[i].nome;
                        if (object[i].grass == 1) {
                            spancasa = "<span class=\"day_name\">" + spancasa + "</span>";
                            squadra_c9 = spancasa;
                        } else {
                            //spancasa = object[i].squadracasa;
                        }

                        if (object[i].grass == 2) {
                            spanospiti = "<span class=\"day_name\">" + spanospiti + "</span>";
                            squadra_c9 = spanospiti;
                        } else {
                            //spanospiti = object[i].squadraospite;
                        }
                        var bc = "";
                        //document.getElementById("cards").innerHTML = gara + "=" + object[i].gara;
                        if (gara == object[i].gara)
                            bc = 'style="background-color:#FFBABA;"';
                        else
                            bc = '';

                        output += "<li><a href=\"#\" " + bc + ">" + spancasa + "<label class=\"digits\">" + array[0].trim() + "</label><div class=\"clear\"></div>";
                        output += spanospiti + "<label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div>";
                        output += "<span class=\"day_name\">(" + object[i].set1 + "; " + object[i].set2 + "; " + object[i].set3;
                        if (object[i].set4 != "0-0" && object[i].set4 != "") {
                            output += "; " + object[i].set4;
                        }
                        if (object[i].set5 != "0-0" && object[i].set5 != "") {
                            output += "; " + object[i].set5;
                        }
                        output += ")</span>" + "<div class=\"clear\"></div>";
                        output += "</a></li>";
                    }
                    else {

                        if (object[i].squadracasa.length > 24)
                            spancasa = object[i].squadracasa.substring(0, 24);
                        else spancasa = object[i].squadracasa;

                        if (object[i].squadraospite.length > 24)
                            spanospiti = object[i].squadraospite.substring(0, 24);
                        else spanospiti = object[i].squadraospite;

                        squadra_c9_p = object[i].nome;
                        var array = object[i].risultato.split("-");

                        if (object[i].grass == 1) {
                            spancasa = "<span class=\"day_name\">" + spancasa + "</span>";
                            squadra_c9 = spancasa;
                        } else {
                            //spancasa = object[i].squadracasa;
                        }

                        if (object[i].grass == 2) {
                            spanospiti = "<span class=\"day_name\">" + spanospiti + "</span>";
                            squadra_c9 = spanospiti;
                        } else {
                            //spanospiti = object[i].squadraospite;
                        }
                        var data = object[i].data.substring(8, 10) + "/" + object[i].data.substring(5, 7) + "/" + object[i].data.substring(2, 4);
                        //var data = object[k].data.substring(2, 4);
                        var ora = object[i].data.substring(11, 13) + "." + object[i].data.substring(14, 16);

                        output += "<li><a href=\"#\">" + spancasa + "<label style=\"font-size:0.8em\" class=\"digits\">" + data + "</label><div class=\"clear\"></div>";
                        output += spanospiti + "<label style=\"font-size:0.8em\" class=\"digits\">" + ora + "</label><div class=\"clear\"></div>";
                        output += "<div class=\"clear\"></div>";
                        output += "</a></li>";
                        //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";

                    }

                    //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                }
            }





            output += "</ul>";
            //prossime += "</ul>";
            //var app = squadra_c9_p.replace(" ","_");
            squadra_c9_p.replace(" ", "%20");
            console.log(squadra_c9_p);
            var classificahtml = "<center><a class=\"salva_notifiche\" href=\"classifica.html?campionato=" + campionato + "&giornata=" + giornata + "&squadra=" + squadra_c9_p + "\">CLASSIFICA " + squadra_c9_p + "</a></center>";

            document.getElementById("classifica").innerHTML = classificahtml;
            document.getElementById("dettaglio").innerHTML = output;
            var menu = '<ul><li><center><a href="index.html"><i><img src="images/home-4-64.png"></i></a></center></li> \
            <li><center><a href="eventi.html"><i><img src="images/today-64.png" alt="" /></i></a></center> \
            <li><center><a href="news.html"><i><img src="images/google-news-64.png" alt="" /></i></a></center> \
            <li>\
                <center><a href="notifiche.html"><i><img src="images/settings-13-64.png" alt="" /></i></a></center>\
                <!--<label class="digits active">5</label><div class="clear"></div>-->\
            </li>\
            <!--<li><a href="#"><span> <i><img src="images/screenshot-grey.png" alt=""></i> SelfieC9</span><div class="clear"></div></a></li>\
            <li><a href="indexold.html"><span> <i><img src="images/events.png"></i> Eventi</span><div class="clear"></div></a></li>\
            -->\
        </ul>';
            //document.getElementById("menu").innerHTML = menu;



            document.addEventListener('backbutton', function () {
                slide('right', 'purple', 0, "index.html");
            }, false);



            //document.getElementById("prossime").innerHTML = prossime;
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            var menu = '<ul>';
            menu += '<li><center><a href="index.html"><i><img src="images/home-4-64.png"></i></a></center></li>';
            menu += '<li><center><a href="eventi.html"><i><img src="images/today-64.png" alt="" /></i></a></center>';
            menu += '<li><center><a href="news.html"><i><img src="images/google-news-64.png" alt="" /></i></a></center>';
            menu += '<li><center><a href="notifiche.html"><i><img src="images/settings-13-64.png" alt="" /></i></a></center></li>';
            menu += '</ul>';
            document.getElementById("menu").innerHTML = menu;
            $(function () {
                $('nav#menu').mmenu();
            });
            $('nav#menu').on('closed.mm', function () {
                if (device.platform == "windows") {
                    location.reload();
                }
            });
            $("body").removeClass("loading");
            loaded();
        });
    }
})();