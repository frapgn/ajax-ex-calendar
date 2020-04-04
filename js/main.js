var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);



// Stampa il mese di Gennaio 2018
var dataIniziale = moment('2018-01-01').locale('it');
var meseIniziale = dataIniziale.format('M') - 1; //sottraggo 1 per farlo combaciare con le API
stampaGiorniMese(dataIniziale);
stampaFestivi(meseIniziale);

// Tramite click stampare il mese successivo
$('.mese-succ').click(function() {
    if(meseIniziale <= 10) {
        dataIniziale.add(1, 'months');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(++meseIniziale);
    }
});

// Tramite click stampare il mese precedente
$('.mese-prec').click(function() {
    if (meseIniziale >= 1) {
        dataIniziale.subtract(1, 'months');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(--meseIniziale);
    }

});

// Ricavo dall'API i festivi del mese che viene passato, coloro di rosso il giorno corrispondente e aggiungo di fianco il nome della festività
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

// Stampo i giorni del mese che viene passato
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
