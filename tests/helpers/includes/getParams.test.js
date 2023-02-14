import '@testing-library/jest-dom'
import getParams from '../../../src/js/helpers/includes/getParams';

const auth = {
  key: 'key',
  v: 1
};

describe('API.getParams', () => {

  describe('Preview', () => {

    test('Allow preview', () => {
      const parts = { collection: 'tags' };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true');
    });

    test('Allow preview', () => {
      const parts = { collection: 'tags' };
      const result = getParams(parts, false, auth);
      expect(result).toBe('key=key&v=1&preview=false');
    });

  });

  describe('Source', () => {

    test('Add source=all on article endpoints', () => {
      const parts = { collection: 'articles', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true&source=all');
    });

    test('Do not add source=all', () => {
      const parts = { collection: 'announcements', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true');
    });

  });

  describe('Type', () => {

    test('Add type=all on event endpoints', () => {
      const parts = { collection: 'events', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true&type=all');
    });

    test('Do not add type=all', () => {
      const parts = { collection: 'announcements', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true');
    });

  });

  describe('Has page', () => {

    test('Add has_page=true on gallery collection endpoints', () => {
      const parts = { collection: 'galleries' };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true&has_page=true');
    });

    test('Add has_page=true on gallery collection endpoints', () => {
      const parts = { collection: 'galleries', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true&has_page=true');
    });

    test('Add has_page=true on gallery subcollection endpoints', () => {
      const parts = { collection: 'tags', id: 123, subcollection: 'galleries' };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true&has_page=true');
    });

    test('Do not add has_page=true', () => {
      const parts = { collection: 'announcements', id: 123 };
      const result = getParams(parts, true, auth);
      expect(result).toBe('key=key&v=1&preview=true');
    });

  });

});
