import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

export const LOGIN_ACTION = 'LOGIN';
export const LOGOUT_ACTION = 'LOGOUT';
export const STORAGE_KEY = 'jwtToken';

const initialState = {
  user: null,
};

if (localStorage.getItem(STORAGE_KEY)) {
  const decodeToken = jwtDecode(localStorage.getItem(STORAGE_KEY));

  if (decodeToken.exp * 1000 < Date.now()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    initialState.user = decodeToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case LOGIN_ACTION:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT_ACTION:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = userData => {
    localStorage.setItem(STORAGE_KEY, userData.token);
    dispatch({
      type: LOGIN_ACTION,
      payload: userData,
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({
      type: LOGOUT_ACTION,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
