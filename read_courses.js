var data;
var forbiddenSession = new Array(105).fill(0);
$(document).ready(function(){
    $.getJSON("general.json",function(json){data=json;})

    $(".leftPanel td").click(function(event){
        console.log(event.target.id);
        toggleSession(event.target.id.substring(1));
    })

})
function toggleSession(session){
    if(forbiddenSession[session] == 0){
        $("#C"+session).css('background','red');
        forbiddenSession[session] = 1;
    }else{
        $("#C"+session).css('background','');
        forbiddenSession[session] = 0;
    }
}
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
        // Search with text and type
        if(options['queryStr'] !== ''){
            if(course[options['searchType']].includes(options['queryStr'])){
                queryFlag = true;
                console.log(course[options['searchType']]);
            }else queryFlag = false;
        }
        // Filter forbidden sessions
        if(queryFlag){
            course.timetable.forEach(function(t,i){
                if(forbiddenSession[t] === 1){
                    queryFlag = false;
                }
            })
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