// import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries.js';
// import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations.js';
import auth from '../utils/auth';

const SavedBooks = () => {
  
const {loading, data, error} = useQuery(GET_ME, {
  skip : !auth.loggedIn(),
});

const [removeBook] = useMutation(REMOVE_BOOK) 

  if (loading) {
    return <h2>Loading....</h2>
  } 

  if (error) {
    return <h2>EHH! Error...{error.message}</h2>
  }

  if (!data || data.me.savedBooks.length === 0) {
    return <h2>You have no saved books.</h2>
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    
    try {
      const {data} = await removeBook({
        variables: {bookId},
        refetchQueries: [{query:GET_ME}],
        
      });
      if (data.removeBook) {
        removeBookId(bookId)
      }
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {data.me.username ? (
            <h1>Viewing {data.me.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${
              data.me.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data.me.savedBooks.map((book:any) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
