var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);

var dataIniziale = moment('2018-01-01')

var dataProcessata = dataIniziale.clone().locale('it');
var limiteIniziale = moment('2018-01-01');
var limiteFinale = moment('2018-12-01');

// Stampa il mese di Gennaio 2018
stampaGiorniMese(dataProcessata);
stampaFestivi(dataProcessata);

// Tramite click stampare il mese successivo
$('.mese-succ').click(function() {
    if(dataProcessata.isSameOrAfter(limiteFinale)) {
        alert('Hai provato ad hackerarmi!');
    } else {
        $('.mese-prec').prop('disabled', false);
        dataProcessata.add(1, 'months');
        stampaGiorniMese(dataProcessata);
        stampaFestivi(dataProcessata);
        if(dataProcessata.isSameOrAfter(limiteFinale)) {
            $('.mese-succ').prop('disabled', true);
        }
    }

});

// Tramite click stampare il mese precedente
$('.mese-prec').click(function() {
    if(dataProcessata.isSameOrBefore(limiteIniziale)) {
        alert('Hai provato ad hackerarmi!');
    } else {
        $('.mese-succ').prop('disabled', false);
        dataProcessata.subtract(1, 'months');
        stampaGiorniMese(dataProcessata);
        stampaFestivi(dataProcessata);
        if(dataProcessata.isSameOrBefore(limiteIniziale)) {
            $('.mese-prec').prop('disabled', true);
        }
    }

});

// Ricavo dall'API i festivi del mese che viene passato, coloro di rosso il giorno corrispondente e aggiungo di fianco il nome della festività
function stampaFestivi(meseStampato) {
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: meseStampato.year(),
            month: meseStampato.month()
        },
        success: function(data) {
            var giorniFestivi = data.response;
            for (var i = 0; i < giorniFestivi.length; i++) {
                var giornoFestivo = giorniFestivi[i];
                var nomeFestivo = giornoFestivo.name;
                var dataFestivo = giornoFestivo.date;
                $('#calendar .day-box[data-day="' + dataFestivo + '"]').addClass('festivo').append('<div>' + nomeFestivo + '</div>');
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
    for (var i = 1; i < standardDay.isoWeekday(); i++) {
        $('#calendar').append('<div class="day-box"></div>');
    }
    for (var i = 1; i <= giorniMese; i++) {
        // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
        var giornoDaInserire = {
            day: i + ' ' + nomeMese,
            dataDay: standardDay.format('YYYY-MM-DD'),
            dayOfWeek: standardDay.isoWeekday() // aggiunto come bonus :)
        }
        var templateFinale = templateGiorno(giornoDaInserire);
        $('#calendar').append(templateFinale);
        standardDay.add(1, 'day');
    }
}
