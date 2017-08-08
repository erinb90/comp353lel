
var phn = "";
var licence_number ="";
var reservedSlots = {};
var serial_number = "";
var all_data= {};
var method = "create";

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CreateSchedule(data){
    phn = data.phn;
    serial_number = data.serialnumber;
    licence_number = data.licence_number;
    reservedSlots = data.reserved_slots;
    all_data = data;

    if(all_data["other"] != undefined){
        method = "modify";
    }

    ShowSpinner();
    moment().format('LLLL');

    // make sure starts with clean html element
    $(".week" ).remove( );
    $(".weeks-tabs" ).remove( );

    //create the tabs
    $("#schedule").append('<ul class="nav nav-tabs" id="schedule-weeks"></ul>');
    $("#schedule").append('<div class="tab-content weeks-tabs"></div>');

    //create menus of the coming 8 weeks
    for(var i=0; i<8; ++i){
        var active ="";
        if (i===0){
            active = "active"
        }

        var str = '<li class="week '+ active+'"><a data-toggle="tab" href="#week-'+ i +'" id="week"'+i+'>Week '+GetDayMonthNames(i,0)+'</a></li>';
        $("#schedule-weeks").append(str);
        CreateTab("week-"+ i);
    }

    //create the content of each tab week-"i"
    for(var week = 0; week <9; ++week){
        $("#week-"+week).append(HeaderRow(week));

        //inserting rows in id=column-"week"
        for(var row = 0; row < 10; ++row){ // 9 row for 9hours shift
           $("#table-"+week).append(CreateRows(row, week));
        }
    }
    HideSpinner();
}

function GetDayString(weeks_after,days_after){
    return moment().day(1+(weeks_after*7)).add(days_after, 'days')._d.getDate()+ "-"+ (moment().day(1+(weeks_after*7)).add(days_after, 'days')._d.getMonth()+1);
}

function GetDayMonthNames(weeks_after,days_after){
    return moment().day(1+(weeks_after*7)).add(days_after, 'days')._d.getDate()+ "-"+ monthNames[(moment().day(1+(weeks_after*7)).add(days_after, 'days')._d.getMonth())];

}

function CreateTab(weekID){
    var str  = '<div id="' + weekID +'" class="tab-pane fade">'+
                '</div>';
    $(".weeks-tabs").append(str)
}


function HeaderRow(week){
    var str ='<table class="table table-striped table-hover ">'+
            '<thead> <tr class="danger"> <th>Time</th> <th id="s1">Monday'+ GetDayString(week,0) +'</th>' +
            '<th id="s2">Tuesday '+ GetDayString(week,1) +'</th>'+
            '<th id="day3">Wednesday '+ GetDayString(week,2) +'</th> ' +
            '<th id="day4">Thursday '+ GetDayString(week,3) +'</th> ' +
            '<th id="day5">Friday '+ GetDayString(week,4) +'</th>'+
            '</tr> </thead> <tbody id="table-'+week+'"></tbody></table>';
    return str;
}

//every single entry in row has an id of "sc-day-month-time" ex/sc23716
//every created row should be appended to table-"week" element ex/#table-3 means table week 4
function CreateRows(time,week){
    var zone = 'pm';
    if(time<3){
        zone = 'am';
    }
    var str =
        '<tr>'+
          '<td>'+ (time+9) +" "+ zone+ '</td>'+
          '<td id="sc-'+GetDayString(week,0)+'-'+ (time+9)+'">'+CreateBookButtom(GetDayString(week,0),time+9)+'</td>'+
          '<td id="sc-'+GetDayString(week,1)+'-'+ (time+9)+'">'+CreateBookButtom(GetDayString(week,1),time+9)+'</td>'+
          '<td id="sc-'+GetDayString(week,2)+'-'+ (time+9)+'">'+CreateBookButtom(GetDayString(week,2),time+9)+'</td>'+
          '<td id="sc-'+GetDayString(week,3)+'-'+ (time+9)+'">'+CreateBookButtom(GetDayString(week,3),time+9)+'</td>'+
          '<td id="sc-'+GetDayString(week,4)+'-'+ (time+9)+'">'+CreateBookButtom(GetDayString(week,4),time+9)+'</td>'+
        '</tr>';
    return str;
}

function CreateBookButtom(date_slot, time){
    if(reservedSlots[date_slot+'-'+time]){
        return '<div class="sch-box-disabled disabled"><p>Booked</p></div>';
    }

    if(method === 'modify'){
        return '<div class="sch-box"  onclick="ModAppointment(\'' + date_slot + '\',\'' + time + '\')"></input>';
    }
    else {
            return '<div class="sch-box"  onclick="CreateAppointment(\'' + date_slot + '\',\'' + time + '\')"></input>';
    }
}

function ModAppointment(date_slot, time){
    var appt_date_time = moment(date_slot + " " + time, "D-M H");
    var data = {
        time_app: appt_date_time.format("HH:mm:ss"),
        date_app: appt_date_time.format("YYYY-MM-DD"),
        serial_number: serial_number,
        appt_id: all_data.other.app_id
    };
    $.when(SendRequestAjax("../services/modifyAppointment.php", "POST", data, CloseSchedule, ShowResultModal)).then(
        GetALLPatientAppointments()
    );
}

function CreateAppointment(date_slot, time) {
    var appt_date_time = moment(date_slot + " " + time, "D-M H");
    var data = {
        time_app: appt_date_time.format("HH:mm:ss"),
        date_app: appt_date_time.format("YYYY-MM-DD"),
        serial_number: serial_number
    };
    SendRequestAjax("../services/createAppointment.php", "POST", data, CloseSchedule, ShowResultModal);
    getAllLicenseSerialNo();
}
