const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'image', 'a');
const outputPath = path.join(__dirname, 'image-list.js');

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.PNG', '.JPG', '.JPEG', '.GIF'];

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        return console.error('Error reading images directory:', err);
    }

    const imageFiles = files.filter(file => {
        return imageExtensions.includes(path.extname(file)) && !file.startsWith('001.');
    }).sort();

    const imagePaths = imageFiles.map(file => `'assets/image/a/${file}'`);
    const content = `const originalImageFiles = [\n    ${imagePaths.join(',\n    ')}\n];`;

    fs.writeFile(outputPath, content, 'utf8', (err) => {
        if (err) {
            return console.error('Error writing to image-list.js:', err);
        }
        console.log('image-list.js has been updated successfully!');
    });
});
