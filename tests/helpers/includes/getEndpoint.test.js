import '@testing-library/jest-dom'
import getEndpoint from '../../../src/js/helpers/includes/getEndpoint';

describe('API.getEndpoint', () => {

  describe('Collection', () => {

    test('Empty', () => {
      const parts = { collection: '' };
      expect(getEndpoint(parts)).toBe('');
    });

    test('Collection filled out', () => {
      const parts = { collection: 'articles' };
      expect(getEndpoint(parts)).toBe('articles');
    });

  });

  describe('Collection and ID', () => {

    test('Empty', () => {
      const parts = { collection: '', id: '' };
      expect(getEndpoint(parts)).toBe('');
    });

    test('Collection filled out', () => {
      const parts = { collection: 'articles', id: '' };
      expect(getEndpoint(parts)).toBe('articles');
    });

    test('Collection and ID filled out', () => {
      const parts = { collection: 'articles', id: 123 };
      expect(getEndpoint(parts)).toBe('articles/123');
    });

  });

  describe('Collection, ID, and subcollection', () => {

    test('Empty', () => {
      const parts = { collection: '', id: '', subcollection: '' };
      expect(getEndpoint(parts)).toBe('');
    });

    test('Collection filled out', () => {
      const parts = { collection: 'articles', id: '', subcollection: '' };
      expect(getEndpoint(parts)).toBe('articles');
    });

    test('Collection and ID filled out', () => {
      const parts = { collection: 'articles', id: 123, subcollection: '' };
      expect(getEndpoint(parts)).toBe('articles/123');
    });

    test('Collection, ID and subcollection filled out', () => {
      const parts = { collection: 'articles', id: 123, subcollection: 'tags' };
      expect(getEndpoint(parts)).toBe('articles/123/tags');
    });

  });

});
