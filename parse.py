from bs4 import BeautifulSoup
soup = BeautifulSoup(open("general.html"))

table = soup.find_all('table')[7]
# print(table)
rows = table.find_all('tr')

courses = []
for row in rows[1:]:
    columns = row.find_all('td')
    # print(columns)
    tmp = []
    tmp.append(columns[0].text)
    tmp.append(columns[2].text)
    try:
        tmp.append(columns[4].a.text)
    except AttributeError:
        tmp.append('爆炸拉')
    tmp.append(columns[6].text)
    try:
        tmp.append(columns[9].a.text)
    except AttributeError:
        tmp.append('爆炸拉')
    print(tmp)
    courses.append(tmp)

# print(courses)
print(len(courses))