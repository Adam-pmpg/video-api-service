// clearChunks.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ścieżki do folderów, które mają zostać wyczyszczone
const chunksDir = path.join(__dirname, '../chunks');
const outputDir = path.join(__dirname, '../output');

// Funkcja do usuwania plików w folderze
const clearFolder = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                return reject(`Błąd odczytu folderu ${dir}: ${err}`);
            }

            // Jeśli folder jest pusty, po prostu kończymy
            if (files.length === 0) {
                return resolve(`Folder ${dir} jest już pusty.`);
            }

            // Usuwamy pliki jeden po drugim
            let deletionPromises = files.map(file => {
                const filePath = path.join(dir, file);
                return new Promise((resolve, reject) => {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            reject(`Błąd usuwania pliku ${filePath}: ${err}`);
                        } else {
                            resolve(`Usunięto plik: ${filePath}`);
                        }
                    });
                });
            });

            // Czekamy na zakończenie usuwania wszystkich plików
            Promise.all(deletionPromises)
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    });
};

// Routing dla endpointu /clear-chunk
router.delete('/', (req, res) => {
    // Czyścimy foldery chunks i output
    Promise.all([clearFolder(chunksDir), clearFolder(outputDir)])
        .then(results => {
            res.status(200).send({
                message: 'Foldery zostały wyczyszczone',
                details: results
            });
        })
        .catch(error => {
            res.status(500).send({
                message: 'Wystąpił błąd podczas czyszczenia folderów',
                error: error
            });
        });
});

// Eksportujemy router do użycia w pliku głównym
module.exports = router;
