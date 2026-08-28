const documentService = require('../services/documentService');
const { sendError } = require('../utils/sendError');

class DocumentController {
  async upload(req, res) {
    try {
      const result = await documentService.upload(req.file, {
        ...req.body,
        userId: req.user._id.toString()
      });
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to upload document');
    }
  }

  async list(req, res) {
    try {
      const documents = await documentService.listByUser(req.params.userId);
      res.json(documents);
    } catch (err) {
      sendError(res, err, 'Failed to fetch documents');
    }
  }

  async download(req, res) {
    try {
      const { fileInfo, stream } = await documentService.getDownloadInfo(req.params.fileId);
      res.set({
        'Content-Type': fileInfo.metadata.mimetype,
        'Content-Disposition': `attachment; filename="${fileInfo.metadata.originalName}"`,
        'Content-Length': fileInfo.length
      });
      stream.pipe(res);
      stream.on('error', (error) => {
        console.error('Download stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download file' });
        }
      });
    } catch (err) {
      sendError(res, err, 'Failed to download document');
    }
  }

  async remove(req, res) {
    try {
      const result = await documentService.remove(req.params.documentId);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to delete document');
    }
  }
}

module.exports = new DocumentController();
