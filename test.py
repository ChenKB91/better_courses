from bs4 import BeautifulSoup

soup = BeautifulSoup(open(f"dept_html/1000.html", encoding="UTF-8"),features="html.parser")
table = soup.find_all('table')
for i in range(len(table)):
    print(i)
    print(table[i])
course_count = int(soup.find_all('table')[6].find_all('font')[0].text)
print(course_count)

# per = '0123456789XABCD'
# time = ['7:10-8:00',
# '8:10-9:00','9:10-10:00','10:20-11:10','11:20-12:10','12:20-13:10','13:20-14:10','14:20-15:10','15:30-16:20','16:30-17:20','17:30-18:20','18:25-19:15','19:20-20:10','20:15-21:05','21:10-22:00']
# for i in range(15):
#     print(f'<tr id="P{i}">')
#     print(f'    <td class="time">{i}<br><font style="font-size: smaller;">{time[i]}</font></td>')
#     print('    ',end='')
#     for j in range(7):
#         print(f'<td id="C{j*15+i}">&nbsp;</td>', end='')
#     print('')
#     print('</tr>')