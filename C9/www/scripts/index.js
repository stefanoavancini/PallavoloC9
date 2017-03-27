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

    //myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });
    /*
    myScroll = new IScroll('#wrapper', {
        probeType: 1,
        tap: false,
        click: false,
        preventDefaultException: { tagName: /.*//* },
        mouseWheel: true,
        scrollbars: true,
        fadeScrollbars: true,
        interactiveScrollbars: false,
        keyBindings: false,
        bounce: false,
        shrinkScrollbars: 'clip',
        useTransition: false,
        bindToWrapper: true,
        deceleration: 0.0002
    });
    */
    myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });
    myScroll.on('scroll', updatePosition);
    myScroll.on('scrollEnd', aggiorna_pagina);
    
    setTimeout(function () {
        $('#wrapper').css({ left: 0 });
    }, 100);
    
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
            $.post('http://www.pallavoloc9.it/php/update.php', { registrationid: data.registrationId, campionati: "0", notifica: "0", avversari: "NO", device: device.platform }, function (response) {
                
            });
            //document.getElementById("cards").innerHTML = data.registrationId;
        });

        push.on('notification', function (data) {
            //console.log("notification event");
            if (device.platform == "windows") {
                window.open(data.param, '_self', 'location=no');
                //location.href = 'news.html';
            } else
                {
            push.setApplicationIconBadgeNumber(0);
            //console.log(JSON.stringify(data));
            var res = data.additionalData.additionalData.split(";");
            //document.getElementById("cards").innerHTML = res;
            if (res[0] != "" && res[1] != "")
            {
                location.href = 'dettaglio.html?campionato=' + res[0] + '&giornata=' + res[1] + '&squadra=' + res[2] + '&gara=' + res[3];
            }

            }

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

        var myAjaxCall = $.getJSON('http://www.pallavoloc9.it/php/risultati-json.php', function (data, status, xhr) {


            if (status == "success") {

                isneedtoKillAjax = false;
                var output = "<ul>";
                var prossime = "<ul>";
                var squadra_app1 = "";
                var squadra_app2 = "";
                var cont = 0;
                var object = null;
                for (var j in data.risultati) {
                    object = data.risultati[j];
                    if (cont == 0) {
                        cont++;
                        for (var i in object.reverse()) {
                            var array = object[i].risultato.split("-");
                            var spancasa, spanospiti = "";
                            if (object[i].squadracasa.length > 26)
                                spancasa = object[i].squadracasa.substring(0, 26);
                            else spancasa = object[i].squadracasa;

                            if (object[i].squadraospite.length > 26)
                                spanospiti = object[i].squadraospite.substring(0, 26);
                            else spanospiti = object[i].squadraospite;

                            if (object[i].grass == 1) {
                                spancasa = "<span class=\"day_name\">" + spancasa + "</span>";
                            } else {
                                //spancasa = object[k].squadracasa;
                            }

                            if (object[i].grass == 2) {
                                spanospiti = "<span class=\"day_name\">" + spanospiti + "</span>";
                            } else {
                                //spanospiti = object[k].squadraospite;
                            }
                            if (object[i].squadra_app.length > 3) {
                                squadra_app1 = "<div style='position:absolute;margin-top:10px;margin-left:-30px;'>" + object[i].squadra_app.substring(0, 3) + "</div>";
                                squadra_app1 += "<div style='position:absolute;margin-top:30px;margin-left:-30px;'>" + object[i].squadra_app.substring(3, object[i].squadra_app.length) + "</div>";
                                squadra_app1 = "<div class=\"custom\">" + object[i].squadra_app.substring(0, 3) + "<br />";
                                squadra_app1 += object[i].squadra_app.substring(3, object[i].squadra_app.length) + "</div>";

                            }
                            else {
                                squadra_app1 = "<div class=\"custom\" style=\"margin-top: 27px;margin-left:7px\">" + object[i].squadra_app + "</div>";
                            }

                            output += squadra_app1 + "<li><a class='dett' href=\"dettaglio.html?giornata=" + object[i].giornata + "&campionato=" + object[i].campionato + "&gara=0\">" + spancasa + "<label class=\"digits\">" + array[0].trim() + "</label><div class=\"clear\"></div>";
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
                            //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                        }
                    }
                    else {
                        for (var k in object) {
                            var array = object[k].risultato.split("-");
                            var spancasa, spanospiti = "";

                            if (object[k].squadracasa.length > 24)
                                spancasa = object[k].squadracasa.substring(0, 24);
                            else spancasa = object[k].squadracasa;

                            if (object[k].squadraospite.length > 24)
                                spanospiti = object[k].squadraospite.substring(0, 24);
                            else spanospiti = object[k].squadraospite;

                            if (object[k].grass == 1) {
                                spancasa = "<span class=\"day_name\">" + spancasa + "</span>";
                            } else {
                                //spancasa = object[k].squadracasa;
                            }

                            if (object[k].grass == 2) {
                                spanospiti = "<span class=\"day_name\">" + spanospiti + "</span>";
                            } else {
                                //spanospiti = object[k].squadraospite;
                            }
                            //"2015-11-08 11:00:00"
                            var data = object[k].data.substring(8, 10) + "/" + object[k].data.substring(5, 7) + "/" + object[k].data.substring(2, 4);
                            //var data = object[k].data.substring(2, 4);
                            var ora = object[k].data.substring(11, 13) + "." + object[k].data.substring(14, 16);
                            if (object[k].squadra_app.length > 3) {
                                squadra_app1 = "<div style='position:absolute;margin-top:10px;margin-left:-30px;'>" + object[k].squadra_app.substring(0, 3) + "</div>";
                                squadra_app1 += "<div style='position:absolute;margin-top:30px;margin-left:-30px;'>" + object[k].squadra_app.substring(3, object[k].squadra_app.length) + "</div>";
                                squadra_app1 = "<div class=\"custom\" style=\"margin-top: 10px;margin-left:7px\">" + object[k].squadra_app.substring(0, 3) + "<br />";
                                squadra_app1 += object[k].squadra_app.substring(3, object[k].squadra_app.length) + "</div>";

                            }
                            else {
                                squadra_app1 = "<div class=\"custom\" style=\"margin-top: 17px;margin-left:7px\">" + object[k].squadra_app + "</div>";
                            }
                            //squadra_app1 = "";
                            prossime += squadra_app1 + "<li><a class='dett' href=\"dettaglio.html?giornata=" + object[k].giornata + "&campionato=" + object[k].campionato + "&gara=0\">" + spancasa + "<label style=\"font-size:0.8em\" class=\"digits\">" + data + "</label><div class=\"clear\"></div>";
                            prossime += spanospiti + "<label style=\"font-size:0.8em\" class=\"digits\">" + ora + "</label><div class=\"clear\"></div>";

                            var palestra = object[k].palestra.replace('è', '&egrave;').replace('à', '&agrave').replace('ò', '&ograve').replace('ì', '&igrave');
                            //palestra = object[k].palestra.replace('è', '&egrave;');
                            prossime += "<span class=\"palestra\">" + palestra + "</span>";
                            //prossime += "<div class=\"clear\"></div>";
                            prossime += "</a></li>";
                            //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                        }
                    }

                }



                if (object == null) {
                    document.getElementById("titolo_UR").innerHTML = "";
                    document.getElementById("titolo_PP").innerHTML = "";
                    var d = new Date();
                    var n = d.getMonth();
                    if (n == 12 || n == 1) {
                        document.getElementById("titolo_UR").innerHTML = "AUGURI";
                        output += "<li style='text-align:justify;padding-top:1em'><span style='text-align:right;padding:0;margin:0;'>" + d.getDay() + "/" + d.getMonth() + "/"+d.getYear()+"</span>";
                        output += "<h4 style='padding-top:1em;font-weight: bold;'><center><b> AUGURI DALLA PALLAVOLO C9</b></center></h4>";
                        output += "Tanti auguri di Buon Natale e Felice anno nuovo. Le partite riprenderanno nei primi giorni di gennaio.";
                        output += "</li>";
                        output += "</ul>";
                        prossime += "</ul>";
                        document.getElementById("ultime").innerHTML = output;
                    }else
                    {
                        if(n == 6 || n==7 || n==8 || n==9)
                        {
                            document.getElementById("titolo_UR").innerHTML = "ESTATE";
                            output += "<li style='text-align:justify;padding-top:1em'><span style='text-align:right;padding:0;margin:0;'>" + d.getDay() + "/" + d.getMonth() + "/" + d.getYear() + "</span>";
                            output += "<h4 style='padding-top:1em;font-weight: bold;'><center><b>STAGIONE CONCLUSA</b></center></h4>";
                            output += "La stagione invernale è conclusa e si aprono le porte di quella estiva. Tenetevi aggiornati tramite le news sui prossimi appuntamenti dei tornei di beach volley!";
                            output += "</li>";
                            output += "</ul>";
                            prossime += "</ul>";
                            document.getElementById("ultime").innerHTML = output;
                        }
                    }
                } else {
                    output += "</ul>";
                    prossime += "</ul>";
 
                    document.getElementById("ultime").innerHTML = output;
                    document.getElementById("prossime").innerHTML = prossime;
                }

               // document.getElementById("menu").innerHTML = menu;
                //console.log(device.platform);
                dispositivo = device.platform;
                // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
                if (device.platform === 'iOS') {
                    schemetw = 'twitter://';
                    schemefb = 'fb://';
                }
                else if (device.platform === 'Android') {
                    schemetw = 'com.twitter.android';
                    schemefb = 'com.facebook.katana';
                }
                //console.log(schemetw);
                //console.log(schemefb);
                appAvailability.check(
                    schemetw,       // URI Scheme or Package Name
                    function () {  // Success callback
                        apptwitter = "SI";
                        //console.log(schemetw + ' is available :)');
                    },
                    function () {  // Error callback                        
                        //console.log(schemetw + ' is not available :(');
                    }
                );
                appAvailability.check(
                schemefb,       // URI Scheme or Package Name
                function () {  // Success callback
                    appfacebook = "SI";
                    //console.log(schemefb + ' is available :)');
                },
                function () {  // Error callback                        
                    //console.log(schemefb + ' is not available :(');
                }
            );
                document.addEventListener('backbutton', function () {
                    navigator.app.exitApp();
                }, false);
                var menu = '<ul>';
                menu += '<li><center><a href="index.html"><i><img src="images/home-4-64.png"></i></a></center></li>';
                menu += '<li><center><a href="eventi.html"><i><img src="images/today-64.png" alt="" /></i></a></center>';
                menu += '<li><center><a href="news.html"><i><img src="images/google-news-64.png" alt="" /></i></a></center>';
                menu += '<li><center><a href="notifiche.html"><i><img src="images/settings-13-64.png" alt="" /></i></a></center></li>';
                menu += '</ul>';
                document.getElementById("menu").innerHTML = menu;
                $("body").removeClass("loading");
                //myScroll.destroy();
                //myScroll = null;
                //$('nav#menu').show();

                $(function () {
                    $('nav#menu').mmenu();
                });
                $('nav#menu').on('closed.mm', function () {
                    if (device.platform == "windows")
                    {
                        location.reload();
                    }
                });
                loaded();
                //console.log(device.platform);
                //myScroll.refresh();
                //myScroll.refresh();
            }
            else if (status == "error" || status == "parsererror" || status == "timeout") {

            }
            else {

            }
        });
    }
})();