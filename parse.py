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
    tmp = []
    # 流水號
    tmp.append(columns[0].text)
    # 課程編號
    tmp.append(columns[2].text)
    # 課程名稱
    try:
        tmp.append(columns[4].a.text)
    except AttributeError:
        tmp.append('[沒有名稱]')
    # 學分數
    tmp.append(columns[6].text)
    # 教師
    try:
        tmp.append(columns[9].a.text)
    except AttributeError:
        tmp.append('[沒有老師]')
    # 時間 地點
    match = re.findall(r"([一二三四五六][0-9,ABCD]*)\(([^\(\)]*)\)",columns[11].text)
    # print(match)
    timetable = []
    for m in match:
        s = m[0]
        day = zh2num[s[0]]
        period = [class2num[x] for x in s[1:].split(',')]
        for p in period:
            timetable.append(7*day+p)

    tmp.append(timetable)

    print(tmp)
    courses.append(tmp)

# print(courses)
print(len(courses))
with open('general.json', 'w') as f:
    f.write(json.dumps(courses))