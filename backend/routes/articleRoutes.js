const express = require('express');
const router = express.Router();
const controller = require('../controllers/articleController');

router.get('/', controller.getArticles);
router.post('/', controller.createArticle);
router.get('/scrape', controller.scrapeArticlesController);
router.get('/:id', controller.getArticle);
router.put('/:id', controller.updateArticle);
router.delete('/:id', controller.deleteArticle);

module.exports = router;
