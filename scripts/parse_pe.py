from bs4 import BeautifulSoup
import json
import re
import requests
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

zh2num = {'日':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6}
class2num = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':11,'B':12,'C':13,'D':14}

option = [1,2,4,5,6]
# option = [1]
para_pe = {
	"op": "S",
	"current_sem": config['DEFAULT']['current_sem'],
	"cou_cname": "",
	"tea_cname": "",
	"year_code": "1",
	"alltime": "yes",
	"allproced": "yes",
	"Submit": "%ACd%B8%DF"
}
final = {}
for gym_op in option:
    print(f"Fetching and parsing gymnastics course type {gym_op}")
    para_pe["year_code"] = gym_op

    courses = []
    start = 0
    course_count = 1 # Just a number so it can go in the while loop
    while(start < course_count):
        para_pe['startrec'] = f"{start}"
        r = requests.get("https://nol.ntu.edu.tw/nol/coursesearch/search_for_09_gym.php", params=para_pe)

        start += 15
        soup = BeautifulSoup(r.text,features="html.parser")
        table = soup.find_all('table')
        for i in range(len(table)):
            if "筆課程：" in table[i].text:
                count_index = i
                # print(f"amount in {i}")
            if "流水號" in table[i].text:
                course_table_index = i
                # print(f"course in {i}")
        course_count = int(table[count_index].find_all('font')[0].text)
        course_table = table[course_table_index]
        # print(table)
        rows = course_table.find_all('tr')

        for row in rows[1:]:
            columns = row.find_all('td')
            # print(columns)
            tmp = {}
            tmp['type'] = '體育'
            # 流水號
            tmp["waterNum"] = columns[0].text
            # 課程編號
            tmp["courseID"] = columns[2].text
            # 班次
            if columns[3].text == "\xa0":
                tmp["class"] = ""
            else:
                tmp["class"] = columns[3].text
            # 課程名稱
            try:
                tmp["courseName"]=columns[4].a.text
                link = columns[4].a['href']
                # get the argument "dpt_code=" from the link
                dpt_code = re.findall(r'dpt_code=([\w]+)', link)[0]
                tmp["dpt"] = dpt_code
            except AttributeError:
                tmp["courseName"] = '[沒有名稱]'
            # 學分數
            tmp["credit"] = columns[6].text
            # 課程識別碼
            tmp["courseID2"] = columns[7].text
            # 教師
            try:
                tmp["teacher"] = columns[10].a.text
            except AttributeError:
                tmp["teacher"] = '無名氏'
            # 時間 地點
        
            match = re.findall(r"([一二三四五六日][0-9,ABCD]*)\(([^\(\)]*)\)",columns[12].text)
            # print(match)
            timetable = []
            tmp['location'] = ''
            for m in match:
                s = m[0]
                day = zh2num[s[0]]
                tmp["location"] += f'{s[0]}:{m[1]} '
                period = [class2num[x] for x in s[1:].split(',')]
                for p in period:
                    timetable.append(15*day+p)

            tmp["timetable"] = timetable
            # 限制條件
            tmp["condition"] = columns[14].text
            # 備註
            tmp["description"] = columns[15].text
            
            # print(tmp)
            courses.append(tmp)
    final[f'{gym_op}'] = courses
print("=> Writing gymnastics courses to json...")
with open('data/pe.json', 'w') as f:
    f.write(json.dumps(final))