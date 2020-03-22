import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '~/context/auth';
import { useForm } from '~/utils/hooks';

const REGISTER_USER = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    createUser(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { handleChange, handleSubmit, values } = useForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const createUserCallback = () => addUser({ variables: values });

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit(createUserCallback)}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <div className="page-title">
          <h1>Register</h1>
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
          label="Email"
          type="email"
          placeholder="Insert a email"
          name="email"
          values={values.email}
          error={Object.values(errors).find(({ path }) => {
            return path === 'email';
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
        <Form.Input
          label="Confirm the Password"
          type="password"
          placeholder="Confirm the password"
          name="confirmPassword"
          values={values.confirmPassword}
          error={Object.values(errors).find(({ path }) => {
            return path === 'confirmPassword';
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

export default Register;
