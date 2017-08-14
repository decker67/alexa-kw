'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.e8e2e9a3-36b5-420d-b5ba-df9578fbcf54';

var languageStrings = {
    'de-DE': {
        'translation': {
            'SKILL_NAME' : 'Kalenderwoche',
            'CALENDAR_WEEK_MESSAGE' : ' liegt in der Kalenderwoche ',
            'ACTUAL_CALENDAR_WEEK_MESSAGE': 'Wir haben die Kalenderwoche ',

            'HELP_MESSAGE': "Du kannst mich nach der aktuellen oder der Kalenderwoche zu einem bestimmten Datum fragen. Was möchtest Du wissen?",
            'HELP_REPROMPT': "Was möchtest Du wissen?",
            'STOP_MESSAGE': 'Tschüss'
        }
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetCalendarWeek');
    },
    'GetCalendarWeek': function () {
        //console.log(JSON.stringify(this.event.request));
        var specificDate = (this.event.request.intent && this.event.request.intent.slots && this.event.request.intent.slots.date.value);
        var kwDatum = specificDate ? new Date(Date.parse(this.event.request.intent.slots.date.value)) : new Date();
        var cw = calendarWeek(kwDatum);
        var calenderweekText = this.t( specificDate ? 'CALENDAR_WEEK_MESSAGE' : 'ACTUAL_CALENDAR_WEEK_MESSAGE') + cw;
        var speechOutput = specificDate ? this.event.request.intent.slots.date.value + calenderweekText : calenderweekText;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), cw);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t(HELP_MESSAGE);
        var reprompt = this.t(HELP_REPROMPT);
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    }
};

function calendarWeek(kwDatum) {
    var firstThursdayDate = new Date(kwDatum.getTime() + (3-((kwDatum.getDay()+6) % 7)) * 86400000);
    var kwYear = firstThursdayDate.getFullYear();
    var firstThursdayWeek = new Date(new Date(kwYear, 0,4).getTime() + (3-((new Date(kwYear, 0,4).getDay()+6) % 7)) * 86400000);
    var calendarWeek = Math.floor(1.5 + (firstThursdayDate.getTime() - firstThursdayWeek.getTime()) / 86400000/7);

    return calendarWeek;
}