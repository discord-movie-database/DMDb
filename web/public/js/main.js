$('header .toggle a').click(function() {
    $('header').toggleClass('toggled');
});

$('.background').css({
    "background-image": "url('/public/img/backgrounds/background-" + (Math.floor(Math.random() * 9) + 1) + ".jpg')"
});

$(document).ready(function() {
    $('.background').css({
        "opacity": "0.085"
    });
});