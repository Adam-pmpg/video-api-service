const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Endpoint do scalania plików wideo
router.get('/', async (req, res) => {
    const chunksDir = path.join(__dirname, '../chunks');
    const outputDir = path.join(__dirname, '../output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Pobierz listę fragmentów, posortowaną po nazwie
    let files = fs.readdirSync(chunksDir)
        .filter(file => file.startsWith('chunk_') && file.endsWith('.mp4'))
        .sort((a, b) => {
            const indexA = parseInt(a.split('_')[1].split('.')[0]);
            const indexB = parseInt(b.split('_')[1].split('.')[0]);
            return indexA - indexB;
        });

    if (files.length === 0) {
        return res.status(400).send('Brak plików do scalenia.');
    }
    console.log('Znalezione pliki do scalania:', files);

    //Parsuję nazwę pliku, bez chunk_0, chunk_1...
    const firstFile = files[0];
    const parsedFileName = firstFile.replace(/^chunk_0__/, '');
    console.log(parsedFileName);

    // Otwórz strumień do zapisu finalnego pliku
    const outputFile = path.join(outputDir, `${parsedFileName}`);
    const writeStream = fs.createWriteStream(outputFile);

    // Łączenie fragmentów
    files.forEach(file => {
        const filePath = path.join(chunksDir, file);
        console.log(`Łączenie pliku: ${filePath}`);

        // Odczytaj każdy fragment jako binarny buffer
        const chunk = fs.readFileSync(filePath);

        // Zapisz fragment do finalnego pliku
        writeStream.write(chunk);
    });

    // Zakończenie zapisu
    writeStream.end(() => {
        console.log('Scalanie plików zakończone.');
    });

});

module.exports = router;