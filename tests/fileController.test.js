const request = require('supertest');
const app = require('../app');
const File = require('../models/fileModel');
const path = require('path');
const mockFs = require('mock-fs');
const fs = require('fs');
const { catchAsync } = require('../utilities/catchAsync');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const mongoose = require('mongoose');
const { google } = require('googleapis');
const { Console, log } = require('console');
// jest.mock('../models/fileModel');
const KEYFILEPATH = path.join(__dirname, 'creed.json');
const SCOPES = [process.env.SCOPES];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const driveService = google.drive({ version: 'v3', auth });

describe('File Controller', () => {
  jest.mock('googleapis', () => ({
    files: {
      create: jest.fn().mockImplementation(({ media, requestBody }) => {
        // Simulate successful response from Google Drive
        return Promise.resolve({
          data: {
            id: 'mocked-drive-file-id',
            name: requestBody.name,
          },
        });
      }),
    },
  }));

  // Connect to the database before running tests
  beforeAll(async () => {
    let url = process.env.DB_CONNECTION;
    url = url.replace('<password>', process.env.DB_PASSWORD);
    await mongoose.connect(url);
  });

  // Mock the file upload for testing
  beforeEach(() => {
    mockFs({
      '/path/to/uploaded/files': {
        'testfile.pdf': 'mock file content',
      },
    });
  });
  // Restore file system after each test
  afterEach(() => {
    mockFs.restore();
  });

  // Clear the database after each test
  afterEach(async () => {
    await File.deleteMany();
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it('Get all files', async () => {
    const file1 = new File({
      title: 'File 1',
      description: 'Description 1',
      filename: 'File 1',
    });
    const file2 = new File({
      title: 'File 2',
      description: 'Description 2',
      filename: 'File 2',
    });
    await file1.save();
    await file2.save();
    // Make the request to get all files
    const response = await request(app).get('/api/v1/files');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(response.body.data.files.length).toBe(2);
  });

  it('should get a specific file', async () => {
    // Seed the database with a file
    const file = new File({
      title: 'Test File',
      filename: 'File',
      description: 'This is a test file',
      driveId: '12345678', // Replace with a valid driveId from your database
    });
    await file.save();

    // Make a request to get the file by its driveId
    const response = await request(app).get(`/api/v1/files/${file.driveId}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.file.title).toBe('Test File');
    expect(response.body.data.file.description).toBe('This is a test file');
  }, 10000);

  it('should handle file not found', async () => {
    // Make a request with a non-existent driveId
    const response = await request(app).get('/api/v1/files/1222');
    // Assertions
    expect(response.status).toBe(404);

    expect(response.res.statusMessage).toBe('Not Found');
  }, 10000);

  it('should search for files by title', async () => {
    // Seed the database with some files
    const file1 = new File({
      title: 'Test File 1',
      description: 'Description 1',
      filename: 'File',
    });
    const file2 = new File({
      title: 'Another Test File',
      description: 'Description 2',
      filename: 'File',
    });
    await file1.save();
    await file2.save();

    const response = await request(app)
      .get('/api/v1/files/search')
      .query({ title: 'Test' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.files.length).toBe(2); // Expecting 2 files with 'Test' in title
  }, 10000);

  it('should return 400 if no query is provided', async () => {
    const response = await request(app).get('/api/v1/files/search');

    expect(response.status).toBe(400);
    expect(response.res.statusMessage).toBe('Bad Request');
  }, 10000);

  it('should return 400 if no title is provided', async () => {
    const response = await request(app).get('/api/v1/files/search').query({});

    expect(response.status).toBe(400);
    expect(response.res.statusMessage).toBe('Bad Request');
  }, 10000);

  it('should return 404 if no files match the query', async () => {
    const response = await request(app)
      .get('/api/v1/files/search')
      .query({ title: 'Nonexistent' });

    expect(response.status).toBe(404);
    expect(response.res.statusMessage).toBe('Not Found');
  }, 10000);
});
