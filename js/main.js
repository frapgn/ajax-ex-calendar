var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);

// Stampa il mese di Gennaio 2018
// Tramite click stampare il mese successivo

var dataIniziale = moment('2018-01-01').locale('it');
var meseIniziale = dataIniziale.format('M') - 1;
console.log(meseIniziale);
stampaGiorniMese(dataIniziale);
stampaFestivi(meseIniziale);

$('.mese-succ').click(function() {
    if(meseIniziale <= 10) {
        dataIniziale.add(1, 'months');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(++meseIniziale);
    }
});

$('.mese-prec').click(function() {
    if (meseIniziale >= 1) {
        dataIniziale.subtract(1, 'months');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(--meseIniziale);
    }

});

function stampaFestivi(meseStampato) {
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: 2018,
            month: meseStampato
        },
        success: function(data) {
            var giorniFestivi = data.response;
            for (var i = 0; i < giorniFestivi.length; i++) {
                var giornoFestivo = giorniFestivi[i];
                var nomeFestivo = giornoFestivo.name;
                var dataFestivo = giornoFestivo.date;
                $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
            }
        }
    });
}

function stampaGiorniMese(meseDaStampare) {
    $('#calendar').empty();
    var standardDay = meseDaStampare.clone();
    var giorniMese = meseDaStampare.daysInMonth();
    var nomeMese = meseDaStampare.format('MMMM');
    $('#nome-mese').text(nomeMese); // Aggiorna il nome del mese in top calendar
    for (var i = 1; i <= giorniMese; i++) {
        // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
        var giornoDaInserire = {
            day: i + ' ' + nomeMese,
            dataDay: standardDay.format('YYYY-MM-DD')
        }
        var templateFinale = templateGiorno(giornoDaInserire);
        $('#calendar').append(templateFinale);
        standardDay.add(1, 'day');
    }
}
