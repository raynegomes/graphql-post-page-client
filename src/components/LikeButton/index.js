import React, { useState, useEffect } from 'react';
import { Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { LIKE_POST_MUTATION } from '~/utils/graphql/likes/mutations';

import PopupMessage from '~/components/PopupMessage';

export default function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likePost =
      user && likes.find(like => like.username === user.username);
    setLiked(likePost);
  }, [likes, user]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  const handleLike = () => {
    if (user) {
      likePost();
    }
  };

  return (
    <PopupMessage content={`${liked ? 'Unlike' : 'Like'} post`}>
      <Button as="div" labelPosition="right" onClick={handleLike}>
        {likeButton}
        <Label as="a" basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </PopupMessage>
  );
}
