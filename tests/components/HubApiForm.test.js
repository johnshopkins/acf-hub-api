/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom'

import HubApiForm from '../../src/js/components/HubApiForm';

jest.useFakeTimers();

const getProps = (override) => {
  return {
    allowPreview: false,
    auth: {
      key: 'key',
      v: 1,
    },
    fields: [],
    ...override,
  }
};

const getCollectionField = ({ name = 'collection', options = [], value = '' } = {}) => {
  return {
    type: 'Select',
    props: {
      id: `${name}-acf-field`,
      label: name,
      name: `acf[field_123}][${name}]`,
      options: options,
      value: value,
    }
  };
};

const getIDField = ({ value = '' } = {}) => {
  return {
    type: 'Number',
    props: {
      id: 'id-acf-field',
      label: 'id',
      name: 'acf[field_123][id]',
      value: value,
    }
  };
};

const getHiddenField = () => {
  return {
    type: 'Hidden',
    props: {
      id: 'valid-acf-field',
      label: 'valid',
      name: 'acf[field_123][valid]',
      value: '',
    }
  };
};

describe('HubApiForm', () => {

  describe('Form rendering', () => {

    test('Form with collection', () => {

      const props = getProps({
        fields: [
          getCollectionField({
            options: ['articles', 'events']
          }),
          getHiddenField(),
        ]
      });

      const { getByLabelText } = render(<HubApiForm {...props} />);

      const collection = getByLabelText('collection');
      expect(collection).toBeInTheDocument();

      const options = collection.querySelectorAll('option');
      expect(options.length).toBe(3);

      expect(options[0]).toHaveValue('');
      expect(options[1]).toHaveValue('articles');
      expect(options[2]).toHaveValue('events');

      expect(options[0]).toHaveTextContent('- collection -');
      expect(options[1]).toHaveTextContent('articles');
      expect(options[2]).toHaveTextContent('events');

      // hidden field
      expect(screen.getByTestId('hidden')).toHaveValue('');

    });

    test('Form with collection and id', () => {

      const props = getProps({
        fields: [
          getCollectionField({ options: ['topics'] }),
          getIDField(),
          getHiddenField(),
        ]
      });

      const { getByLabelText } = render(<HubApiForm {...props} />);

      const collection = getByLabelText('collection');
      expect(collection).toBeInTheDocument();

      const options = collection.querySelectorAll('option');
      expect(options.length).toBe(2);

      expect(options[0]).toHaveValue('');
      expect(options[1]).toHaveValue('topics');

      expect(options[0]).toHaveTextContent('- collection -');
      expect(options[1]).toHaveTextContent('topics');


      const id = getByLabelText('id');
      expect(id).toBeInTheDocument();
      expect(id).not.toHaveValue();


      // hidden field
      expect(screen.getByTestId('hidden')).toHaveValue('');

    });

    test('Form with collection, id and subcollection', () => {

      const props = getProps({
        fields: [
          getCollectionField({ options: ['topics'] }),
          getIDField(),
          getCollectionField({ name: 'subcollection', key: 1, options: ['articles'] }),
          getHiddenField(),
        ]
      });

      const { getByLabelText } = render(<HubApiForm {...props} />);

      const collection = getByLabelText('collection');
      expect(collection).toBeInTheDocument();

      const options = collection.querySelectorAll('option');
      expect(options.length).toBe(2);

      expect(options[0]).toHaveValue('');
      expect(options[1]).toHaveValue('topics');

      expect(options[0]).toHaveTextContent('- collection -');
      expect(options[1]).toHaveTextContent('topics');


      const id = getByLabelText('id');
      expect(id).toBeInTheDocument();
      expect(id).not.toHaveValue();


      const subcollection = getByLabelText('subcollection');
      expect(subcollection).toBeInTheDocument();

      const subOptions = subcollection.querySelectorAll('option');
      expect(subOptions.length).toBe(2);

      expect(subOptions[0]).toHaveValue('');
      expect(subOptions[1]).toHaveValue('articles');

      expect(subOptions[0]).toHaveTextContent('- subcollection -');
      expect(subOptions[1]).toHaveTextContent('articles');


      // hidden field
      expect(screen.getByTestId('hidden')).toHaveValue('');

    });

  });

  describe('Form interaction', () => {

    describe('Form with collection', () => {

      test('Has no value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events']
            }),
            getHiddenField(),
          ]
        });

        const { getByLabelText, getAllByRole } = render(<HubApiForm {...props} />);

        const collection = getByLabelText('collection');

        // wrap code that updates the react state into act(); then assert afterwards:
        // docs: https://reactjs.org/link/wrap-tests-with-act
        act(() => {
          fireEvent.change(collection, { target: { value: 'articles' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct option is selected
        const options = getAllByRole('option');
        expect(options[0].selected).toBe(false); // ''
        expect(options[1].selected).toBe(true);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

      });

      test('Has value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events'],
              value: 'articles',
            }),
            getHiddenField(),
          ]
        });

        const { getAllByRole, getByLabelText } = render(<HubApiForm {...props} />);

        const collection = getByLabelText('collection');

        // correct option is selected
        const options = getAllByRole('option');
        expect(options[0].selected).toBe(false); // ''
        expect(options[1].selected).toBe(true);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');


        // go back to no value
        act(() => {
          fireEvent.change(collection, { target: { value: null } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct option is selected
        expect(options[0].selected).toBe(true); // ''
        expect(options[1].selected).toBe(false);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon invalid');

      });

    });

    describe('Form with collection and ID', () => {

      test('Has no value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events']
            }),
            getIDField(),
            getHiddenField(),
          ]
        });

        const { getByLabelText, getAllByRole } = render(<HubApiForm {...props} />);

        const collection = getByLabelText('collection');
        const id = getByLabelText('id');

        // change collection field
        act(() => {
          fireEvent.change(collection, { target: { value: 'articles' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct option is selected
        const options = getAllByRole('option');
        expect(options[0].selected).toBe(false); // ''
        expect(options[1].selected).toBe(true);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');


        // change id field
        act(() => {
          fireEvent.change(id, { target: { value: '123' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct id value
        expect(id).toHaveValue(123);

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

        // object preview
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
        expect(screen.getByTestId('object')).toHaveAttribute('class', 'object article');
        expect(screen.getByTestId('text')).toHaveTextContent('Article 123');

      });

      test('Has value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events'],
              value: 'articles',
            }),
            getIDField({ value: 123 }),
            getHiddenField(),
          ]
        });

        render(<HubApiForm {...props} />);

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

        // object preview
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
        expect(screen.getByTestId('object')).toHaveAttribute('class', 'object article');
        expect(screen.getByTestId('text')).toHaveTextContent('Article 123');

      });

    });

    describe('Form with collection, ID, and subcollection', () => {

      test('Has no value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events']
            }),
            getIDField(),
            getCollectionField({
              name: 'subcollection',
              options: ['tags', 'topics']
            }),
            getHiddenField(),
          ]
        });

        const { getByLabelText, getAllByRole } = render(<HubApiForm {...props} />);

        const collection = getByLabelText('collection');
        const id = getByLabelText('id');
        const subcollection = getByLabelText('subcollection');

        // change collection field
        act(() => {
          fireEvent.change(collection, { target: { value: 'articles' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct option is selected
        const options = collection.querySelectorAll('option');
        expect(options[0].selected).toBe(false); // ''
        expect(options[1].selected).toBe(true);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');


        // change id field
        act(() => {
          fireEvent.change(id, { target: { value: '123' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct id value
        expect(id).toHaveValue(123);

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

        // object preview
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');
        expect(screen.getByTestId('object')).toHaveAttribute('class', 'object article');
        expect(screen.getByTestId('text')).toHaveTextContent('Article 123');


        // change subcollection field
        act(() => {
          fireEvent.change(subcollection, { target: { value: 'topics' } });
          jest.runAllTimers(); // for _.debounce
        });

        // correct option is selected
        const subcollectionOptions = subcollection.querySelectorAll('option');
        expect(subcollectionOptions[0].selected).toBe(false); // ''
        expect(subcollectionOptions[1].selected).toBe(false);  // 'tags'
        expect(subcollectionOptions[2].selected).toBe(true); // 'topics'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

      });

      test('Has value on load', async () => {

        const props = getProps({
          fields: [
            getCollectionField({
              options: ['articles', 'events'],
              value: 'articles',
            }),
            getIDField({ value: 123 }),
            getCollectionField({
              name: 'subcollection',
              options: ['tags', 'topics'],
              value: 'topics',
            }),
            getHiddenField(),
          ]
        });

        const { getByLabelText, getAllByRole } = render(<HubApiForm {...props} />);

        const collection = getByLabelText('collection');
        const id = getByLabelText('id');
        const subcollection = getByLabelText('subcollection');

        // correct collection option is selected
        const options = collection.querySelectorAll('option');
        expect(options[0].selected).toBe(false); // ''
        expect(options[1].selected).toBe(true);  // 'articles'
        expect(options[2].selected).toBe(false); // 'events'

        // correct id value
        expect(id).toHaveValue(123);

        // correct subcollection option is selected
        const subcollectionOptions = subcollection.querySelectorAll('option');
        expect(subcollectionOptions[0].selected).toBe(false); // ''
        expect(subcollectionOptions[1].selected).toBe(false);  // 'tags'
        expect(subcollectionOptions[2].selected).toBe(true); // 'topics'

        // hidden field
        expect(screen.getByTestId('hidden')).toHaveValue('true');

        // valid endpoint indicator
        expect(screen.getByTestId('icon')).toHaveAttribute('class', 'icon valid');

      });

    });

  });

});
