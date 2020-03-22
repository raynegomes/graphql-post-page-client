import React, { useState, useContext, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { parseISO, formatDistance } from 'date-fns';
import {
  Grid,
  Image,
  Form,
  Card,
  Icon,
  Label,
  Button,
  Message,
} from 'semantic-ui-react';

import { GET_POST_QUERY } from '~/utils/graphql/posts/querys';
import { CREATE_COMMENT_MUTATION } from '~/utils/graphql/comments/mutations';

import { AuthContext } from '~/context/auth';

import LikeButton from '~/components/LikeButton';
import DeleteButton from '~/components/DeleteButton';
import CommentCard from '~/components/CommentCard';
import PopupMessage from '~/components/PopupMessage';

export default function ViewPost(props) {
  const { postId } = props.match.params;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const deletePostCallback = () => {
    props.history.push('/');
  };

  const { loading, data } = useQuery(GET_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    onError(err) {
      console.log('*** error comment: ', err);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      postId,
      body: comment,
    },
  });

  let postMarkup;

  if (loading) {
    postMarkup = (
      <Message icon size="small" className="loading-text" color="teal">
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Just one second</Message.Header>
          We are fetching that content for you.
        </Message.Content>
      </Message>
    );
  } else if (!data) {
    postMarkup = (
      <Message
        icon="frown outline"
        size="small"
        color="teal"
        header="Sorry!"
        content="Post not found!"
        className="box-messages"
      />
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      likeCount,
      likes,
      commentCount,
      comments,
    } = data.getPost;

    const timedistance = formatDistance(parseISO(createdAt), new Date(), {
      addSuffix: true,
    });

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="large"
              style={{ borderRadius: 50 }}
              bordered
              src={`https://api.adorable.io/avatars/250/${username}.png`}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{timedistance}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />

                <PopupMessage content="Comments on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('comment')}
                  >
                    <Button color="blue" basic>
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </PopupMessage>

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <Card.Header>Post a coment</Card.Header>
                  <Card.Description>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="comment..."
                          name="comment"
                          value={comment}
                          onChange={event => setComment(event.target.value)}
                          ref={commentInputRef}
                        />
                        <button
                          type="submit"
                          disabled={comment.trim() === ''}
                          className="ui button teal"
                          onClick={submitComment}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                    {Object.keys(errors).length > 0 && (
                      <div className="ui error message">
                        <ul className="list">
                          {Object.values(errors).map(value => (
                            <li key={value.path}>{value.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card.Description>
                </Card.Content>
              </Card>
            )}
            {comments.map(commentItem => (
              <CommentCard
                comment={commentItem}
                user={user}
                postId={id}
                key={commentItem.id}
              />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}
