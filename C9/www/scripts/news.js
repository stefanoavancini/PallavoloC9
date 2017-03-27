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
function updatePosition() {
    if (this.y > 20) {
        aggiorna = true;
    }
}
function aggiorna_pagina() {
    if ((aggiorna) && (this.y == 0)) {
        location.reload();
        aggiorna = false;
    }

}

function loaded() {

    myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });

    myScroll.on('scroll', updatePosition);
    myScroll.on('scrollEnd', aggiorna_pagina);
    setTimeout(function () {
        $('#wrapper').css({ left: 0 });
    }, 100);
}
function refresh() {
    setTimeout(function () {
        myScroll.refresh();
    }, 200);
    
}

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        var push = PushNotification.init({
            "android": {
                "senderID": "146415675457"
            },
            "ios": { "alert": "true", "badge": "false", "sound": "true", "clearBadge": "true" },
            "windows": {}
        });
        push.on('registration', function (data) {
        });

        push.on('notification', function (data) {
            //console.log("notification event");
            push.setApplicationIconBadgeNumber(0);
            //console.log(JSON.stringify(data));
            var res = data.additionalData.additionalData.split(";");
            location.href = 'dettaglio.html?campionato=' + res[0] + '&giornata=' + res[1] + '&squadra=' + res[2] + '&gara=0';

            push.finish(function () {
                //console.log('finish successfully called');
            });
        });
        push.on('error', function (e) {
            //console.log("push error" + e);
        });
        var isneedtoKillAjax = true; // set this true

        // Fire the checkajaxkill method after 10 seonds
        setTimeout(function () {
            checkajaxkill();
        }, 20000);

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

        var myAjaxCall = $.getJSON('http://www.pallavoloc9.it/php/news-json.php', function (data) {

                console.log("inside");
                isneedtoKillAjax = false;
                var output = "<div class='tweets_list'><ul>";

                var squadra_app1 = "";
                var squadra_app2 = "";
                var num = 0;
                for (var j in data.news) {
                    var object = data.news[j];
                    num = num + 1;
                            var titolo = object.titolo;
                            var testo = object.testo;
                            console.log(object.img);
                            output += "<li style='text-align:justify;'><center><img src='"+object.img+"' /></center><span>" + titolo.toUpperCase() + "</span>";
                            output += "" + testo.substring(0,150) + "<div id='complete"+num+"' class='complete'>"+testo.substring(150)+"</div><div id='more"+num+"' class='more'>LEGGI TUTTO</div></li>";

                }
                output += "</ul></div>";
                document.getElementById("news").innerHTML = output;
                dispositivo = device.platform;
            
                document.addEventListener('backbutton', function () {
                    slide('right', 'purple', 0, "index.html");
                }, false);

                
                $('.more').click(function () {
                    
                    var temp = '#complete' + this.id.replace("more", "");
                    var tempm = '#more' + this.id.replace("more", "");
                    var id = this.id;
                    console.log(tempm);
                    if ($(temp).css('display') == 'none')
                    {
                        $(temp).show(100);
                        $(temp).css('display','inline');
                        $(tempm).text("RIDUCI");
                        refresh();
                    } else
                    {
                        $(temp).hide(100);
                        $(tempm).text("LEGGI TUTTO");
                        refresh();
                        setTimeout(function () { myScroll.scrollToElement(document.getElementById(id), 100); }, 200);
                        
                    }
                    //console.log($(tempm).text);
                    
                    //console.log($(tempm).text);
                });
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
                setTimeout(function () { loaded(); }, 1000);
                $("body").removeClass("loading");

        })
        .done(function () { console.log('getJSON request succeeded!'); })
        .fail(function (jqXHR, textStatus, errorThrown) { console.log('getJSON request failed! ' + textStatus + ' error ' + errorThrown); })
        .always(function () { console.log('getJSON request ended!'); });
    }
})();