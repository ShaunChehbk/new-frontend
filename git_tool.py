import os
import time
from datetime import datetime
import subprocess

gitcmd = "git status --untracked-files=all"
result = filter(lambda x: '\t' in x, subprocess.check_output(gitcmd, shell=True).decode("utf-8").split('\n'))
# print(list(result))
files = []
for r in result:
    if ' ' in r:
        files.append(r.split('   ')[1])
    else:
        files.append(r.replace('\t', ''))



# files = [
#     "TODO.md",
# "public/stickies.ico",
# "public/stickies.png",
# "src/Home.css",
# "src/components/PersistLogin.js",
# "src/components/app-bookmark/bookmark.css",
# "src/components/app-bookmark/bookmark.js",
# "src/components/app-projectmgr/Forms.js",
# "src/components/app-projectmgr/data-structure.js",
# "src/components/app-projectmgr/projectmgr.js",
# "src/components/app-projectmgr/styles.css",
# "src/components/app-projectmgr/task-panel.js",
# "src/components/app-projectmgr/taskmgr.js",
# "src/components/app-projectmgr/today.js",
# "src/components/app-projectmgr/workmgr.js",
# "src/components/app-projectmgr/workpanel.js",
# "src/components/playground/2.js",
# "src/components/playground/draw-box.js",
# "src/components/playground/style.css",
# "src/components/playground/styles.css",
# "package-lock.json",
# "package.json",
# "public/index.html",
# "src/Home.js",
# "src/api/api.js",
# "src/components/Navigation.js",
# "src/components/app-bookmark/bookmarklist.js",
# "src/hooks/useAxiosPrivate.js",
# "src/hooks/useRefreshToken.js",
# "src/index.js"
# ]

result = []
def make_dict(**kwargs):
    return kwargs

for f in files:
    ti_m = os.path.getmtime(f)
    tmp = datetime.strptime(time.ctime(ti_m), "%a %b %d %H:%M:%S %Y")
    m_ti = tmp.strftime('%Y/%m/%d %H:%M:%S')
    result.append(make_dict(
        name=f,
        t=m_ti
    ))

def get_time(e):
    return e['t']

result.sort(key=get_time)

for e in result:
    print("{} \t {}".format(e["t"], e["name"]))