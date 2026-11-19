const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const buildDir = path.resolve(__dirname, '..', 'build');
const outputPath = path.resolve(__dirname, '..', 'build.zip');

// Проверяем существование папки build
if (!fs.existsSync(buildDir)) {
    console.error('Ошибка: папка build не найдена. Сначала выполните сборку: npm run build:prod');
    process.exit(1);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
    zlib: { level: 9 } // Максимальное сжатие
});

output.on('close', () => {
    const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`✓ Архив создан: ${outputPath}`);
    console.log(`  Размер: ${sizeMB} MB`);
});

archive.on('error', (err) => {
    console.error('Ошибка при создании архива:', err);
    process.exit(1);
});

archive.pipe(output);

// Добавляем все файлы из папки build
archive.directory(buildDir, false);

archive.finalize();

