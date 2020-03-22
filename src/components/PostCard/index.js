import React, { useContext } from 'react';
import { Card, Image, Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { parseISO, formatDistance } from 'date-fns';

import { AuthContext } from '~/context/auth';
import LikeButton from '~/components/LikeButton';
import DeleteButton from '~/components/DeleteButton';
import PopupMessage from '~/components/PopupMessage';

export default function PostCard({
  post: { id, body, username, createdAt, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);
  const timeDistance = formatDistance(parseISO(createdAt), new Date(), {
    addSuffix: true,
  });

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          style={{ borderRadius: 50 }}
          src={`https://api.adorable.io/avatars/100/${username}.png`}
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`posts/${id}`}>
          {timeDistance}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <PopupMessage content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </PopupMessage>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}
