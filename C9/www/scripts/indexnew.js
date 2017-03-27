// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
$("body").removeClass("update");
$("body").addClass("loading");
var aggiorna = false;
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}
function updatePosition() {
    if (this.y > 20) {
        aggiorna = true;
    }
    if (device.platform == "windows") {
        $('.dett').bind('click', false);
    }
}
function aggiorna_pagina() {
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

    myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });

    myScroll.on('scroll', updatePosition);
    myScroll.on('scrollEnd', aggiorna_pagina);
}
var giornata = getURLParameter('giornata');
var campionato = getURLParameter('campionato');
var squadra_c9 = getURLParameter('squadra');

(function () {
    "use strict";



    document.addEventListener('deviceready', onDeviceReady.bind(this), false);



    function onDeviceReady() {
        //squadra_c9 = getURLParameter('squadra');
        //giornata = getURLParameter('giornata');
        //campionato = getURLParameter('campionato');
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        var push = PushNotification.init({
            "android": {
                "senderID": "146415675457"
            },
            "ios": { "alert": "true", "badge": "true", "sound": "true" },
            "windows": {}
        });

        push.on('notification', function (data) {
            console.log("notification event");
            var res = data.additionalData.additionalData.split(";");
            location.href = 'dettaglio.html?campionato=' + res[0] + '&giornata=' + res[1] + '&squadra=' + res[2];
            push.finish(function () {
                console.log('finish successfully called');
            });
        });

        var link = "http://www.pallavoloc9.it/php/classifica-json.php?campionato=34849";
        console.log(link);
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
            for (var j in data.classifica) {
                var object = data.classifica[j];

                var spancasa, spanospiti = "";
                cont++;
                output += "<li><a href=\"#\" style=\"color: #e64c65;text-align:center\">SQUADRA<label class=\"digits\" style=\"color: #e64c65;font-size:0.6em;\">Pun<em style=\"\">Gio</em></label>";
                //output += "<div class=\"clear\"></div>";
                output += "</a></li>";

                for (var i in object) {
                    var grass = object[i].grass;
                    var marginleft = "20px";
                    var marginright = "5px";
                    if (object[i].punti > 9) {
                        marginleft = "15px";
                    }
                    if (object[i].giocate > 9) {
                        marginright = "0px";
                    }
                    if (grass == 0) {
                        output += "<li><a href=\"#\">" + object[i].pos + ".  " + object[i].squadra + "<label class=\"digits\">" + object[i].punti + "<em style=\"margin-left:" + marginleft + ";margin-right:" + marginright + "\">" + object[i].giocate + "</em></label><div class=\"clear\"></div>";
                        //output += "<div class=\"clear\"></div>";
                        output += "</a></li>";
                    }
                    else {
                        output += "<li><a href=\"#\"><span class=\"day_name\">" + object[i].pos + ".  " + object[i].squadra + "<label class=\"digits\">" + object[i].punti + "<em style=\"margin-left:" + marginleft + ";margin-right:" + marginright + "\">" + object[i].giocate + "</em></label></span><div class=\"clear\"></div>";
                        //output += "<div class=\"clear\"></div>";
                        output += "</a></li>";
                    }

                    //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                }
            }





            output += "</ul>";
            //prossime += "</ul>";
            // var classificahtml = "<center><a href='classifica.html?campionato=" + campionato + "&giornata=" + giornata + "'>PROVA</a><button class=\"salva_notifiche\" value=\"SALVA\" id=\"salva\" onclick=\"javascript:location.href='classifica.html?campionato=" + campionato + "&giornata=" + giornata + "'\">CLASSIFICA " + squadra_c9 + "</button></center>";
            //document.getElementById("classifica").innerHTML = classificahtml;
            var titolohtml = '<h3>Classifica ' + squadra_c9 + '<a href="dettaglio.html?campionato=' + campionato + '&giornata=' + giornata + '" id="close"><img src="images/close-window.png" alt="" /></a></h3>';
            document.getElementById("giornata").innerHTML = titolohtml;
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
            loaded();
            $("body").removeClass("loading");

        });

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();