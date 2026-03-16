const fs = require('fs');
const filepath = 'f:\\CodeGit\\kuizu\\backend\\src\\main\\java\\com\\kuizu\\backend\\config\\JPD123Initializer.java';
const data = fs.readFileSync(filepath, 'utf8');
const lines = data.split('\n');

const outLines = lines.map(line => {
    if (line.includes('.term(') && line.includes('.definition(')) {
        const regex = /\.term\("(.*?)"\)\.definition\("(.*)\s+\((.*)\)"\)/;
        const replaceStr = '.term("$1 [$3]").definition("$2")';
        return line.replace(regex, replaceStr);
    }
    return line;
});

fs.writeFileSync(filepath, outLines.join('\n'), 'utf8');
console.log('Done reformatting');
