import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '~/utils/hooks';

import { GET_POSTS_QUERY } from '~/utils/graphql/posts/querys';
import { CREATE_POST_MUTATION } from '~/utils/graphql/posts/mutations';

export default function PostForm() {
  const [errors, setErrors] = useState({});
  const { handleChange, handleSubmit, values } = useForm({
    body: '',
  });

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_POSTS_QUERY,
      });

      const newPost = {
        ...result.data.createPost,
      };

      proxy.writeQuery({
        query: GET_POSTS_QUERY,
        data: {
          getPosts: [newPost, ...data.getPosts],
        },
      });
      values.body = '';
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const handleCreatePost = () =>
    createPost({
      variables: values,
    });

  return (
    <>
      <Form onSubmit={handleSubmit(handleCreatePost)}>
        <h2>Create a post: </h2>
        <Form.Field>
          <Form.Input
            placeholder="What's on your mind?"
            name="body"
            onChange={handleChange}
            error={Object.values(errors).find(({ path }) => {
              return path === 'body';
            })}
            values={values.body}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value.path}>{value.message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
