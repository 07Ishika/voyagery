const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');
const { getGridFSBucket } = require('../config/db');

class DocumentRepository extends BaseRepository {
  constructor() {
    super('documents');
  }

  findByUserId(userId) {
    return this.find({ userId }, { sort: { uploadedAt: -1 } });
  }

  findById(documentId) {
    return this.findOne({ _id: new ObjectId(documentId) });
  }

  deleteById(documentId) {
    return this.deleteOne({ _id: new ObjectId(documentId) });
  }

  uploadToGridFS(filename, buffer, metadata) {
    return new Promise((resolve, reject) => {
      const bucket = getGridFSBucket();
      const uploadStream = bucket.openUploadStream(filename, { metadata });
      uploadStream.end(buffer);
      uploadStream.on('finish', () => resolve(uploadStream));
      uploadStream.on('error', reject);
    });
  }

  findGridFSFile(fileId) {
    const bucket = getGridFSBucket();
    return bucket.find({ _id: new ObjectId(fileId) }).toArray();
  }

  openDownloadStream(fileId) {
    return getGridFSBucket().openDownloadStream(new ObjectId(fileId));
  }

  deleteGridFSFile(fileId) {
    return getGridFSBucket().delete(new ObjectId(fileId));
  }
}

module.exports = new DocumentRepository();
