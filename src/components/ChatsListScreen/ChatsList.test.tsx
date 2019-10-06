import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  cleanup,
  render,
  fireEvent,
  wait,
  waitForDomChange,
} from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { mockApolloClient } from '../../test-helpers';
import ChatsList, { getChatsQuery } from './ChatsList';

describe('ChatsList', () => {
  afterEach(() => {
    cleanup();
    delete window.location;

    window.location = {
      href: '/',
    };
  });

  it('renders fetched chats data', async () => {
    const client = mockApolloClient([
      {
        request: { query: getChatsQuery },
        result: {
          data: {
            chats: [
              {
                __typename: 'Chat',
                id: 1,
                name: 'Foo Bar',
                picture: 'https://localhost:4000/picture.jpg',
                lastMessage: {
                  __typename: 'Message',
                  id: 1,
                  content: 'Hello',
                  createdAt: new Date('1 Jan 2019 GMT'),
                },
              },
            ],
          },
        },
      },
    ]);

    const history = createBrowserHistory();

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatsList history={history} />
        </ApolloProvider>
      );
      await waitForDomChange({ container });

      describe('ChatsList', () => {});
    }

    it('should navigate to the target chat room on chat item click', async () => {
      const client = mockApolloClient([
        {
          request: { query: getChatsQuery },
          result: {
            data: {
              chats: [
                {
                  __typename: 'Chat',
                  id: 1,
                  name: 'Foo Bar',
                  picture: 'https://localhost:4000/picture.jpg',
                  lastMessage: {
                    __typename: 'Message',
                    id: 1,
                    content: 'Hello',
                    createdAt: new Date('1 Jan 2019 GMT'),
                  },
                },
              ],
            },
          },
        },
      ]);

      const history = createBrowserHistory();

      {
        const { container, getByTestId } = render(
          <ApolloProvider client={client}>
            <ChatsList history={history} />
          </ApolloProvider>
        );

        await waitForDomChange({ container });

        fireEvent.click(getByTestId('chat'));

        await wait(() => expect(history.location.pathname).toEqual('/chats/1'));
      }
    });
  });
});
