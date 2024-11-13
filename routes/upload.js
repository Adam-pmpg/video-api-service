// routes/upload.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 11 * 1024 * 1024 } // Limit 11 MB
});

router.post('/', upload.single('file'), (req, res) => {
    const { chunkIndex, totalChunks } = req.body;
    const file = req.file ? req.file : null;
    const { originalname, size } = file ? file : 'brak nazwy video';

    console.log('originalname: ', originalname);
    console.log('Dane:', req.body);
    console.log("Plik:", file);

    //
    const chunksDir = path.join(__dirname, '../chunks');
    if (!fs.existsSync(chunksDir)) {
        fs.mkdirSync(chunksDir); // Tworzy folder, jeśli nie istnieje
    }

    const chunkPath = path.join(chunksDir, `chunk_${chunkIndex}__${originalname}`);
    // Zapis fragmentu na dysku
    fs.writeFile(chunkPath, file.buffer, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania fragmentu:', err);
            return res.status(500).send('Błąd podczas zapisywania fragmentu.');
        }

        console.log(`Fragment ${chunkIndex} zapisany.`);

        // Sprawdź, czy wszystkie fragmenty zostały przesłane
        if (Number(chunkIndex) + 1 === Number(totalChunks)) {
            console.log("Wszystkie fragmenty zostały przesłane!");
        }

        res.status(200).send(`<h1>Upload fragmentu ${chunkIndex} / ${totalChunks}</h1><p>Plik: ${file.originalname}</p>`);
    });
    //
    // res.send(`<h1>Upload chunk ${chunkIndex} / ${totalChunks}</h1><p>File: ${file ? file.originalname : 'No file'}</p>`);
});

// Obsługuje błędy
router.use((err, req, res, next) => {
    console.error("Błąd: ", err);  // Logowanie błędów
    if (err instanceof multer.MulterError) {
        // Obsługuje specyficzne błędy Multera
        return res.status(500).send(`Błąd Multera: ${err.message}`);
    }
    // Inny błąd serwera
    res.status(500).send("Wystąpił błąd serwera.");
});

module.exports = router;