const express = require('express');
const documentController = require('../controllers/documentController');
const { upload } = require('../config/multer');
const { requireAuth, requireSelf } = require('../middleware/auth');

const router = express.Router();

router.post('/documents/upload', requireAuth, requireSelf, upload.single('file'), documentController.upload.bind(documentController));
router.get('/documents/download/:fileId', requireAuth, documentController.download.bind(documentController));
router.get('/documents/:userId', requireAuth, requireSelf, documentController.list.bind(documentController));
router.delete('/documents/:documentId', requireAuth, documentController.remove.bind(documentController));

module.exports = router;
