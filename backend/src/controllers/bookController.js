import {
  createBook,
  deleteBook,
  getBookById,
  listBooks,
  updateBook,
} from '../models/bookModel.js';

const nullIfEmpty = (value) => (value === '' || value === undefined ? null : value);
const numberOrDefault = (value, fallback = undefined) => {
  if (value === '' || value === undefined || value === null) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};
const intOrDefault = (value, fallback = undefined) => {
  if (value === '' || value === undefined || value === null) return fallback;
  const num = parseInt(value, 10);
  return Number.isFinite(num) ? num : fallback;
};
const boolOrDefault = (value, fallback = undefined) => {
  if (value === '' || value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  return Boolean(value);
};
const normalizeImages = (value) => {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (err) {
      return [];
    }
  }
  return [];
};

const buildCreatePayload = (body) => ({
  isbn: nullIfEmpty(body.isbn),
  title: body.title,
  author: nullIfEmpty(body.author),
  category: nullIfEmpty(body.category),
  price: numberOrDefault(body.price, 0),
  costPrice: numberOrDefault(body.costPrice, null),
  stock: intOrDefault(body.stock, 0),
  minStock: intOrDefault(body.minStock, 0),
  maxStock: intOrDefault(body.maxStock, 0),
  status: nullIfEmpty(body.status),
  description: nullIfEmpty(body.description),
  publisher: nullIfEmpty(body.publisher),
  publicationYear: intOrDefault(body.publicationYear, null),
  pages: intOrDefault(body.pages, null),
  language: nullIfEmpty(body.language),
  weight: nullIfEmpty(body.weight),
  dimensions: nullIfEmpty(body.dimensions),
  image: nullIfEmpty(body.image),
  images: normalizeImages(body.images),
  featured: boolOrDefault(body.featured, false),
  salesThisMonth: intOrDefault(body.salesThisMonth, 0),
  totalSales: intOrDefault(body.totalSales, 0),
});

const buildUpdatePayload = (body) => ({
  isbn: nullIfEmpty(body.isbn),
  title: body.title,
  author: nullIfEmpty(body.author),
  category: nullIfEmpty(body.category),
  price: numberOrDefault(body.price),
  costPrice: numberOrDefault(body.costPrice),
  stock: intOrDefault(body.stock),
  minStock: intOrDefault(body.minStock),
  maxStock: intOrDefault(body.maxStock),
  status: nullIfEmpty(body.status),
  description: nullIfEmpty(body.description),
  publisher: nullIfEmpty(body.publisher),
  publicationYear: intOrDefault(body.publicationYear),
  pages: intOrDefault(body.pages),
  language: nullIfEmpty(body.language),
  weight: nullIfEmpty(body.weight),
  dimensions: nullIfEmpty(body.dimensions),
  image: nullIfEmpty(body.image),
  images: body.images === undefined ? undefined : normalizeImages(body.images),
  featured: boolOrDefault(body.featured),
  salesThisMonth: intOrDefault(body.salesThisMonth),
  totalSales: intOrDefault(body.totalSales),
});

export const getBooks = async (_req, res, next) => {
  try {
    const books = await listBooks();
    res.json({ books });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await getBookById(Number(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const createBookHandler = async (req, res, next) => {
  try {
    const book = await createBook(buildCreatePayload(req.body));
    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
};

export const updateBookHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = await updateBook(id, buildUpdatePayload(req.body));
    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const deleteBookHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await deleteBook(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
