const request = require('supertest');
const app = require('../app');
const File = require('../models/fileModel');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { log } = require('console');

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

describe('File Controller - Get All Files', () => {
  beforeAll(async () => {
    let url = process.env.DB_CONNECTION;
    url = url.replace('<password>', process.env.DB_PASSWORD);
    await mongoose.connect(url);
  });

  beforeEach(async () => {
    await File.deleteMany();
  });
  // Clear the database after each test
  afterEach(async () => {
    await File.deleteMany();
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it('should get all files', async () => {
    // Seed the database with some files
    const file1 = new File({
      filename: 'file1.pdf',
      title: 'File 1',
      description: 'Description 1',
    });
    const file2 = new File({
      filename: 'fil2.pdf',
      title: 'File 2',
      description: 'Description 2',
    });
    await file1.save();
    await file2.save();

    const response = await request(app).get('/api/v1/files');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(response.body.data.files.length).toBe(2);
  });

  it('should filter files based on query parameters', async () => {
    const file1 = new File({
      filename: 'file1.pdf',
      title: 'File 1',
      description: 'Description 1',
    });
    const file2 = new File({
      filename: 'file2.pdf',
      title: 'File 2',
      description: 'Description 2',
    });
    await file1.save();
    await file2.save();

    const response = await request(app)
      .get('/api/v1/files')
      .query({ title: 'File 1' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
    expect(response.body.data.files.length).toBe(1);
  });

  it('should sort files based on query parameters', async () => {
    const file1 = new File({
      filename: 'file1.pdf',
      title: 'File 1',
      description: 'Description 1',
    });
    const file2 = new File({
      filename: 'file2.pdf',
      title: 'File 2',
      description: 'Description 2',
    });
    await file1.save();
    await file2.save();

    const response = await request(app)
      .get('/api/v1/files')
      .query({ sort: '-title' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(response.body.data.files[0].title).toBe('File 2');
  });

  it('should limit fields based on query parameters', async () => {
    const file1 = new File({
      filename: 'file1.pdf',
      title: 'File 1',
      description: 'Description 1',
    });
    const file2 = new File({
      filename: 'file2.pdf',
      title: 'File 2',
      description: 'Description 2',
    });
    await file1.save();
    await file2.save();

    const response = await request(app)
      .get('/api/v1/files')
      .query({ fields: 'title' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(response.body.data.files[0].title).toBeDefined();
    expect(response.body.data.files[0].description).toBeUndefined();
  });

  it('should paginate results based on query parameters', async () => {
    const files = [];
    for (let i = 1; i <= 10; i++) {
      files.push({
        filename: `file${i}.pdf`,
        title: `File ${i}`,
        description: `Description ${i}`,
      });
    }
    await File.insertMany(files);

    const response = await request(app)
      .get('/api/v1/files')
      .query({ page: 2, limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(5);
    expect(response.body.data.files[0].title).toBe('File 4');
  });

  it('should get a file by its driveId', async () => {
    const file = new File({
      filename: 'file1.txt',
      title: 'File 1',
      description: 'Description 1',
      driveId: '12345',
    });
    await file.save();

    const response = await request(app).get('/api/v1/files/12345');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.file.driveId).toBe('12345');
  });
});

describe('File Controller - Search File', () => {
  beforeAll(async () => {
    let url = process.env.DB_CONNECTION;
    url = url.replace('<password>', process.env.DB_PASSWORD);
    await mongoose.connect(url);
  });

  beforeEach(async () => {
    // Clear the database before each test
    await File.deleteMany();
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  });

  it('should search for files by title', async () => {
    // Seed the database with some files
    const file1 = new File({
      title: 'File 1',
      filename: 'File 1',
      description: 'File_1.pdf',
    });
    const file2 = new File({
      title: 'File 2',
      filename: 'File 2',
      description: 'File_2.pdf',
    });
    await file1.save();
    await file2.save();

    const response = await request(app)
      .get('/api/v1/files/search')
      .query({ title: 'File' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.files.length).toBe(2);
  });
});
