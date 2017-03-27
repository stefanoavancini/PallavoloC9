

var items_per_page = 10;
var scroll_in_progress = false;
var myScroll;

load_content = function (refresh, next_page) {

    // This is a DEMO function which generates DEMO content into the scroller.
    // Here you should place your AJAX request to fetch the relevant content (e.g. $.post(...))

    //console.log(refresh, next_page);
    setTimeout(function () { // This immitates the CALLBACK of your AJAX function

        if (refresh=='refresh') {
            myScroll.refresh();
            pullActionCallback();

        } else {

            if (myScroll) {
                myScroll.destroy();
                $(myScroll.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
                myScroll = null;
            }
            trigger_myScroll();

        }
    }, 1000);

};

function pullDownAction() {
    location.reload();
    load_content('refresh');
    console.log("reload");
    
}
function pullUpAction(callback) {

    if (callback) {
        callback();
    }
}
function pullActionCallback() {
    if (pullDownEl && pullDownEl.className.match('loading')) {

        pullDownEl.className = 'pullDown';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Trascina verso il basso per aggiornare';

        myScroll.scrollTo(0, parseInt(pullUpOffset) * (-1), 200);

    } else if (pullUpEl && pullUpEl.className.match('loading')) {

        $('.pullUp').removeClass('loading').html('');

    }
}

var pullActionDetect = {
    count: 0,
    limit: 10,
    check: function (count) {
        if (count) {
            pullActionDetect.count = 0;
        }
        // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
        setTimeout(function () {
if (pullActionDetect.count < pullActionDetect.limit) {
                pullActionDetect.check();
                pullActionDetect.count++;
            }
        }, 200);
    }
}

function trigger_myScroll(offset) {
    pullDownEl = document.querySelector('#wrapper .pullDown');
    if (pullDownEl) {
        pullDownOffset = pullDownEl.offsetHeight;
        offset = pullDownOffset;
    } else {
        pullDownOffset = 0;
        offset = 0;
    }

    /*
    if ($('#wrapper ul > li').length < items_per_page) {
        // If we have only 1 page of result - we hide the pullup and pulldown indicators.
            $('#wrapper .pullDown').hide();
    offset = 0;
    } else if (!offset) {
        // If we have more than 1 page of results and offset is not manually defined - we set it to be the pullUpOffset.
        offset = pullUpOffset;
    }
    */

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
        deceleration: 0.0002,
        startY: (parseInt(offset) * (-1))
    });

    myScroll.on('scrollStart', function () {
        scroll_in_progress = true;
    });
    myScroll.on('scroll', function () {

        scroll_in_progress = true;

            if (this.y >= 5 && pullDownEl && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '';
                this.minScrollY = 0;
            } else if (this.y <= 5 && pullDownEl && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '';
                this.minScrollY = -pullDownOffset;
            }
            
            console.log(this.y);
            console.log(this.x);
            console.log(this.dirX);
            console.log(!!this.dirX);
            pullActionDetect.check(0);
            if (device.platform == "windows") {
                $('.dett').bind('click', false);
            }
    });
    myScroll.on('scrollEnd', function () {
        console.log('scroll ended');
        setTimeout(function () {
            scroll_in_progress = false;
        }, 100);
        console.log(pullDownEl.className);
            if (pullDownEl && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown loading';
                $("body").addClass("loading");
                //$('.pullDown').addClass('loading').html('<span class="pullDownIcon">&nbsp;</span><span class="pullDownLabel">Caricamento...</span>');
                //pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Caricamento in corso...';
                pullDownAction();
            }
            pullActionDetect.check(0);
        // We let the momentum scroll finish, and if reached the end - loading the next page
            if (device.platform == "windows") {
                setTimeout(function () {
                    $('.dett').unbind('click', false);
                }, 100);
            }
            //

    });

    // In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
    setTimeout(function () {
        $('#wrapper').css({ left: 0 });
    }, 100);
}

function loaded() {

    load_content();

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

//document.addEventListener('DOMContentLoaded', setTimeout(function () { loaded(); }, 200), false);
document.addEventListener('DOMContentLoaded', loaded(), false);
//window.addEventListener("load", loaded(), false);