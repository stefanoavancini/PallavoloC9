                document.addEventListener('backbutton', function () {
                    slide('right', 'purple',0,"index.html");
                }, false);

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
                            alert('error: ' + msg);
                        });
                }
                $("#wrapper").touchwipe({
                    wipeLeft: function () {  },
                    wipeRight: function () { slide('right', 'purple', 0, "index.html"); 
                    },
                    wipeUp: function () { //alert("up"); 
                    },
                    wipeDown: function () { //alert("down");
                    },
                    min_move_x: 20,
                    min_move_y: 20,
                    preventDefaultEvents: true
                });