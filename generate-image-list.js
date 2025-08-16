const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'image', 'a');
const scriptPath = path.join(__dirname, 'script.js');

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.PNG', '.JPG', '.JPEG', '.GIF'];

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error('Error reading images directory:', err);
        return;
    }

    const imageFiles = files.filter(file => {
        return imageExtensions.includes(path.extname(file));
    }).sort(); // Sort to ensure consistent order

    const imagePaths = imageFiles.map(file => `"assets/image/a/${file}"`).join(', ');
    const newImageArrayString = `const originalImageFiles = [${imagePaths}];`;

    fs.readFile(scriptPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading script.js:', err);
            return;
        }

        const updatedContent = data.replace(
            /const originalImageFiles = \[.*?\];/s,
            newImageArrayString
        );

        fs.writeFile(scriptPath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to script.js:', err);
                return;
            }
            console.log('Image list in script.js updated successfully!');
        });
    });
});