$('header .toggle a').click(function() {
    $('header').toggleClass('toggled');
});

$('.background').css({
    "background-image": "url('/public/img/backgrounds/bg-" + (Math.floor(Math.random() * 9) + 1) + ".jpg')"
});

$(document).ready(function() {
    $('.background').css({
        "opacity": "0.085"
    });
});

$('.guild .arrow').click(function() {
    $(this).parent().before().parent().toggleClass('toggled');
});