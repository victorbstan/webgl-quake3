const tga2png = require('tga2png');
const Jimp = require("jimp");
const fs = require('fs');

// Set textures root directory, relative to where the script will be invoked from (project root)
const root = 'games/textures';

function run() {
    readDir(root);
}

function readDir(path) {
    console.log('READIR PATH', path);

    fs.readdirSync(path, { withFileTypes: true })
        .filter(item => {
            let ext = item.name.split('.').pop().toLowerCase();
            return (item.isDirectory() || (ext == 'tga' || ext == 'jpg' || ext == 'jpeg'));
        })
        .forEach(item => {
            if (item.isDirectory()) {
                let newPath = path + '/' + item.name;
                readDir(newPath);
            } else {
                processImg(path, item.name);
            }
        });
}

function processImg(path, fileName) {
    let url = path + '/' + fileName;
    let saveUrl = path + '/' + fileName.replace(/\.[^/.]+$/, '.png');

    // get extension
    let ext = fileName.split('.').pop().toLowerCase();

    console.log('PROCESS IMG', url, saveUrl);

    // return;
    if (ext == 'tga') {
        tga2png(url, saveUrl)
            .then(buf => {
                console.log('Converting TGA:', url, '->', saveUrl);
                // console.log('the png buffer is', buf);
            }, err => {
                console.log('error', err);
            });
    } else if (ext == 'jpg' || ext == 'jpeg') {
        Jimp.read(url)
            .then(image => {
                console.log('Converting JPG:', url, '->', saveUrl);
                image.write(saveUrl);
            })
            .catch(err => {
                console.log('error', err);
            });
    }
};

// EXECUTE
run();

