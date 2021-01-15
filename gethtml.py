import requests
general = requests.get(
    "https://nol.ntu.edu.tw/nol/coursesearch/search_for_03_co.php?current_sem=109-2&classarea=a&coursename=&teachername=&alltime=yes&allproced=yes&page_cnt=200&Submit22=%ACd%B8%DF")
general.encoding = 'big5'
with open("general.html", 'w') as f:
    f.write(general.text)