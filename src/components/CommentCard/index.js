import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { parseISO, formatDistance } from 'date-fns';

import Deletebutton from '~/components/DeleteButton';

function CommentCard({
  comment: { id, username, createdAt, body },
  user,
  postId,
}) {
  const timeDistance = formatDistance(parseISO(createdAt), new Date(), {
    addSuffix: true,
  });
  return (
    <Card fluid>
      <Card.Content>
        {user && user.username === username && (
          <Deletebutton commentId={id} postId={postId} />
        )}
        <Image
          floated="left"
          size="mini"
          style={{ borderRadius: 50 }}
          src={`https://api.adorable.io/avatars/100/${username}.png`}
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{timeDistance}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
    </Card>
  );
}
export default CommentCard;
