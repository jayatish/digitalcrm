
var dateObjDetails = [];
samepleDateFormat.map(sampleDate => {
    console.log("sampleDate **",sampleDate);
    var startDateSplit = moment(sampleDate.startDate).format('YYYY-MM-DD').split('-');
    console.log("startDateSplit **", startDateSplit);
    var startDateObj = new Date(startDateSplit[0], startDateSplit[1]-1, startDateSplit[2]);

    var endDateSplit = moment(sampleDate.endDate).format('YYYY-MM-DD').split('-');
    var endDateObj = new Date(endDateSplit[0], endDateSplit[1]-1, endDateSplit[2]);

    dateObjDetails.push({
        startDate: startDateObj.getTime(),
        endDate: endDateObj.getTime(),
    })
});

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
var eventList = getNewEventList(y, m);
console.log('eventList ==> ', eventList);
$('#calendar').fullCalendar({
    header: {
        left: 'prev,next',
        center: 'title',
        right: ''
    },
    editable: true,
    events: eventList,
    eventRender: function(event, element) {
        element.find('.fc-event-title').append("<br/>" + event.description); 
    }
});
function openModal() {
    $('#calender_modal').modal('show');
}
$('#calender_modal').on('shown.bs.modal', function () {
   $("#calendar").fullCalendar('render');
});
$('.fc-button-prev span').click(function(e){
    e.preventDefault();
    var monthName = $('.fc-header-title').html().replace( /(<([^>]+)>)/ig, '').split(' ');
    var monthYearSplit = monthArray.indexOf(monthName[0]);
    var y = monthName[1];
    var m = monthYearSplit-1;
    var eventArray = getNewEventList(y, m);
    initializeCalender(eventArray);
});

$('.fc-button-next span').click(function(e){
    e.preventDefault();
    var monthName = $('.fc-header-title').html().replace( /(<([^>]+)>)/ig, '').split(' ');
    var monthYearSplit = monthArray.indexOf(monthName[0]);
    var tglCurrent = $('#calendar').fullCalendar('getDate');
    var date = new Date(tglCurrent);
    var y = monthName[1];
    var m = monthYearSplit+1;
    var eventArray = getNewEventList(y, m);
    initializeCalender(eventArray);
});
function getNewEventList(year, monthIndex) {
    var daysNumber = new Date(year, monthIndex + 1, 0).getDate();
    var monthEventBinder = [];
    for(var i=1;i<=daysNumber;i++) {
        var dateEvent = new Date(year, monthIndex, i);
        var dateEventTimestamp = dateEvent.getTime();
        var isExist = 0;
        dateObjDetails.map(singleDate => {
            if(dateEventTimestamp >= singleDate.startDate && dateEventTimestamp <= singleDate.endDate) {
                let concatString = singleDate.startDate+'@@'+singleDate.endDate;
                if(monthEventBinder.findIndex(x => x.concatString === concatString) == -1) {
                    monthEventBinder.push({
                        startDate: singleDate.startDate,
                        endDate: singleDate.endDate,
                        concatString: concatString
                    })
                }
                isExist++;
            }
        });
        if(isExist==0) {
            monthEventBinder.push({
                startDate: dateEventTimestamp,
                endDate: ''
            });
        }
    }
    var eventList = [];
    monthEventBinder.map((singleValue, singleIndex) => {
        if(singleValue.endDate!=='') {
            var time_difference = singleValue.endDate - singleValue.startDate;
            var days_difference = time_difference / (1000 * 60 * 60 * 24);
            eventList.push(
                {
                    id: singleIndex,
                    title: 'Price 270',
                    start: new Date(singleValue.startDate),
                    end: new Date(singleValue.endDate),
                    description: '<p>Default for '+days_difference+' nights</p>',
                    className: ["event", "greenEvent"]
                }
            )
        } else {
            eventList.push(
                {
                    id: singleIndex,
                    title: 'Price 264',
                    start: new Date(singleValue.startDate),
                    description: '<p>Default for 1 night</p>'
                }
            )
        }
    });
    return eventList;
}
function initializeCalender(eventArray) {
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', eventArray);
    $('#calendar').fullCalendar('rerenderEvents');
    $('#calendar').fullCalendar('refetchResources');
}