import React from 'react';
import ReactDOM from 'react-dom';
import {
  cleanup,
  render,
  fireEvent,
  wait,
  waitForDomChange,
} from '@testing-library/react';
import ChatsList from './ChatsList';
import { createBrowserHistory } from 'history';

describe('ChatsList', () => {
  afterEach(() => {
    cleanup();
    delete window.location;

    window.location = {
      href: '/',
    };
  });

  it('renders fetched chats data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          chats: [
            {
              id: 1,
              name: 'Foo Bar',
              picture: 'https://localhost:4000/picture.jpg',
              lastMessage: {
                id: 1,
                content: 'Hello',
                createdAt: new Date('1 Jan 2019 GMT'),
              },
            },
          ],
        },
      })
    );

    it('should navigate to the target chat room on chat item click', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: {
            chats: [
              {
                id: 1,
                name: 'Foo Bar',
                picture: 'https://localhost:4000/picture.jpg',
                lastMessage: {
                  id: 1,
                  content: 'Hello',
                  createdAt: new Date('1 Jan 2019 GMT'),
                },
              },
            ],
          },
        })
      );

      const history = createBrowserHistory();

      {
        const { container, getByTestId } = render(
          <ChatsList history={history} />
        );

        await waitForDomChange({ container });

        fireEvent.click(getByTestId('chat'));

        await wait(() => expect(history.location.pathname).toEqual('/chats/1'));
      }
    });
  });
});
