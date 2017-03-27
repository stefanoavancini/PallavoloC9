// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
$("body").removeClass("update");
$("body").addClass("loading");
var arraycampionati = [];
var arrayavversari = [];
var aggiorna = false;
var registrationid = "";
var notifiche = "";
var notificheavv = "";
function updatePosition() {
    if (this.y > 20) {
        aggiorna = true;
    }
    if (device.platform == "windows") {
        //$('.dett').bind('click', false);
    }
}
function aggiorna_pagina() {
    if ((aggiorna) && (this.y == 0)) {
        location.reload();
        aggiorna = false;
    }
    if (device.platform == "windows") {
        //setTimeout(function () {
            //$('.dett').unbind('click', false);
       // }, 100);
    }
}
function loaded() {

    //myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, useTransition: false, preventDefaultException: { tagName: /.*/ }, click: true });
    myScroll = new IScroll('#wrapper', {
        probeType: 1,
        tap: false,
        click: false,
        preventDefaultException: { tagName: /.*/ },
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
    myScroll.on('scroll', updatePosition);
    myScroll.on('scrollEnd', aggiorna_pagina);

    setTimeout(function () {
        $('#wrapper').css({ left: 0 });
    }, 100);
}
function testClick() {
    notifiche = "";
    notificheavv = "";
    for (var i = 0; i < arraycampionati.length; i++) {
        //console.log(arraycampionati[i] + " checked: " + $("#CAM" + arraycampionati[i]).is(':checked'));
        
        if ($("#CAM" + arraycampionati[i]).is(':checked')) {
            notifiche += arraycampionati[i] + "S";
        }
    }
    for (var j = 0; j < arrayavversari.length; j++) {
        //console.log(arrayavversari[j] + " checked: " + $("#" + arrayavversari[j]).is(':checked'));
        if ($("#" + arrayavversari[j]).is(':checked')) {
            notificheavv += arrayavversari[j] + "S";
        }
    }
    if (notificheavv == "")
        notificheavv = "NO";
    if (notifiche == "")
        notifiche = "0";
    console.log("UPDATE: " + registrationid);
    $.post("http://www.pallavoloc9.it/php/update.php", { registrationid: registrationid, campionati: notifiche, notifica: "SI", avversari: notificheavv, device: device.platform }, function (response) {
        console.log("Response_post_update: " + response);
    });
    output = '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Notifiche salvate correttamente.';
    //$(output).appendTo("#notifiche");
    document.getElementById("notifiche").innerHTML = (output);
    myScroll.scrollToElement(document.getElementById("wrapper"), 2000);
   // $('#wrapper').scrollTop(0);
   // $('.wrapper').scrollTop(0);
    //$("html, body").animate({ scrollTop: 0 }, "slow");
}

(function () {

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function getdata() {

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
        push.on('registration', function (data) {
            //console.log("registration event");
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
            registrationid = data.registrationId;
        
            //registrationid = 'f0iln-xjjFY:APA91bGq2G9zcFj90leJ5WO1LnOn_y0LwHpZfiZdbcl-tSYCydmGu1sSPnALPj6Aak5eIypdGqfKhCBEdoeG-1kdpKLw-WDxnEvE415_Rj6dDP0UqxziGwSRV5W1gm6D2090IuIYZWz6';
            //console.log(JSON.stringify(data));
            //document.getElementById("regId").innerHTML = data.registrationId;
            //var uri_dec = decodeURIComponent(registrationid);
            //console.log(registrationid);
            //console.log(registrationid);
           // console.log(registrationid.substring(registrationid.lastIndexOf('token') + 6));
            var res = registrationid.substring(0, registrationid.lastIndexOf('token') + 6) + registrationid.substring(registrationid.lastIndexOf('token') + 6).replace("+", "%2b").replace("/", "%2f").replace("=", "%3d");
            console.log(res);
            var link = "";
            if (device.platform == "windows")
            {
                link = 'http://www.pallavoloc9.it/php/squadre-json.php?date='+ new Date().getTime() + '&registrationid=' + res;
            }
            else {
                link = 'http://www.pallavoloc9.it/php/squadre-json.php?registrationid=' + registrationid;
            }
            
            //console.log(link);
            
            var myAjaxCall = $.getJSON(link, function (data) {
                console.log(link);
                //var output = '<h5><div class="info message"><p>Seleziona le squadre per la quale vuoi ricevere le notifiche sui risultati. Selezionando SI nella colonna Squadre avversarie riceverai i risultati delle squadre avversarie</p></div>';
                isneedtoKillAjax = false;
                var output = '<div class="container">';
                output += '';
                output += '<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Seleziona le squadre per la quali vuoi ricevere le notifiche dei risultati. Selezionando SI nella colonna "squadre avversarie" riceverai anche le notifiche dei risultati delle altre partite del campionato.';
                output += '</div>';
                output += '<div id="notifiche"></div>';
                output += '<button class="salva_notifiche" value="SALVA" id="salva" onclick="testClick()">SALVA</button>';
                output += "<center><table><thead><tr><th colspan=2><h4>SQUADRA</h4></th><th><h4>SQUADRE AVVERSARIE</H4></th></thead>";
                var prossime = "<ul>";
                var cont = 0;
                var notifiche = null;
                var object = null;
                for (var j in data.squadre)
                {
                    if (cont == 0) {
                        object = data.squadre[j];
                        cont++;
                    }
                    else {
                        notifiche = data.squadre[j];
                    }
                    
                }
                //console.log(object);
                cont = 0;
                    var campionati_notifiche = "";
                    var avversari_notifiche = "";
                    var scriptstring = "";
                    for (var k in notifiche) {
                        campionati_notifiche = notifiche[k].campionati;
                        avversari_notifiche = notifiche[k].avversari;
                    }
                    if (cont == 0) {
                        cont++;
                        for (var i in object) {
                            arraycampionati.push(object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo);
                            var app = "AVV" + object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo;
                            arrayavversari.push(app);
                            output += '<tr><td><input type="checkbox" id="CAM' + object[i].campionati.replace(/;/g, "S") + 'T' + object[i].tipo + '" ';
                            //output += '<tr><td><label class="switch"><input class="switch-input" type="checkbox" id="' + object[i].campionati + '" ';
                            if (campionati_notifiche.indexOf(object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo) > -1)
                            {
                                output += 'checked ';
                            }                                
                            output += '/>';
                            //output += '<span class="switch-label" data-on="SI" data-off="NO"></span> <span class="switch-handle"></span>';
                            //output += '</label>';
                            output += '</td><td>';
                            output += '<h4>' + object[i].nome_sito + '</h4>'; 
                            output += '</td><td>';
                            output += '<input type="checkbox" id="AVV' + object[i].campionati.replace(/;/g, "S") + 'T' + object[i].tipo + '" ';
                            //output += '<center><label class="switch"><input class="switch-input" type="checkbox" id="AVV|' + object[i].campionati + '" ';

                            if (avversari_notifiche.indexOf(object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo) > -1) {
                                output += 'checked ';
                            }

                            output += '/>';
                            //output += '<span class="switch-label" data-on="SI" data-off="NO"></span> <span class="switch-handle"></span>';
                            //output += '</label></center>';
                            output += '</td></tr>';
                            var campapp = "#CAM" + object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo;
                            var avvapp = "#AVV" + object[i].campionati.replace(/;/g, "S") + "T" + object[i].tipo;
                            scriptstring += "$('" + campapp + "').toggleSwitch({onLabel: 'SI',offLabel:'NO',width: '70px',height: '30px'});";
                            scriptstring += "$('" + avvapp + "').toggleSwitch({onLabel: 'SI',offLabel:'NO',width: '70px',height: '30px'});";
                            //$(avvapp).toggleSwitch();
                            //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                        }
                    } else {


                    }

                
                output += "</table>";
                output += '<button class="salva_notifiche" value="SALVA" id="salva" onclick="testClick()">SALVA</button>';
                //console.log(output);
                
                //document.getElementById("squadre").innerHTML = (output);
                var scr = document.createElement('script');
                //scr.innerHTML = "$(";
                //var scr = document.createElement('script'); 
                
                scr.innerHTML = scriptstring;
                scr.type = 'text/javascript';
                //$(output).appendTo("#squadre");
                //$(scr).appendTo("#squadre");
                
                

                //var squadre = document.getElementById("squadre");
                squadre.innerHTML = output; //output
                squadre.appendChild(scr);
                $('#salva').click(function () { testClick(); return false; });
                $("#salva_notifiche").on("touchend", testClick);
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
                /*
                for (var i = 0; i < arraycampionati.length; i++) {
                    if (document.getElementById(arraycampionati[i]).checked) {
                        notifiche += arraycampionati[i] + ";";
                    }
                    if (document.getElementById(arrayavversari[i]).checked) {
                        notificheavv += arrayavversari[i] + ";";
                    }
                   
                                    if ($(arraycampionati[i]).prop('cheched')) {
                                        notifiche += arraycampionati[i] + ";";
                                    }
                                    if ($(arrayavversari[i]).prop('cheched')) {
                                        notificheavv += arrayavversari[i] + ";";
                                    }
                    //Do something
                }*/
                //console.log(notifiche);
                //console.log(notificheavv);
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
        });
    };
   
    /*
    function prova() {
        //registrationid = 'f0iln-xjjFY:APA91bGq2G9zcFj90leJ5WO1LnOn_y0LwHpZfiZdbcl-tSYCydmGu1sSPnALPj6Aak5eIypdGqfKhCBEdoeG-1kdpKLw-WDxnEvE415_Rj6dDP0UqxziGwSRV5W1gm6D2090IuIYZWz6';
        var link = 'http://www.pallavoloc9.it/php/squadre-json.php?registrationid=' + registrationid;
        console.log(link);
        $.getJSON(link, function (data) {
            //var output = '<h5><div class="info message"><p>Seleziona le squadre per la quale vuoi ricevere le notifiche sui risultati. Selezionando SI nella colonna Squadre avversarie riceverai i risultati delle squadre avversarie</p></div>';

            var output = '<div class="container">';
            output += '';
            output += '<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Seleziona le squadre per la quale vuoi ricevere le notifiche sui risultati. Selezionando SI nella colonna Squadre avversarie riceverai i risultati delle squadre avversarie.';
            output += '</div>';
            output += '<div id="notifiche"></div>';
            output += "<center><table><thead><tr><th colspan=2><h4>SQUADRA</h4></th><th><h4>SQUADRE AVVERSARIE</H4></th></thead>";
            var prossime = "<ul>";
            var cont = 0;
            var notifiche = null;
            var object = null;
            for (var j in data.squadre)
            {
                if (cont == 0) {
                    object = data.squadre[j];
                    cont++;
                }
                else {
                    notifiche = data.squadre[j];
                }
                    
            }
            //console.log(object);
            cont = 0;
            var campionati_notifiche = "";
            var avversari_notifiche = "";
            for (var k in notifiche) {
                campionati_notifiche = notifiche[k].campionati;
                avversari_notifiche = notifiche[k].avversari;
            }
            if (cont == 0) {
                cont++;
                for (var i in object) {
                    arraycampionati.push(object[i].campionati);
                    var app = "AVV|" + object[i].campionati;
                    arrayavversari.push(app);
                    output += '<tr><td><label class="switch"><input class="switch-input" type="checkbox" id="' + object[i].campionati + '" ';
                    if (campionati_notifiche.indexOf(object[i].campionati) > -1)
                    {
                        output += 'checked ';
                    }                                
                    output += '/>';
                    output += '<span class="switch-label" data-on="SI" data-off="NO"></span> <span class="switch-handle"></span>';
                    output += '</label>';
                    output += '</td><td>';
                    output += '<h4>' + object[i].nome_sito + '</h4>';
                    output += '</td><td>';

                    output += '<center><label class="switch"><input class="switch-input" type="checkbox" id="AVV|' + object[i].campionati + '" ';

                    if (avversari_notifiche.indexOf(object[i].campionati) > -1) {
                        output += 'checked ';
                    }

                    output += '/>';
                    output += '<span class="switch-label" data-on="SI" data-off="NO"></span> <span class="switch-handle"></span>';
                    output += '</label></center>';
                    output += '</td></tr>';
                    //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                }
            } else {


            }

                
            output += "</table>";
            output += '<button class="salva_notifiche" value="SALVA" id="salva" onclick="testClick()">SALVA</button>';

            //output += '<script type="text/javascript"></script>';
  
            //console.log(output);
            document.getElementById("squadre").innerHTML = (output);
            //document.getElementById("prossime").innerHTML = prossime;
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            $("body").removeClass("loading");
            loaded();
            //console.log(notifiche);
            //console.log(notificheavv);
            });
    }*/
    
    $("#salva").click(function() { 
        //var campionati = arraycampionati.join();\
        //var avversari = arrayavversari.join();\

            

        });


    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind(this), false );
        document.addEventListener('resume', onResume.bind(this), false);
        getdata();
        
        
        //setTimeout($("#ToggleSwitchSample2").toggleSwitch(), 1000);
        //setTimeout($("#CAM3791").toggleSwitch(), 1000);
        //prova();
        //$.post('http://www.pallavoloc9.it/php/update.php', { registrationid: push.registrationid, campionati: "0" });

    };
        


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();