from bs4 import BeautifulSoup
import json
import re

# Department code from the searching website. Theres a lot of 'em
departments = [
    "0030", "0040", "0050", "1000", "1010", "1011", "1020", "1030", "1040", "1050", "1060", "1070", "1080", "1090", "1210", "1220", "1230", "1240", "1250",
    "1260", "1270", "1290", "1410", "1420", "1440", "1450", "1460", "1470", "2000", "2010", "2020", "2030", "2040", "2050", "2051", "2052", "2060", "2070",
    "2080", "2090", "2210", "2220", "2230", "2231", "2232", "2240", "2241", "2242", "2250", "2260", "2270", "2271", "2272", "2280", "2290", "2410", "2411",
    "2412", "2413", "2414", "2440", "2450", "2460", "2470", "2490", "3000", "3020", "3021", "3022", "3023", "3030", "3050", "3051", "3052", "3100", "3220",
    "3230", "3250", "3300", "3410", "3420", "3430", "4000", "4010", "4020", "4030", "4031", "4040", "4060", "4080", "4081", "4090", "4120", "4200", "4210",
    "4213", "4214", "4220", "4230", "4231", "4232", "4240", "4260", "4280", "4290", "4410", "4420", "4430", "4440", "4450", "4451", "4452", "4453", "4460",
    "4470", "4480", "4490", "4500", "4510", "4520", "4530", "4540", "4550", "4560", "4570", "4580", "4590", "5000", "5010", "5020", "5040", "5050", "5070",
    "5080", "5210", "5211", "5212", "5213", "5215", "5216", "5217", "5218", "5220", "5221", "5223", "5224", "5225", "5226", "5227", "5228", "5240", "5250",
    "5270", "527A", "5280", "5410", "5430", "5440", "5460", "5480", "5490", "5500", "5510", "5520", "6000", "6010", "6020", "6030", "6031", "6032", "6040",
    "6050", "6051", "6052", "6053", "6054", "6060", "6070", "6080", "6090", "6100", "6101", "6102", "6110", "6120", "6130", "6210", "6211", "6212", "6220",
    "6230", "6234", "6235", "6236", "6237", "6238", "6250", "6260", "6270", "6280", "6281", "6282", "6283", "6290", "6300", "6310", "6320", "6330", "6410",
    "6420", "6430", "6440", "6450", "7000", "7010", "7011", "7012", "7013", "7020", "7030", "7040", "7050", "7060", "7220", "7230", "7240", "7250", "7400",
    "7410", "7420", "7430", "7440", "7450", "7460", "7470", "7480", "7490", "7500", "7510", "8000", "8010", "8410", "8420", "8430", "8440", "8450", "8470",
    "8480", "8481", "8482", "8490", "8491", "8492", "8493", "8500", "8510", "8520", "8530", "8540", "9000", "9010", "9020", "9210", "9220", "9410", "9420",
    "9430", "9440", "9450", "9460", "9470", "A000", "A010", "A011", "A012", "A013", "A210", "A408", "A410", "B000", "B010", "B020", "B210", "B220", "B420",
    "B430", "B440", "B450", "B460", "B470", "B471", "B472", "B473", "B474", "B480", "B490", "G010", "H000", "H010", "H020", "H410", "H420", "H430", "H440",
    "J000", "J100", "J110", "K000", "K010", "K020", "K030", "Q010", "Q020", "V410", "Z010"]

zh2num = {'日':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6}
class2num = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':11,'B':12,'C':13,'D':14}

main_dict = {}

for dpt in departments:

    soup = BeautifulSoup(open(f"dept_html/{dpt}.html", encoding="UTF-8"),features="html.parser")
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
    # col = rows[1].find_all('td')
    # for i in range(len(col)):
    #     print(f'{i} {col[i].text}')

    courses = []
    for row in rows[1:]:
        columns = row.find_all('td')
        # print(columns)
        tmp = {}
        # 種類
        tmp["type"] = columns[1].text+columns[9].text
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
            tmp["teacher"] = columns[10].a.text
        except AttributeError:
            tmp["teacher"] = '不知教師'
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
        tmp["description"] = columns[14].text
        
        # print(tmp)
        courses.append(tmp)

    # print(courses)
    print(f"Parsed Department {dpt}, {course_count} courses")

    main_dict[dpt] = courses

print("=> Writing department courses to json...")
with open('data/department.json', 'w') as f:
    f.write(json.dumps(main_dict))