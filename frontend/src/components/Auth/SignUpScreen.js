/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes, { string } from 'prop-types';

import './SignXScreen.css';

import useInput from '../../widgets/useInput';
import checkEmailFormat from '../../widgets/checkEmailFormat';
import signFormMessages from './utils/signFormMessages';
import signUpFirebaseUser from './utils/signUpFirebaseUser';
import signUpArangoUser from './utils/signUpArangoUser';
import sendEmailVerificationCode from '../../api/dev/sendEmailVerificationCode';
import confirmEmailVerificationCode from '../../api/dev/confirmEmailVerificationCode';

import {
  EMAIL_ALREADY_IN_USE,
  TOO_MANY_REQUESTS,
  WRONG_PASSWORD_SIGNUP,
} from './utils/firebaseErrorCodes';

function SignUpScreen(props) {
  const { location } = props;
  const dispatch = useDispatch();

  const reduxUserValue = useSelector((state) => state.read_exchange_user.value);

  const [screenTitle, setScreenTitle] = useState('Sign');
  useEffect(() => {
    if (location.pathname === '/signin') {
      setScreenTitle('Sign in');
    } else {
      setScreenTitle('Sign up');
    }
  }, []);

  const [continueWithEmail, setContinueWithEmail] = useState(false);
  const [showEmailBoxSuggestion, setShowEmailBoxSuggestion] = useState(true);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showVerificationCodeBox, setShowVerificationCodeBox] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formMiddleNoti, setFormMiddleNoti] = useState(null);

  const backEndError = useSelector((state) => state.read_exchange_user.error);

  const [userProfileCreated, setUserProfileCreated] = useState(false);
  const [emailVerificationCodeSent, setEmailVerificationCodeSent] = useState(false);

  useEffect(() => {
    const { user_profile_created, sent_verification_code } = reduxUserValue;
    setUserProfileCreated(user_profile_created);
    setEmailVerificationCodeSent(sent_verification_code);
  }, [reduxUserValue]);

  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();
  const [verificationCode, setVerificationCode] = useInput(null);

  const [focusPasswordBox, setFocusPasswordBox] = useState(false);
  const [focusVerificationCodeBox, setFocusVerificationCodeBox] = useState(false);

  useEffect(() => {
    if (userProfileCreated === true) {
      dispatch(sendEmailVerificationCode());
    }
  }, [userProfileCreated]);

  useEffect(() => {
    if (emailVerificationCodeSent === true) {
      setShowVerificationCodeBox(true);
      setShowPasswordBox(false);
      setFormMiddleNoti('We just sent you an email verification code. Please check your inbox.');
      setFocusVerificationCodeBox(true);
    } else {
      setFormMiddleNoti(null);
      setShowVerificationCodeBox(false);
      setFocusVerificationCodeBox(false);
    }
  }, [emailVerificationCodeSent]);

  useEffect(() => {
    if (showPasswordBox) {
      setShowPasswordBox(false);
      setFocusPasswordBox(false);
    } if (showVerificationCodeBox) {
      setShowVerificationCodeBox(false);
      setFocusVerificationCodeBox(false);
    } if (formMiddleNoti) {
      setFormMiddleNoti(null);
    } if (verificationCode) {
      setVerificationCode(null);
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

  useEffect(() => {
    setFormError(backEndError.message);
  }, [backEndError.message]);

  const handleContinueWithEmail = () => {
    setContinueWithEmail(true);
  };

  useEffect(() => {
    if (continueWithEmail === true) {
      setShowEmailBoxSuggestion(false);
      setShowEmailBox(true);
    }
  }, [continueWithEmail]);

  const handleVerificationCodeConfirmButton = async () => {
    dispatch(confirmEmailVerificationCode(verificationCode));
    return true;
  };

  useEffect(() => {
    if (continueWithEmail) {
      const { email_address, is_signed_in, email_verified } = reduxUserValue;
      if (email_address) {
        setEmail(email_address);
      }
      if (is_signed_in === true && email_verified === false) {
        dispatch(sendEmailVerificationCode());
      }
    }
  }, [continueWithEmail, reduxUserValue]);

  const handleInputConfirmButton = async () => {
    if (emailValid && password) {
      const firebaseUser = await signUpFirebaseUser(email, password);
      if (firebaseUser.code && firebaseUser.message) {
        if (firebaseUser.code === EMAIL_ALREADY_IN_USE.code) {
          setShowEmailBoxSuggestion(true);
          setFormError(EMAIL_ALREADY_IN_USE.message);
        } if (firebaseUser.code === WRONG_PASSWORD_SIGNUP.code) {
          setShowEmailBoxSuggestion(true);
          setFormError(WRONG_PASSWORD_SIGNUP.message);
        } if (firebaseUser.code === TOO_MANY_REQUESTS.code) {
          setShowEmailBoxSuggestion(true);
          setFormError(TOO_MANY_REQUESTS.message);
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
        dispatch(signUpArangoUser());
        return true;
      } if (emailVerified === true) {
        return (
          <Redirect to="/dashboard" />
        );
      }
    }

    if (checkEmailFormat.validFormat(email)) {
      if (checkEmailFormat.isCompanyEmail(email)) {
        setEmailValid(true);
        setShowPasswordBox(true);
        return setFocusPasswordBox(true);
      }
      return setFormError(signFormMessages.error.notCompanyEmail);
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

  const handleKeyDownVerificationBox = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFormError(false);
      setFormMiddleNoti();
      return handleVerificationCodeConfirmButton();
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
          <div className="screen-title">{screenTitle}</div>

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
                        placeholder={email || 'Enter your email address...'}
                        onChange={setEmail}
                        onKeyDown={handleKeyDown}
                        autoFocus={!focusPasswordBox}
                        autoComplete="off"
                      />
                    </div>
                  </label>

                  <div className="form-middle-noti">{formMiddleNoti}</div>

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

                  {showVerificationCodeBox && (
                  <>
                    <label className="form-label" htmlFor="verification-code-input">
                      Verification code
                      <div className="form-input-box">
                        <input
                          id="verification-code-input"
                          type="text"
                          placeholder="Paste verification code"
                          onChange={setVerificationCode}
                          onKeyDown={handleKeyDownVerificationBox}
                          autoFocus={focusVerificationCodeBox}
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
                    onClick={verificationCode
                      ? handleVerificationCodeConfirmButton
                      : handleInputConfirmButton}
                  >
                    {showVerificationCodeBox === false
                      ? email && emailValid
                        ? 'Continue with password'
                        : 'Use this email'
                      : 'Continue with login code'}
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
              <a href="/" rel="noopener noreferrer" className="read-exchange-link">Terms &amp; Conditions</a>
              {' '}
              and
              {' '}
              <a href="/" rel="noopener noreferrer" className="read-exchange-link">Privacy Policy</a>
              .
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

SignUpScreen.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    state: PropTypes.string,
    key: PropTypes.string.isRequired,
  }).isRequired,
};

export default SignUpScreen;
