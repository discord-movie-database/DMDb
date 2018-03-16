$('header .toggle a').click(function() {
    $('header').toggleClass('toggled');
});



$('.background').css({
    'background-image': "url('/public/img/backgrounds/bg-" + (Math.floor(Math.random() * 9) + 1) + ".jpg')"
});

$(document).ready(function() {
    $('.background').css({
        opacity: '0.085'
    });
});



$('.guild .arrow').click(function() {
    $(this).parent().before().parent().toggleClass('toggled');
});

$('.guild').submit(function(e) {
    var response = $(this).find('.settings').find('.response').css({'margin-top': '10px'});
    response.text('Updating guild...');

    e.preventDefault();

    var guildId = $(this).attr('id');

    var prefix = $(this).find('input[name="prefix"]').val();

    $.post('/panel/guild/' + guildId + '/update', {
        prefix: prefix
    }).done(function(resp) {
        if (!resp.success) return response.text(resp.error);

        response.text('Updated guild.');
    }).fail(function() {
        response.text('Cannot contact API.');
    });
});