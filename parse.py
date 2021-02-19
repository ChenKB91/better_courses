from bs4 import BeautifulSoup
import json
# regex
import re

zh2num = {'日':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6}
class2num = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':11,'B':12,'C':13,'D':14}

soup = BeautifulSoup(open("general2.html", encoding="UTF-8"),features="html.parser")
table = soup.find_all('table')[7]
# print(table)
rows = table.find_all('tr')

courses = []
for row in rows[1:]:
    columns = row.find_all('td')
    # print(columns)
    tmp = {}
    # 流水號
    tmp["waterNum"] = columns[0].text
    # 課程編號
    tmp["courseID"] = columns[2].text
    # 課程名稱
    try:
        tmp["courseName"]=columns[4].a.text
    except AttributeError:
        tmp["courseName"] = '[沒有名稱]'
    # 學分數
    tmp["credit"] = columns[6].text
    # 教師
    try:
        tmp["teacher"] = columns[9].a.text
    except AttributeError:
        tmp["teacher"] = '無名氏'
    # 時間 地點
    match = re.findall(r"([一二三四五六日][0-9,ABCD]*)\(([^\(\)]*)\)",columns[11].text)
    # print(match)
    timetable = []
    
    for m in match:
        s = m[0]
        day = zh2num[s[0]]
        tmp["location"] = m[1]
        period = [class2num[x] for x in s[1:].split(',')]
        for p in period:
            timetable.append(15*day+p)

    tmp["timetable"] = timetable
    # 限制條件
    tmp["condition"] = columns[13].text
    # 備註
    tmp["description"] = columns[14].text
    # 通識類別
    
    match = re.search("A([1-8]*)\\*?:", columns[14].text)
    if match is not None:
        tmp["category"] = [int(c) for c in match.group(1)]
    else:
        tmp["category"] = []
    print(tmp)
    courses.append(tmp)

# print(courses)
print(len(courses))
# for c in courses:
#     print(f"{c['courseName']},  {c['location']}")
with open('general.json', 'w') as f:
    f.write(json.dumps(courses))
