const documentRepository = require('../repositories/documentRepository');
const { AppError } = require('../utils/AppError');

class DocumentService {
  async upload(file, { userId, documentType, country, description }) {
    if (!file) throw new AppError('No file uploaded', 400);
    if (!userId) throw new AppError('User ID is required', 400);

    const filename = `${userId}_${documentType}_${Date.now()}_${file.originalname}`;
    const uploadStream = await documentRepository.uploadToGridFS(filename, file.buffer, {
      userId,
      documentType,
      country,
      originalName: file.originalname,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    });

    const documentData = {
      userId,
      fileId: uploadStream.id,
      filename,
      originalName: file.originalname,
      documentType,
      country,
      description: description || '',
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      status: 'pending'
    };

    const result = await documentRepository.insertOne(documentData);
    return {
      success: true,
      documentId: result.insertedId,
      fileId: uploadStream.id,
      filename
    };
  }

  listByUser(userId) {
    return documentRepository.findByUserId(userId);
  }

  async getDownloadInfo(fileId) {
    const files = await documentRepository.findGridFSFile(fileId);
    if (!files || files.length === 0) throw new AppError('File not found', 404);
    return {
      fileInfo: files[0],
      stream: documentRepository.openDownloadStream(fileId)
    };
  }

  async remove(documentId) {
    const document = await documentRepository.findById(documentId);
    if (!document) throw new AppError('Document not found', 404);

    if (document.fileId) {
      await documentRepository.deleteGridFSFile(document.fileId);
    }
    await documentRepository.deleteById(documentId);
    return { success: true, message: 'Document deleted successfully' };
  }
}

module.exports = new DocumentService();
