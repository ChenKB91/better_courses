var data;
$(document).ready(function(){
    $.getJSON("general.json",function(json){data=json;})
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
    '<span class="w3-bar-item w3-button w3-right w3-xlarge" onclick="alert(1);">&plus;</span>'+
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