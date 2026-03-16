import re

filepath = r"f:\CodeGit\kuizu\backend\src\main\java\com\kuizu\backend\config\JPD123Initializer.java"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
for line in lines:
    if '.term(' in line and '.definition(' in line:
        m = re.search(r'\.term\("(.*?)"\)\.definition\("(.*) \((.*)\)"\)\.orderIndex', line)
        if m:
            # We want to format it like: term("Kanji (hiragana) [romaji]")
            new_line = re.sub(
                r'\.term\("(.*?)"\)\.definition\("(.*) \((.*)\)"\)\.orderIndex',
                r'.term("\1 [\3]").definition("\2").orderIndex',
                line
            )
            out_lines.append(new_line)
        else:
            out_lines.append(line)
    else:
        out_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)
print("Done formatting JPD123Initializer")
