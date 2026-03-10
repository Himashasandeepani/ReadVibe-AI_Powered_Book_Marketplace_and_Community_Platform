import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { createBook, deleteBook, getBookById, listBooks, updateBook } from '../models/bookModel.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', async (_req, res) => {
  try {
    const books = await listBooks();
    return res.json({ books });
  } catch (err) {
    console.error('Failed to fetch books', err);
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get(
  '/:id',
  [param('id').isInt().withMessage('Book id must be an integer')],
  handleValidation,
  async (req, res) => {
    try {
      const book = await getBookById(Number(req.params.id));
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.json({ book });
    } catch (err) {
      console.error('Failed to fetch book', err);
      return res.status(500).json({ error: 'Failed to fetch book' });
    }
  }
);

// @route   POST /api/books
// @desc    Create a new book
// @access  Private/Stock Manager/Admin (auth TBD)
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be integer'),
    body('minStock').optional().isInt({ min: 0 }),
    body('maxStock').optional().isInt({ min: 0 }),
    body('featured').optional().isBoolean(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const book = await createBook({
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        price: req.body.price,
        costPrice: req.body.costPrice,
        stock: req.body.stock ?? 0,
        minStock: req.body.minStock ?? 0,
        maxStock: req.body.maxStock ?? 0,
        status: req.body.status,
        description: req.body.description,
        publisher: req.body.publisher,
        publicationYear: req.body.publicationYear,
        pages: req.body.pages,
        language: req.body.language,
        weight: req.body.weight,
        dimensions: req.body.dimensions,
        image: req.body.image,
        images: req.body.images,
        featured: req.body.featured,
        salesThisMonth: req.body.salesThisMonth,
        totalSales: req.body.totalSales,
      });
      return res.status(201).json({ book });
    } catch (err) {
      console.error('Failed to create book', err);
      return res.status(500).json({ error: 'Failed to create book' });
    }
  }
);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private/Stock Manager/Admin (auth TBD)
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Book id must be an integer'),
    body('price').optional().isNumeric(),
    body('stock').optional().isInt({ min: 0 }),
    body('minStock').optional().isInt({ min: 0 }),
    body('maxStock').optional().isInt({ min: 0 }),
    body('featured').optional().isBoolean(),
  ],
  handleValidation,
  async (req, res) => {
    const id = Number(req.params.id);
    try {
      const existing = await getBookById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const book = await updateBook(id, {
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        price: req.body.price,
        costPrice: req.body.costPrice,
        stock: req.body.stock,
        minStock: req.body.minStock,
        maxStock: req.body.maxStock,
        status: req.body.status,
        description: req.body.description,
        publisher: req.body.publisher,
        publicationYear: req.body.publicationYear,
        pages: req.body.pages,
        language: req.body.language,
        weight: req.body.weight,
        dimensions: req.body.dimensions,
        image: req.body.image,
        images: req.body.images,
        featured: req.body.featured,
        salesThisMonth: req.body.salesThisMonth,
        totalSales: req.body.totalSales,
      });
      return res.json({ book });
    } catch (err) {
      console.error('Failed to update book', err);
      return res.status(500).json({ error: 'Failed to update book' });
    }
  }
);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private/Stock Manager/Admin (auth TBD)
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Book id must be an integer')],
  handleValidation,
  async (req, res) => {
    const id = Number(req.params.id);
    try {
      const existing = await getBookById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Book not found' });
      }

      await deleteBook(id);
      return res.json({ success: true });
    } catch (err) {
      console.error('Failed to delete book', err);
      return res.status(500).json({ error: 'Failed to delete book' });
    }
  }
);

export default router;
