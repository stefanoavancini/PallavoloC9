// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.



$("body").removeClass("update");
$("body").addClass("loading");
var dispositivo = "";
var schemetw = ""
var schemefb = "";
var apptwitter = "NO";
var appfacebook = "NO";

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind(this), false );
        document.addEventListener('resume', onResume.bind(this), false);
        document.addEventListener('touchmove', preventDefaultScrolling, false);
        function preventDefaultScrolling(event) {
            event.preventDefault(); //this stops the page from scrolling.
        }

        var push = PushNotification.init({
            "android": {
                "senderID": "146415675457"
            },
            "ios": { "alert": "true", "badge": "false", "sound": "true", "clearBadge": "true" },
            "windows": {}
        });

        //document.getElementById("regId").innerHTML = push.registrationId; 
        //$.post('http://www.pallavoloc9.it/php/update.php', { registrationid: "11", campionati: "0" });
        /*
        $.post('http://www.pallavoloc9.it/php/update.php', { registrationid: "11", campionati: "0" }, function (response) {
            // Log the response to the console
            console.log("Response: " + response);
        });
        */        
        
        push.on('registration', function (data) {
            //console.log("registration event");
            $.post('http://www.pallavoloc9.it/php/update.php', { registrationid: data.registrationId, campionati: "0", notifica: "0", avversari: "NO", device: device.platform }, function (response) {
                //console.log("Response: " + response);
            });
            //globalVariable = { registrationId: data.registrationId };
            //top.glob = data.registrationId;
            //document.getElementById("regId").innerHTML = data.registrationId;
            //console.log(JSON.stringify(data));
        });

        push.on('notification', function (data) {
            //console.log("notification event");
            push.setApplicationIconBadgeNumber(0);
            //console.log(JSON.stringify(data));
            var res = data.additionalData.additionalData.split(";");
            location.href = 'dettaglio.html?campionato=' + res[0] + '&giornata=' + res[1] + '&squadra=' + res[2];
                
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
                for (var j in data.risultati) {
                    var object = data.risultati[j];
                    if (cont == 0) {
                        cont++;
                        for (var i in object.reverse()) {
                            var array = object[i].risultato.split("-");
                            var spancasa, spanospiti = "";
                            if (object[i].squadracasa.length > 29)
                                spancasa = object[i].squadracasa.substring(0, 29);
                            else spancasa = object[i].squadracasa;

                            if (object[i].squadraospite.length > 29) 
                                spanospiti = object[i].squadraospite.substring(0, 29);
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

                            output += squadra_app1 + "<li><a class='dett' href=\"dettaglio.html?giornata=" + object[i].giornata + "&campionato=" + object[i].campionato + "\">" + spancasa + "<label class=\"digits\">" + array[0].trim() + "</label><div class=\"clear\"></div>";
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
                            prossime += squadra_app1 + "<li><a class='dett' href=\"dettaglio.html?giornata=" + object[k].giornata + "&campionato=" + object[k].campionato + "\">" + spancasa + "<label style=\"font-size:0.8em\" class=\"digits\">" + data + "</label><div class=\"clear\"></div>";
                            prossime += spanospiti + "<label style=\"font-size:0.8em\" class=\"digits\">" + ora + "</label><div class=\"clear\"></div>";

                            var palestra = object[k].palestra.replace('�', '&egrave;').replace('�','&agrave').replace('�','&ograve').replace('�','&igrave');
                            //palestra = object[k].palestra.replace('�', '&egrave;');
                            prossime += "<span class=\"palestra\">" + palestra + "</span>";
                            //prossime += "<div class=\"clear\"></div>";
                            prossime += "</a></li>";
                            //output += "<li><a href=\"#\"><span class=\"day_name\">" + data.risultati.risultati[i].squadraospite + "</span><label class=\"digits\">" + array[1].trim() + "</label><div class=\"clear\"></div></a></li>";
                        }
                    }

                }


                output += "</ul>";
                prossime += "</ul>";
                document.getElementById("ultime").innerHTML = output;
                document.getElementById("prossime").innerHTML = prossime;
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
                $("body").removeClass("loading");
                //myScroll.destroy();
                //myScroll = null;
                loaded();
                //console.log(device.platform);
                //myScroll.refresh();
                //myScroll.refresh();
            }
            else if(status == "error" || status == "parsererror" || status == "timeout" ){
                
            }
            else {

            }
        });
        
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
    
} )();