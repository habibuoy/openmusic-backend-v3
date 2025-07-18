const fs = require('fs');

class LocalStorageService {
  constructor(storageDirectory) {
    this._storageDirectory = storageDirectory;

    if (!fs.existsSync(storageDirectory)) {
      fs.mkdirSync(storageDirectory, {
        recursive: true,
      });
    }
  }

  writeAlbumCoverFile({ readStream, meta, basePathLocation }) {
    const filename = `${Date.now()}_${meta.albumId}_${meta.filename}`;
    const filePath = `${this._storageDirectory}/${filename}`;

    const writeStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      writeStream.on('error', (error) => {
        reject(error);
      });

      readStream.on('error', (error) => {
        writeStream.end();
        writeStream.close();
        reject(error);
      });

      readStream.on('end', () => {
        resolve(`${basePathLocation}/${filename}`);
      });

      readStream.pipe(writeStream);
    });
  }
}

module.exports = { LocalStorageService };
