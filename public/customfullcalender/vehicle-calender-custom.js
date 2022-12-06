var allDates = [];
var dateObjDetails = [];
samepleDateFormat.map((sampleDate, index) => {
	allDates.push(moment(sampleDate.startDate).format('DD/MM/YYYY'));

	const startDateSplit = moment(sampleDate.startDate).format('YYYY-MM-DD').split('-');
	const endDateSplit = moment(sampleDate.endDate).format('YYYY-MM-DD').split('-');
	dateObjDetails.push({
		id: sampleDate._id,
		startDate: new Date(startDateSplit[0], startDateSplit[1] - 1, startDateSplit[2]).getTime(),
		endDate: new Date(endDateSplit[0], endDateSplit[1] - 1, endDateSplit[2]).getTime(),
		active: (sampleDate.active == 1) ? 'ACTIVE' : 'NON ACTIVE',
		totalPrice: sampleDate.totalPrice,
		historic: sampleDate.historic
	});
});
// console.log({allDates, dateObjDetails});

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
var eventList = getNewEventList(y, m);
$('#calendar').fullCalendar({
	header: {
		left: 'prev,next',
		center: 'title',
		right: ''
	},
	editable: true,
	events: eventList,
	eventRender: function (event, element) {
		element.find('.fc-event-title').append("<br/>" + event.description);
		element.find('.fc-event-title').append("<a href='#' title='Coming Soon!' class='historic'  style='color:#fff;font-size:12px;' data-toggle='modal' >Historic</a>");
		$('.fc-event-title').css({ "cursor": "pointer" });
		element.find('.fc-event-title').click(function () {
			// console.log(event.rangeid);
			$('#calender_modal').modal('hide');
			$('#daterangeli_' + event.rangeid).click();
		});
		element.find('.historic').click(function () {
			// var myJSON = JSON.stringify(event.historic);
			// console.log({myJSON});
			openModal2(event.historic);
		});
	}
});

function closeHistoric() {
	$('#myModal').modal('hide');
	$('#calender_modal').modal('show');
	if ($('.modal:visible').length) {
		$('body').addClass('modal-open');
	}
	$(".modal").css({ 'background-color': 'rgba(0,0,0,0.3);' });
}

function downloadHistory() {
	$('#btnPrint').click();
}

function openModal2(historic) {
	//$('#calender_modal').modal('hide');
	$('#myModal').modal('show');
	if ($('.modal:visible').length) {
		$('body').addClass('modal-open');
		// console.log({historic});
		var modal_data = '';
		historic.forEach(function (data) {
			// var row = JSON.stringify(data);
			var date = new Date(data.edit_time);
			var edit_date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
			var time = date.getHours() + ":" + date.getMinutes();
			modal_data = modal_data + '<p>' + edit_date + ' at ' + time + ' by ' + data.user + ' Start date : ' + data.start_date + ' End date : ' + data.end_date + '</p>';
			// console.log(data.start_date);
		});
		modal_data = modal_data + '<p><a href="javascript:void(0)" class="downloadHistory" onCLick="javascript: downloadHistory();">Download History</a></p>';
		$("#modal_data").html(modal_data);
	}
}

function openModal() {
	$('#calender_modal').modal('show');
	$(".fc-event-draggable").css({ 'cursor': '' });

}

$('#calender_modal').on('shown.bs.modal', function () {
	$("#calendar").fullCalendar('render');
	// $(".fc-event-draggable").removeAttribute('cursor');
});

/*$(".greenEvent").on('click', function(e){
	var lastClass = $(this).attr('class').split(' ').pop();
	console.log({lastClass});
});

$('.fc-event-title').on('click',function(){
	alert('dd');
});*/

$('.fc-button-prev span').click(function (e) {
	e.preventDefault();
	var monthName = $('.fc-header-title').html().replace(/(<([^>]+)>)/ig, '').split(' ');
	var monthYearSplit = monthArray.indexOf(monthName[0]);
	var y = monthName[1];
	var m = monthYearSplit - 1;
	var eventArray = getNewEventList(y, m);
	initializeCalender(eventArray);
});

$('.fc-button-next span').click(function (e) {
	e.preventDefault();
	var monthName = $('.fc-header-title').html().replace(/(<([^>]+)>)/ig, '').split(' ');
	var monthYearSplit = monthArray.indexOf(monthName[0]);
	var tglCurrent = $('#calendar').fullCalendar('getDate');
	var date = new Date(tglCurrent);
	var y = monthName[1];
	var m = monthYearSplit + 1;
	var eventArray = getNewEventList(y, m);
	initializeCalender(eventArray);
});

function getNewEventList(year, monthIndex) {
	var daysNumber = new Date(year, monthIndex + 1, 0).getDate();
	var monthEventBinder = [];
	for (var i = 1; i <= daysNumber; i++) {
		var dateEvent = new Date(year, monthIndex, i);
		var dateEventTimestamp = dateEvent.getTime();
		var isExist = 0;
		dateObjDetails.map(singleDate => {
			// console.log('totalPrice', singleDate.totalPrice);
			if (dateEventTimestamp >= singleDate.startDate && dateEventTimestamp <= singleDate.endDate) {
				let concatString = singleDate.startDate + '@@' + singleDate.endDate;
				if (monthEventBinder.findIndex(x => x.concatString === concatString) == -1) {
					monthEventBinder.push({
						startDate: singleDate.startDate,
						endDate: singleDate.endDate,
						concatString: concatString,
						totalPrice: singleDate.totalPrice,
						active: singleDate.active,
						id: singleDate.id,
						historic: singleDate.historic
					})
				}
				isExist++;
			}
		});
		if (isExist == 0) {
			monthEventBinder.push({
				startDate: dateEventTimestamp,
				endDate: '',
				totalPrice: 0,
				active: ''
			});
		}
	}

	// console.log({monthEventBinder});
	var eventList = [];
	monthEventBinder.map((singleValue, singleIndex) => {
		var totalPrice = singleValue.totalPrice || 'NaN';
		var CSSClass = 'greyEvent';
		if (singleValue.endDate !== '' && singleValue.totalPrice > 0 && singleValue.active == 'ACTIVE') {
			CSSClass = 'greenEvent';
		} else if (singleValue.endDate !== '' && singleValue.totalPrice > 0 && singleValue.active == 'NON ACTIVE') {
			CSSClass = 'redEvent';
		}

		eventList.push({
			id: singleIndex,
			title: totalPrice + ' \u20AC',
			start: new Date(singleValue.startDate),
			end: new Date(singleValue.endDate),
			description: singleValue.active + '<br/><p>Default for 1 day</p>',
			className: ['event', CSSClass, singleValue.id],
			rangeid: singleValue.id,
			historic: singleValue.historic
		});
	});

	return eventList;
}

function initializeCalender(eventArray) {
	$('#calendar').fullCalendar('removeEvents');
	$('#calendar').fullCalendar('addEventSource', eventArray);
	$('#calendar').fullCalendar('rerenderEvents');
	$('#calendar').fullCalendar('refetchResources');
}