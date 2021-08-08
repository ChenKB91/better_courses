var dataGeneral, popup, popupInfo;
var forbiddenSession = new Array(105).fill(0);
var courseInTable = new Array(105).fill(0);
var addedCourse = {};
$(document).ready(function () {
    // Read json and initialize variable
    $.getJSON("data/general.json", function (json) { dataGeneral = json; })
    $.getJSON("data/department.json", function (json) { dataDpt = json; })

    popup = document.getElementById('infoPopup');
    popupInfo = document.getElementById('infoContent');
    document.getElementById('closeInfo').onclick = function () { popup.style.display = "none" }
    document.addEventListener("keyup", function (event) { if (event.keyCode === 13) { get_stuff(); } })

    $(".leftPanel td").click(function (event) {
        console.log(event.target.id);
        toggleSession(event.target.id.substring(1));
    })

    $(".leftPanel th").click(function (event) {
        console.log(event.target.id);
        toggleDay(event.target.id.substring(1));
    })

})

function toggleDay(day) {
    var flag = 1;
    for (var i = 0; i < 15; i++) {
        if (forbiddenSession[day * 15 + i] == 0) {
            toggleSession(day * 15 + i);
            flag = 0;
        }
    }
    if (flag) {
        for (var i = 0; i < 15; i++) {
            toggleSession(day * 15 + i);
        }
    }
}
function toggleSession(session) {
    if (forbiddenSession[session] == 0) {
        $("#C" + session).css('background', 'red');
        forbiddenSession[session] = 1;
    } else {
        $("#C" + session).css('background', '');
        forbiddenSession[session] = 0;
    }
}
function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}
function get_stuff() {

    var options = objectifyForm($('form').serializeArray())
    // console.log(options)

    // Clear list
    $("ul").text('');
    addMatchCourses(options)

}

function addMatchCourses(options) {
    // Filter courses according to inputs, sadly I have no idea how to do this properly
    
    // General courses
    dataGeneral.forEach(function(course){
        if(filterTimeName(course, options)){
            var f = false;
            course.category.forEach(function(c){
                if(options['gA'+c]) f = true;
            })
            if(f) addToList(course);
        }
    })

    // Department courses
    if(options.dpt === "all"){
        for(dpt in dataDpt){
            dataDpt[dpt].forEach(function(course){
                if(filterTimeName(course, options)) addToList(course);
            })
        }
    }else if(options.dpt !== ""){
        dataDpt[options.dpt].forEach(function(course){
            if(filterTimeName(course, options)) addToList(course);
        })
    }
    
}

function filterTimeName(course, options){
    var flag = true;
    // Search with text and type
    if (options.queryStr !== '') {
        if (course[options.searchType].includes(options.queryStr)) {
            flag = true;
            console.log(course[options.searchType]);
        } else flag = false;
    }
    if(flag){
        if (options.noConflicting) {
            course.timetable.forEach(function (t, i) {
                if (forbiddenSession[t] === 1) {
                    flag = false;
                }
            })
        }
    }
    return flag;
}

function addToList(course) {
    console.log(addedCourse[course.waterNum])
    // So sad that we have to do this
    // Since JS converts object to string and directly put it in the HTML, we can't just use onclick and tuck it in
    // So we have to prepare the HTML and add the click function with JQuery instead
    var listItem = $('<li class="w3-bar"><div class="w3-bar-item"><span class="w3-large">' + course.courseName + '</span><br><span class="inf"></span></div><span class="w3-bar-item w3-button w3-right w3-xlarge btAdd">&plus;</span><span class="w3-bar-item w3-button w3-right w3-xlarge btInf">&#9432;</span></li>');

    listItem.find('span.inf').text([course['teacher'], verbalTime(course)].join('．'))
    if (addedCourse[course.waterNum]) {
        listItem.find('span.btAdd').html("&times;")
    } else {
        listItem.find('span.btAdd').html("&plus;")
    }
    listItem.find('span.btAdd').click(function () {
        if (addedCourse[course.waterNum]) {
            listItem.find('span.btAdd').html("&plus;")
            removeFromTable(course)
        } else {
            listItem.find('span.btAdd').html("&times;")
            addToTable(course)
        }
    })
    listItem.find('span.btInf').click(function () { showInfo(course) })

    $("ul").append(listItem);
}

function addToTable(course) {
    var s = ""
    var days = "日一二三四五六";
    var periods = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C', 'D'];
    var flag = false
    var conflict = []
    course.timetable.forEach(function (t, i) {
        if (courseInTable[t]) {
            s = s + days[Math.floor(t / 15)] + periods[t % 15] + ': ' + addedCourse[courseInTable[t]].courseName + '\n'
            flag = true
            conflict.push(addedCourse[courseInTable[t]])
        }
    })
    // TODO: clean up this place
    if(flag){
        if(confirm('此課程與以下課程衝突，選擇加入會刪除這些課程：\n'+s+'確認加入？')){
            conflict.forEach(function(c,i){removeFromTable(c)})
            course.timetable.forEach(function (t, i) {
                $('#C' + t).text(course.courseName);
                toggleSession(t);
                courseInTable[t] = course.waterNum;
            })
            addedCourse[course.waterNum] = course;
        }
        get_stuff() // refresh the course list to correct the button
    }else{
        course.timetable.forEach(function (t, i) {
            $('#C' + t).text(course.courseName);
            toggleSession(t);
            courseInTable[t] = course.waterNum;
        })
        addedCourse[course.waterNum] = course;
    }
    
}

function removeFromTable(course) {
    if(addedCourse[course.waterNum]){
        course.timetable.forEach(function (t, i) {
            $('#C' + t).html("&nbsp;");
            toggleSession(t);
            courseInTable[t] = 0;
        })
        delete (addedCourse[course.waterNum]);
    }
}

function verbalTime(course) {
    var days = "日一二三四五六";
    var periods = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C', 'D'];
    var timetable = course['timetable'];
    var prev_day = ''; var day = '';
    var result = '';
    timetable.forEach(function (t) {
        day = Math.floor(t / 15);
        if (day != prev_day) { result += days[day]; prev_day = day }
        result += periods[t % 15];
    })
    return result;
}
function showInfo(course) {
    //change content
    $("#infoCourseName").html(course['courseName']);
    s = `流水號: ${course['waterNum']}<br>` +
        `課程編號: ${course['courseID']}<br>` +
        `學分數: ${course['credit']}<br>` +
        `教師: ${course['teacher']}<br>` +
        `上課時間: ${verbalTime(course)}<br>` +
        `選課限制: ${course['condition']}<br>` +
        `備註: ${course['description']}<br>` +
        `適用通識: A${course['category']}`
    $('#infoContent').html(s);

    //show box
    popup.style.display = 'block';
}
function showHowto() {
    $("#infoCourseName").html('教學');
    s = '• 按 <font style="color:blue">&#9432;</font> 顯示課程資訊<br>' +
        '• 按 <font style="color:blue">&plus;</font> 加入課程<br>' +
        '• 按 <font style="color:blue">&times;</font> 移除課程<br>' +
        '• 點選左側時間表設定不可用時段，在右方句選「過濾紅底時段課程」可以過濾課程<br>' +
        '• 這裡現在只能找通識、系所課程而已QAQ'

    $('#infoContent').html(s);
    popup.style.display = 'block';
}