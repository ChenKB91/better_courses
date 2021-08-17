# better_courses
![image](https://github.com/ChenKB91/better_courses/cat.jpg)

相信各位台大人都有過被課程網糟糕的搜尋系統搞到快瘋掉的經驗，例如篩選特定節次功能結果得到一堆不能上的課程、共同課程的「所有領域」不會搜尋全部領域等，我也是不堪其擾。為了解決這個問題，便趁暑假製作了這個小工具幫助尋找課程。
本工具具有相對較直覺的搜尋選項，對於選課這件事情可能比較實用，網頁上方有基礎的使用教學。

https://chenkb91.github.io/better_courses

## 關於本工具

本工具使用 python + bs4 對台大課程網做一系列~~DOS~~爬蟲，整理課程資料並匯出成json檔供網頁使用，之後預期可能會寫一隻自動程式定期更新課程。雖然不是最簡潔的作法，不過台大沒有公佈有用的API所以也沒辦法 XD

不過話說回來，學校的選課系統爛也不是一天兩天的事了，課程網連jQuery這個2006就有的東西都沒用，甚至從[2014年起就有人也抱怨這件事了](https://aelcenganda.medium.com/%E8%87%B4%E5%8F%B0%E5%A4%A7-%E6%90%9E%E8%BB%8A%E5%BA%AB%E8%AE%93%E5%AD%B8%E7%94%9F%E5%89%B5%E6%A5%AD-%E9%82%84%E4%B8%8D%E5%A6%82%E9%96%8B%E6%94%BE-api-20140930-1d313b427547)，但在校方有任何的舉動之前，大家也只能如此客難的選課了吧。希望未來台大也能如國外一些大學公佈一些有用的API，便於學生利用。

有鑑於本人JS零經驗，code基本上都很醜，因此本工具使用 MIT License，歡迎各位若想要改進這個工具的fork或丟PR >_<