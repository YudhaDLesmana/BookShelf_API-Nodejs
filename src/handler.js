const { nanoid } = require('nanoid');
const books = require('./books.js');

const addBookHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage) ? true : false;

  if (!name){
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess){
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku.'
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query; // optional
  let filterBook = books;
  const display = [];

  if (name){
    filterBook = filterBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined){
    filterBook = filterBook.filter((book) => Number(book.reading) === Number(reading));
  }
  if (finished !== undefined){
    filterBook = filterBook.filter((book) => Number(book.finished) === Number(finished));
  }
  for (const book of filterBook){
    display.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    });
  }
  const response = h.response({
    status:'success',
    data: {
      books: display
    }
  });
  return response;
};

const getDetailBookHandler = (request, h) =>{
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined){
    const response = h.response({
      status: 'success',
      data:{ book }
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editBookHandler = (request, h) =>{
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    const before = books[index];
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        before: before,
        after: books[index]
      }
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1){
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

module.exports  = {
  addBookHandler,
  getAllBookHandler,
  getDetailBookHandler,
  editBookHandler,
  deleteBookHandler
};