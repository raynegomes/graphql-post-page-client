import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition, Message, Icon } from 'semantic-ui-react';

import { AuthContext } from '~/context/auth';
import PostCard from '~/components/PostCard';
import PostForm from '~/components/PostForm';

import { GET_POSTS_QUERY } from '~/utils/graphql/posts/querys';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(GET_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <Message icon size="small" className="loading-text" color="teal">
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Just one second</Message.Header>
              We are fetching that content for you.
            </Message.Content>
          </Message>
        ) : !data ? (
          <Message
            icon="frown outline"
            size="small"
            color="teal"
            header="Sorry!"
            content="Posts not found!"
            className="box-messages"
          />
        ) : (
          <Transition.Group duration={200}>
            {data.getPosts.length > 0 &&
              data.getPosts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
