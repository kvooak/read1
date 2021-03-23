/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect, useState } from 'react';

import './SignXScreen.css';

import useInput from '../../widgets/useInput';
import checkEmailFormat from '../../widgets/checkEmailFormat';
import signFormMessages from './utils/signFormMessages';
import signUpFirebaseUser from './utils/signUpFirebaseUser';
import {
  EMAIL_ALREADY_IN_USE,
} from './utils/firebaseErrorCodes';

function SignUpScreen() {
  const [showEmailBoxSuggestion, setShowEmailBoxSuggestion] = useState(true);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [formError, setFormError] = useState(null);

  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();

  const [focusPasswordBox, setFocusPasswordBox] = useState(false);

  useEffect(() => {
    if (showPasswordBox) {
      setShowPasswordBox(false);
    }
    setFormError(false);
    return setEmailValid(false);
  }, [email]);

  useEffect(() => {
    if (showPasswordBox) {
      setFormError(false);
      setShowEmailBoxSuggestion(false);
    }
  }, [password]);

  const handleContinueWithEmail = () => {
    setShowEmailBoxSuggestion(false);
    setShowEmailBox(true);
  };

  const handleInputConfirmButton = async () => {
    if (emailValid && password) {
      const firebaseUser = await signUpFirebaseUser(email, password);
      if (firebaseUser.code && firebaseUser.message) {
        if (firebaseUser.code === EMAIL_ALREADY_IN_USE) {
          setShowEmailBoxSuggestion(true);
          setFormError('This email has already been used');
        } else {
          setFormError(firebaseUser.message);
        }
        return false;
      }

      const {
        additionalUserInfo,
        user,
      } = firebaseUser;

      const { isNewUser } = additionalUserInfo;
      const { emailVerified } = user;

      if (isNewUser === true && emailVerified === false) {
        console.log('user needs email confirmation');
      }
    }

    if (checkEmailFormat.validFormat(email)) {
      if (checkEmailFormat.isReadExchangeEmail(email)) {
        setEmailValid(true);
        setShowPasswordBox(true);
        return setFocusPasswordBox(true);
      }
      return setFormError(signFormMessages.error.notReadExchangeEmail);
    }
    return setFormError(signFormMessages.error.invalidEmailFormat);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFormError(false);
      return handleInputConfirmButton();
    }

    return false;
  };

  const handleResetPassword = () => {
    console.log();
    return null;
  };

  return (
    <section>
      <div className="wrapper">
        <div className="inner-wrapper">
          <div className="screen-title">Sign up</div>

          <div className="sign-x-box">
            <div className="use-google-account-button" role="button" tabIndex="0">

              <svg viewBox="0 0 15 15" className="google-logo">
                <path d="M 7.28571 6.4125L 7.28571 9L 11.3929 9C 11.2143 10.0875 10.1429 12.225 7.28571 12.225C 4.78571 12.225 2.78571 10.0875 2.78571 7.5C 2.78571 4.9125 4.82143 2.775 7.28571 2.775C 8.71429 2.775 9.64286 3.4125 10.1786 3.9375L 12.1429 1.9875C 10.8929 0.75 9.25 0 7.28571 0C 3.25 0 0 3.3375 0 7.5C 0 11.6625 3.25 15 7.28571 15C 11.5 15 14.25 11.9625 14.25 7.6875C 14.25 7.2 14.2143 6.825 14.1429 6.45L 7.28571 6.45L 7.28571 6.4125Z" />
              </svg>

              Continue with Google
            </div>

            <div className="sign-x-form">
              {showEmailBox && (
              <>
                <div className="form-upperline-wrapper">
                  <div className="form-upperline" />
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <label className="form-label" htmlFor="email-input">
                    Email
                    <div className="form-input-box">
                      <input
                        id="email-input"
                        type="email"
                        placeholder="Enter your email address..."
                        onChange={setEmail}
                        onKeyDown={handleKeyDown}
                        autoFocus={!focusPasswordBox}
                        autoComplete="off"
                      />
                    </div>
                  </label>

                  {showPasswordBox && (
                  <>
                    <label className="form-label" htmlFor="password-input">
                      Password
                      <div className="form-input-box">
                        <input
                          id="password-input"
                          type="password"
                          placeholder="Enter your password..."
                          onChange={setPassword}
                          onKeyDown={handleKeyDown}
                          autoFocus={focusPasswordBox}
                          autoComplete="off"
                        />
                      </div>
                    </label>
                  </>
                  )}

                  <div
                    role="button"
                    tabIndex={0}
                    className="form-confirm-button"
                    onClick={handleInputConfirmButton}
                  >
                    {email && emailValid
                      ? 'Continue with password'
                      : 'Use this email'}
                  </div>
                </form>
              </>
              )}

              <div className="form-bottom-error">{formError}</div>

              {showEmailBoxSuggestion && (
              <div className="form-bottom-text-box">
                You can also
                {' '}
                {!formError ? (
                  <div
                    role="button"
                    tabIndex={0}
                    className="read-exchange-link"
                    onClick={handleContinueWithEmail}
                  >
                    continue with email
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    className="read-exchange-link"
                    onClick={handleResetPassword}
                  >
                    reset your password
                  </div>
                )}
              </div>
              )}
            </div>

          </div>

          <div className="bottom-disclaimer-box">
            <p className="mb-0">
              By clicking “Continue with Google/Email” above, you acknowledge
              that you have read and understood, and agree to our
              {' '}
              <a href="https://www.read.exchange" rel="noopener noreferrer" className="read-exchange-link">Terms &amp; Conditions</a>
              {' '}
              and
              {' '}
              <a href="https://www.read.exchange" rel="noopener noreferrer" className="read-exchange-link">Privacy Policy</a>
              .
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default SignUpScreen;
