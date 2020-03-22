import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '~/context/auth';
import { useForm } from '~/utils/hooks';

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      token
    }
  }
`;

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  // eslint-disable-next-line no-use-before-define
  const { handleChange, handleSubmit, values } = useForm({
    username: '',
    password: '',
  });

  const loginUserCallback = () => loginUser({ variables: values });

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit(loginUserCallback)}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <div className="page-title">
          <h1>Login</h1>
        </div>
        <Form.Input
          label="Username"
          type="text"
          placeholder="Insert a username"
          name="username"
          values={values.username}
          error={Object.values(errors).find(({ path }) => {
            return path === 'username';
          })}
          onChange={handleChange}
        />
        <Form.Input
          label="Password"
          type="password"
          placeholder="Insert a password"
          name="password"
          values={values.password}
          error={Object.values(errors).find(({ path }) => {
            return path === 'password';
          })}
          onChange={handleChange}
        />

        <Button type="submit" primary>
          Register
        </Button>
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
    </div>
  );
}

export default Login;
