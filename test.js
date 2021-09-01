
const File = require('./modules/File');

console.log(File.exists('./test.js'));
console.log(File.exists([
    './index.js',
    './modules/File.js',
    './none.xx',
]));

console.log('read:', File.read('./index.js'));
console.log(File.read(['index.js', 'readme.md']));
console.log(File.readJSON('package.json'));