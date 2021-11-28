import gql from 'graphql-tag';
import client from './client';

const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      from
      text
    }
  }
`;

const addMessageMutation = gql`
  mutation AddMessageMutation($input: MessageInput!) {
    message: addMessage(input: $input) {
      id
      from
      text
    }
  }
`;

const messageAddedSubscription = gql`
  subscription {
    MessageAdded {
      id
      from
      text
    }
  }
`;

export async function addMessage(text) {
  const { data } = await client.mutate({
    mutation: addMessageMutation,
    variables: { input: { text } },
  });
  return data.message;
}

export async function getMessages() {
  const { data } = await client.query({ query: messagesQuery });
  return data.messages;
}

export function onMessageAdded(handleMsg) {
  const observable = client.subscribe({ query: messageAddedSubscription });
  return observable.subscribe(({ data }) => handleMsg(data.MessageAdded));
}
