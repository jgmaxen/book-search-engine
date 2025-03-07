import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($userData: UserInput!) {
    addUser(userData: $userData) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook($bookId: String!, $title: String!, $description: String!, $image: String) {
  saveBook(bookId: $bookId, title: $title, description: $description, image: $image) {
    bookCount
    email
    id
    username
    savedBooks {
      authors
      title
      bookId
      description
      image
    }
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      id
      username
      savedBooks {
        bookId
        authors
        title
      }
    }
  }
`;
