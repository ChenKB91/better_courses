var data, popup, popupInfo;
$(document).ready(function(){
    $.getJSON("general.json",function(json){data=json;})
    popup = document.getElementById('infoPopup');
    popupInfo = document.getElementById('infoContent');
    document.getElementById('closeInfo').onclick = function(){popup.style.display="none"}
})

function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}
function get_stuff(){
    var options = objectifyForm($('form').serializeArray())
    console.log(options)

    // Filter courses
    var result = [];
    for(var i=0; i<data.length; i++){
        var course = data[i];
        var queryFlag = true;
        if(options['queryStr'] !== ''){
            if(course[options['searchType']].includes(options['queryStr'])){
                queryFlag = true;
                console.log(course[options['searchType']]);
            }else queryFlag = false;
        }
        if(queryFlag) result.push(i); // TODO: Add timetable filter
    }
    // console.log(result);

    result.forEach(i => console.log(i))
    result.forEach(i => console.log(data[i]))
    $("ul").text('');
    result.forEach(i => addToPage(i))

}
function addToPage(index){
    var course = data[index];
    var courseStr = '<li class="w3-bar">'+
    '<div class="w3-bar-item">'+
    `<span class="w3-large">${course['courseName']}</span><br>`+
    `<span>${[course['teacher'], verbalTime(index)].join('．')}</span>`+
    '</div>'+
    '<span class="w3-bar-item w3-button w3-right w3-xlarge" onclick="alert(\'Not implemented yet QAQ\');">&plus;</span>'+
    `<span class="w3-bar-item w3-button w3-right w3-xlarge" onclick="showInfo(${index});">&#9432;</span>`
    '</li>';
    $("ul").append(courseStr);
}
function verbalTime(index){
    var days = "日一二三四五六";
    var periods = ['0','1','2','3','4','5','6','7','8','9','10','A','B','C','D'];
    var timetable = data[index]['timetable'];
    var prev_day = ''; var day = '';
    var result = '';
    timetable.forEach(function(t){
        day = Math.floor(t/15);
        if(day != prev_day) {result += days[day]; prev_day = day}
        result += periods[t%15];
    })
    return result;
}
function showInfo(index){
    //change content
    var course = data[index]
    $("#infoCourseName").html(course['courseName']); 
    s = `流水號: ${course['waterNum']}<br>`+
    `課程編號: ${course['courseID']}<br>`+
    `學分數: ${course['credit']}<br>`+
    `教師: ${course['teacher']}<br>`+
    `上課時間: ${verbalTime(index)}<br>`+
    `選課限制: ${course['condition']}<br>`+
    `備註: ${course['description']}<br>`+
    `適用通識: A${course['category']}`
    $('#infoContent').html(s);

    //show box
    popup.style.display = 'block';
}
function showHowto(){
    $("#infoCourseName").html('教學');
    s = '• 按 <font style="color:cyan">&#9432;</font> 顯示課程資訊<br>'+
    '• 按 <font style="color:cyan">&plus;</font> 加入課程(Not implemented)<br>'+
    '• 點選左側時間表設定不可用之時段(Not implemented)<br>'+
    '• 這裡現在只能找通識而已Q_Q 不過我有點懶得寫完XD'

    $('#infoContent').html(s);
    popup.style.display = 'block';
}

// For trolling lol
function get_stuff_troll(){
    var options = objectifyForm($('form').serializeArray())
    console.log(options)

    // Filter courses
    var result = [];
    for(var i=0; i<data.length; i++){
        var course = data[i];
        var queryFlag = true;
        if(options['queryStr'] !== ''){
            if(course[options['searchType']].includes(options['queryStr'])){
                queryFlag = true;
                console.log(course[options['searchType']]);
            }else queryFlag = false;
        }
        if(queryFlag) result.push(i); // TODO: Add timetable filter
    }
    // console.log(result);

    result.forEach(i => console.log(i))
    result.forEach(i => console.log(data[i]))
    $("ul").text('');
    result.forEach(i => addToPage_troll(i))

}
function addToPage_troll(index){
    var course = data[index];
    var courseStr = '<li class="w3-bar">'+
    '<div class="w3-bar-item">'+
    `<span class="w3-large">${course['courseName']}</span><br>`+
    `<span>${[course['teacher'], verbalTime(index)].join('．')}</span>`+
    '</div>'+
    '<span class="w3-bar-item w3-button w3-right w3-xlarge" onclick="alert(\'Not implemented yet QAQ\\nPlease just click the info button\');">&plus;</span>'+
    `<span class="w3-bar-item w3-button w3-right w3-xlarge" onclick="window.location.href=\'https://www.youtube.com/watch?v=072tU1tamd0\';">&#9432;</span>`
    '</li>';
    $("ul").append(courseStr);
}