const fs = require('fs');
const path = require('path');

// Paths
const assetsDir = path.join(__dirname, 'src', 'assets');
const appDir = path.join(__dirname, 'src', 'app');
const outputFile = path.join(__dirname, 'unused-assets.txt');

// File extensions in Angular project to search
const searchExtensions = ['.ts', '.html', '.scss', '.css'];

// Recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Search if file is used inside src/app
function isFileUsed(filePath, projectFiles) {
  const relativePath = path
    .relative(path.join(__dirname, 'src'), filePath)
    .replace(/\\/g, '/');
  const filename = path.basename(filePath);

  return projectFiles.some((projFile) => {
    const content = fs.readFileSync(projFile, 'utf-8');
    return content.includes(relativePath) || content.includes(filename);
  });
}

// Main function
function checkUnusedAssets() {
  console.log('🔎 Scanning assets...');

  const assetFiles = getAllFiles(assetsDir);
  const projectFiles = getAllFiles(appDir).filter((f) =>
    searchExtensions.includes(path.extname(f)),
  );

  const unusedFiles = [];

  assetFiles.forEach((asset) => {
    if (!isFileUsed(asset, projectFiles)) {
      unusedFiles.push(asset.replace(__dirname + path.sep, ''));
    }
  });

  // Write unused list to file
  fs.writeFileSync(outputFile, unusedFiles.join('\n'), 'utf-8');

  console.log(`✅ Scan complete. Found ${unusedFiles.length} unused file(s).`);
  console.log(`📂 Check the report here: ${outputFile}`);
}

checkUnusedAssets();
