var dataGeneral, popup, popupInfo;
var forbiddenSession = new Array(105).fill(0);
var courseInTable = new Array(105).fill(0);
var addedCourse = {};
$(document).ready(function () {
    // Read json and initialize variable
    $.getJSON("data/general.json", function (json) { dataGeneral = json; })
    $.getJSON("data/department.json", function (json) { dataDpt = json; })
    $.getJSON("data/pe.json", function (json) { dataPe = json; })
    $.getJSON("data/common.json", function (json) { dataCommon = json; })

    popup = document.getElementById('infoPopup');
    popupInfo = document.getElementById('infoContent');
    document.getElementById('closeInfo').onclick = function () { popup.style.display = "none" }
    document.addEventListener("keyup", function (event) { if (event.keyCode === 13) { addMatchCourses(); } })

    $(".leftPanel td").click(function (event) {
        console.log(event.target.id);
        toggleSession(event.target.id.substring(1));
    })

    $(".leftPanel th").click(function (event) {
        console.log(event.target.id);
        toggleDay(event.target.id.substring(1));
    })

})
function showHowto() {
    $("#infoCourseName").html('教學');
    s = '• 按 <font class="textHL">&#9432;</font> 顯示課程資訊，按 <font class="textHL">&plus;</font> 加入課程，' +
        '按 <font class="textHL">&times;</font> 移除課程<br>' +
        '• 點擊左側時間表設定不可用時段，點擊最上方星期欄可一次設定整天<br>' +
        '• 這裡目前只能找通識、系所、體育、共同課程而已QAQ<br>' +
        '• 歡迎任何有意改進此工具的人士fork丟PR，如果喜歡這個小工具的話，也請不吝給我個星星 (ˊ•ω•ˋ)'

    $('#infoContent').html(s);
    popup.style.display = 'block';
}
function showInfo(course) {
    //change content
    title = course.courseName
    if (course.type) { title = title + `\[${course.type}\]` }
    $("#infoCourseName").html(title);
    s = `流水號: ${course.waterNum}<br>` +
        `課程編號: ${course.courseID}<br>` +
        `學分數: ${course.credit}<br>` +
        `教師: ${course.teacher}<br>` +
        `上課時間: ${verbalTime(course)}<br>` +
        `上課地點: ${course.location}<br>` +
        `選課限制: ${course.condition}<br>` +
        `備註: ${course.description}<br>`
    if (course['category']) s = s + `適用通識: A${course.category}`
    $('#infoContent').html(s);

    var btn = $('<button id="ntu" type="button" class="w3-button w3-hover-white">加入台大課程網預選</button>')
    btn.click(function(){addToNTUCourse(course)});
    $('#infoContent').append(btn)
    //show box
    popup.style.display = 'block';
}
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
        $("#C" + session).css('background', 'var(--nord11)');
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
function addAddedCourses() { // Add courses that the user selected
    // Clear the list
    $("ul").text('');
    for (c in addedCourse) {
        addToList(addedCourse[c]);
    }
}
function addMatchCourses() { // Add all courses matching the condition to the list
    var options = objectifyForm($('form').serializeArray())
    // Clear the list
    $("ul").text('');

    // General courses
    dataGeneral.forEach(function (course) {
        if (filterTimeName(course, options)) {
            var f = false;
            course.category.forEach(function (c) {
                if (options['gA' + c]) f = true;
            })
            if (f) addToList(course);
        }
    })

    // Department courses
    if (options.dpt === "all") {
        for (dpt in dataDpt) {
            dataDpt[dpt].forEach(function (course) {
                course['dpt'] = options.dpt;
                if (filterTimeName(course, options)) addToList(course);
            })
        }
    } else if (options.dpt !== "") {
        dataDpt[options.dpt].forEach(function (course) {
            course['dpt'] = options.dpt;
            if (filterTimeName(course, options)) addToList(course);
        })
    }
    // PE courses
    if (options.pe === "all") {
        for (cat in dataPe) {
            dataPe[cat].forEach(function (course) {
                course['dpt'] = 'T010';
                if (filterTimeName(course, options)) addToList(course);
            })
        }
    } else if (options.pe !== "") {
        dataPe[options.pe].forEach(function (course) {
            course['dpt'] = 'T010';
            if (filterTimeName(course, options)) addToList(course);
        })
    }
    // Common courses
    if (options.common === "all") {
        for (cat in dataCommon) {
            dataCommon[cat].forEach(function (course) {
                if (filterTimeName(course, options)) addToList(course);
            })
        }
    } else if (options.common !== "") {
        dataCommon[options.common].forEach(function (course) {
            if (filterTimeName(course, options)) addToList(course);
        })
    }

}

function filterTimeName(course, options) {
    var flag = true;
    // Search with keyword and type
    if (options.queryStr !== '') {
        flag = false
        queryArr = options.queryStr.split(',');
        queryArr.forEach(function (s) {
            if (course[options.searchType].includes(s)) flag = true;
        })
    }
    // Filter out excluded keywords
    if (options.excludeStr !== '') {
        queryArr = options.excludeStr.split(',');
        queryArr.forEach(function (s) {
            if (course[options.searchType].includes(s)) flag = false;
        })
    }

    // Filter red sessions
    if (flag) {
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
    // Add a course to the list at the right
    console.log(addedCourse[course.waterNum])

    // Since JS converts object to string and directly put it in the HTML, we can't just use onclick and tuck it in
    // So we have to prepare the HTML and add the click function with JQuery instead
    var listItem = $('<li class="w3-bar"><div class="w3-bar-item"><span class="w3-large">' + course.courseName +
        '</span><br><span class="inf"></span></div><span class="w3-bar-item w3-button w3-right w3-xlarge btAdd">&plus;</span>' +
        '<span class="w3-bar-item w3-button w3-right w3-xlarge btInf">&#9432;</span></li>');

    listItem.find('span.inf').text([course.type, course.teacher, verbalTime(course)].join('．'))
    
    if (addedCourse[course.waterNum]) {
        listItem.find('span.btAdd').html("&times;")
    } else {
        listItem.find('span.btAdd').html("&plus;")
    }
    listItem.find('span.btAdd').click(function () {
        if (addedCourse[course.waterNum]) {
            // if the course is already added, make the button remove the course, then change it to a add button
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
    if (flag) {
        if (confirm('此課程與以下課程衝突，選擇加入會刪除這些課程：\n' + s + '確認加入？')) {
            conflict.forEach(function (c, i) { removeFromTable(c) })
            course.timetable.forEach(function (t, i) {
                $('#C' + t).text(course.courseName);
                toggleSession(t);
                courseInTable[t] = course.waterNum;
            })
            addedCourse[course.waterNum] = course;
        }
        addMatchCourses() // refresh the course list to correct the button
    } else {
        course.timetable.forEach(function (t, i) {
            $('#C' + t).text(course.courseName);
            toggleSession(t);
            courseInTable[t] = course.waterNum;
        })
        addedCourse[course.waterNum] = course;
    }

}

function removeFromTable(course) {
    if (addedCourse[course.waterNum]) {
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

function addToNTUCourse(course) {
    cid = course.waterNum
    if (course.dpt) {
        did = course.dpt;
    } else {
        did = '0000'
    }
    window.open('https://nol.ntu.edu.tw/nol/coursesearch/myschedule.php?add=' + cid + '&ddd=' + did)
}