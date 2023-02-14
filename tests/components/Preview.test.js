/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

import Preview from '../../src/js/components/Preview';

const addThumbnail = (object, field = 'image_thumbnail') => {
  object._embedded = {};
  object._embedded[field] = [{
    alt_text: 'alt text',
    sizes: {
      thumbnail: field + '.jpg'
    }
  }];

  return object;
};

const getProps = (override) => {
  return {
    data: null,
    loading: true,
    ...override,
  }
};

describe('Preview', () => {

  describe('No data', () => {

    test('Form hasn\'t been filled out yet', () => {

      const props = getProps({ loading: false });

      const { container } = render(<Preview {...props} />);

      expect(container.querySelector('div')).not.toBeInTheDocument();

    });

    test('Component shows loading icon when loading=true', () => {

      const props = getProps();

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon loading');

    });

    test('Component shows error icon when data.error=true', () => {

      const props = getProps({
        data: { error: true },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon invalid');

    });

  });

  describe('Collection', () => {

    test('valid collection', () => {

      const props = getProps({
        data: {},
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

    });

  });

  describe('Announcement', () => {

    test('announcement triggers article object render', () => {

      const props = getProps({
        data: addThumbnail({ type: 'announcement' }),
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object announcement has-image');

    });

  });

  describe('Article', () => {

    test('article with thumbnail', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'article',
          headline: 'this is the article headline',
          url: 'this is the article url',
        }),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object article has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'image_thumbnail.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');
      expect(image).toHaveAttribute('class', 'thumbnail');

      expect(link).toHaveAttribute('href', 'this is the article url');
      expect(link).toHaveTextContent('this is the article headline');

    });

    test('article without article', () => {

      const props = getProps({
        data: {
          type: 'article',
          headline: 'this is the article headline',
          url: 'this is the article url',
          _embedded: {
            image_thumbnail: null
          }
        },
        loading: false
      });

      const { container } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object article');

      expect(container.querySelector('img')).not.toBeInTheDocument();

    });

    test('magazine article', () => {

      const props = getProps({
        data: { type: 'magazine_article' },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object magazine_article');

    });

    test('gazette article', () => {

      const props = getProps({
        data: { type: 'gazette_article' },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object gazette_article');

    });

    test('summary', () => {

      const props = getProps({
        data: { type: 'summary' },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object summary');

    });

  });

  describe('Event', () => {

    test('event render', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'event',
          name: 'this is the event name',
          url: 'this is the event url',
        }),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object event has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'image_thumbnail.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');

      expect(link).toHaveAttribute('href', 'this is the event url');
      expect(link).toHaveTextContent('this is the event name');

    });

  });

  describe('Gallery', () => {

    test('gallery triggers article object render', () => {

      const props = getProps({
        data: addThumbnail({ type: 'gallery' }),
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object gallery has-image');

    });

  });

  describe('Issue', () => {

    test('issue render', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'issue',
          publication: 'magazine',
          edition: 'winter',
          year: '2022',
          url: 'this is the issue url',
        }, 'image_cover'),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object issue has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'image_cover.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');

      expect(link).toHaveAttribute('href', 'this is the issue url');
      expect(link).toHaveTextContent('magazine 2022 winter');

    });

  });

  describe('Person', () => {

    test('faculty expert render', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'faculty_expert',
          first_name: 'john',
          last_name: 'smith',
          url: 'this is the issue url',
        }, 'headshot'),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object faculty_expert has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'headshot.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');

      expect(link).toHaveAttribute('href', 'this is the issue url');
      expect(link).toHaveTextContent('john smith');

    });

    test('media rep render', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'media_rep',
          first_name: 'jane',
          last_name: 'doe',
          url: 'this is the issue url',
        }, 'headshot'),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object media_rep has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'headshot.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');

      expect(link).toHaveAttribute('href', 'this is the issue url');
      expect(link).toHaveTextContent('jane doe');

    });

  });

  describe('Promo', () => {

    test('promo render', () => {

      const props = getProps({
        data: addThumbnail({
          type: 'promo',
          url: 'this is the promo url',
        }, 'image_promo'),
        loading: false
      });

      const { getByRole } = render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object promo has-image');

      const image = getByRole('img');
      const link = getByRole('link');

      expect(image).toHaveAttribute('src', 'image_promo.jpg');
      expect(image).toHaveAttribute('alt', 'alt text');

      expect(link).toHaveAttribute('href', 'this is the promo url');
      expect(link).toHaveTextContent('alt text');

    });

  });

  describe('Terms', () => {

    test('channel render', () => {

      const props = getProps({
        data: {
          type: 'channel',
          name: 'channel name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object channel');

      expect(screen.getByTestId('text')).toHaveTextContent('channel name');

    });

    test('department render', () => {

      const props = getProps({
        data: {
          type: 'department',
          name: 'department name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object department');

      expect(screen.getByTestId('text')).toHaveTextContent('department name');

    });

    test('division render', () => {

      const props = getProps({
        data: {
          type: 'division',
          name: 'division name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object division');

      expect(screen.getByTestId('text')).toHaveTextContent('division name');

    });

    test('event category render', () => {

      const props = getProps({
        data: {
          type: 'event_category',
          name: 'event category name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object event_category');

      expect(screen.getByTestId('text')).toHaveTextContent('event category name');

    });

    test('faculty_expert_topic category render', () => {

      const props = getProps({
        data: {
          type: 'faculty_expert_topics',
          name: 'faculty expert topic'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object faculty_expert_topics');

      expect(screen.getByTestId('text')).toHaveTextContent('faculty expert topic');

    });

    test('location render', () => {

      const props = getProps({
        data: {
          type: 'location',
          name: 'location name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object location');

      expect(screen.getByTestId('text')).toHaveTextContent('location name');

    });

    test('tag render', () => {

      const props = getProps({
        data: {
          type: 'tag',
          name: 'tag name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object tag');

      expect(screen.getByTestId('text')).toHaveTextContent('tag name');

    });

    test('topic render', () => {

      const props = getProps({
        data: {
          type: 'topic',
          name: 'topic name'
        },
        loading: false
      });

      render(<Preview {...props} />);

      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
      expect(screen.getByTestId('object')).toHaveAttribute('class', 'object topic');

      expect(screen.getByTestId('text')).toHaveTextContent('topic name');

    });

  });

});
