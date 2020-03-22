import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { GET_POSTS_QUERY } from '~/utils/graphql/posts/querys';
import { DELETE_POST_MUTATION } from '~/utils/graphql/posts/mutations';
import { DELETE_COMMENT_MUTATION } from '~/utils/graphql/comments/mutations';

import PopupMessage from '~/components/PopupMessage';

export default function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: GET_POSTS_QUERY,
        });

        const filteredList = data.getPosts.filter(p => p.id !== postId);
        console.log('*** data get posts', filteredList);
        proxy.writeQuery({
          query: GET_POSTS_QUERY,
          data: {
            getPosts: [...filteredList],
          },
        });
      }

      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
    onError(err) {
      console.log('*** delete error: ', err);
    },
  });

  return (
    <>
      <PopupMessage content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </PopupMessage>

      <Confirm
        open={confirmOpen}
        content="Are you sure you want to delete?"
        size="mini"
        confirmButton="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}
