const fs = require('fs');
const shell = require('shelljs');

fs.readFile('./src/google-analytics.html', { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    
    // replace comment in index.html with google analytics meta data
    shell.sed('-i', '<!-- Build will add Google-Analytics here -->', data, './src/index.html');
    
    // throw if failed
    var result = shell.grep('UA-123740081-4','./src/index.html');
    if (result && result.toString().indexOf('https://www.googletagmanager.com/gtag/js?id=UA-123740081-4') === -1){
        throw Error('Adding Google Analytics to index.html failed!');
    }
});