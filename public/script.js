var date = new Date();
date.setDate(date.getDate());

$('#date').datepicker({
    startDate: date
});

var date2 = new Date();
date2.setDate(date2.getDate());

$('#date1').datepicker({
    startDate: date2
});