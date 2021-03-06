import './Login.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { firebaseActions, firebaseMessages } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  facebookLogin: {
    defaultMessage: 'Facebook Login',
    id: 'firebase.login.facebookLogin'
  },
  emailLoginOrSignUp: {
    defaultMessage: 'Email Login / Sign Up',
    id: 'firebase.login.emailLoginOrSignUp'
  },
  emailPasswordRecovery: {
    defaultMessage: 'Email Password Recovery',
    id: 'firebase.login.emailPasswordRecovery'
  },
  emailPlaceholder: {
    defaultMessage: 'your@email.com',
    id: 'firebase.login.emailPlaceholder'
  },
  passwordPlaceholder: {
    defaultMessage: 'password',
    id: 'firebase.login.passwordPlaceholder'
  },
  loginButton: {
    defaultMessage: 'Login',
    id: 'firebase.login.loginButton'
  },
  signUp: {
    defaultMessage: 'Sign Up',
    id: 'firebase.login.signUp'
  },
  passwordForgotten: {
    defaultMessage: 'Forgot your password?',
    id: 'firebase.login.passwordForgotten'
  },
  recoveryEmailSent: {
    defaultMessage: 'Recovery email has been sent.',
    id: 'firebase.login.recoveryEmailSent'
  },
  resetPassword: {
    defaultMessage: 'Reset Password',
    id: 'firebase.login.resetPassword'
  },
  dismiss: {
    defaultMessage: 'Dismiss',
    id: 'firebase.login.dismiss'
  },
  unknownError: {
    defaultMessage: 'An unknown error occurred.',
    id: 'firebase.login.unknownError'
  }
});

class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    login: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onSocialLoginClick = this.onSocialLoginClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSignUpClick = this.onSignUpClick.bind(this);
    this.toggleForgetPassword = this.toggleForgetPassword.bind(this);
    this.onResetPasswordClick = this.onResetPasswordClick.bind(this);
    // Note we deliberately use the component state, because we don't want to
    // preserve this piece of state when the user leaves a page.
    this.state = {
      forgetPasswordIsShown: false,
      recoveryEmailSent: false
    };
  }

  onSocialLoginClick(e) {
    const { provider } = e.currentTarget.dataset;
    const { fields, login } = this.props;
    login(provider, fields.$values());
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { fields, login } = this.props;
    login('password', fields.$values());
  }

  onSignUpClick() {
    const { fields, signUp } = this.props;
    signUp(fields.$values());
  }

  async onResetPasswordClick() {
    const { fields, resetPassword } = this.props;
    const { email } = fields.$values();
    if (!email.trim()) return;
    await resetPassword(email);
    this.setState({
      forgetPasswordIsShown: false,
      recoveryEmailSent: true
    });
  }

  toggleForgetPassword() {
    this.setState(({ forgetPasswordIsShown }) => ({
      forgetPasswordIsShown: !forgetPasswordIsShown
    }));
  }

  render() {
    const { auth: { formDisabled, formError }, fields } = this.props;
    const { forgetPasswordIsShown, recoveryEmailSent } = this.state;
    const { intl } = this.props;
    const emailPlaceholder = intl.formatMessage(messages.emailPlaceholder);
    const passwordPlaceholder = intl.formatMessage(messages.passwordPlaceholder);
    const errorMessage = formError
      ? firebaseMessages[formError.code] || messages.unknownError
      : null;

    return (
      <div className="firebase-login">
        <div className="social-auth-providers">
          <button
            data-provider="facebook"
            disabled={formDisabled}
            onClick={this.onSocialLoginClick}
          >
            <FormattedMessage {...messages.facebookLogin} />
          </button>
        </div>
        <form onSubmit={this.onFormSubmit}>
          <fieldset disabled={formDisabled}>
            {!this.state.forgetPasswordIsShown ?
              <legend><FormattedMessage {...messages.emailLoginOrSignUp} /></legend>
            :
              <legend><FormattedMessage {...messages.emailPasswordRecovery} /></legend>
            }
            <input
              maxLength="100"
              placeholder={emailPlaceholder}
              {...fields.email}
            />
            {!forgetPasswordIsShown &&
              <input
                maxLength="1000"
                placeholder={passwordPlaceholder}
                type="password"
                {...fields.password}
              />
            }
            {!forgetPasswordIsShown ?
              <div className="buttons">
                <button>
                  <FormattedMessage {...messages.loginButton} />
                </button>
                <button onClick={this.onSignUpClick} type="button">
                  <FormattedMessage {...messages.signUp} />
                </button>
                <button
                  onClick={this.toggleForgetPassword}
                  type="button"
                >
                  <FormattedMessage {...messages.passwordForgotten} />
                </button>
                {recoveryEmailSent &&
                  <p>
                    <FormattedMessage {...messages.recoveryEmailSent} />
                  </p>
                }
              </div>
            :
              <div className="buttons">
                <button
                  onClick={this.onResetPasswordClick}
                  type="button"
                ><FormattedMessage {...messages.resetPassword} />
                </button>
                <button
                  onClick={this.toggleForgetPassword}
                  type="button"
                ><FormattedMessage {...messages.dismiss} /></button>
              </div>
            }
          </fieldset>
        </form>
        {errorMessage &&
          <p className="error-message">
            <FormattedMessage {...errorMessage} />
          </p>
        }
      </div>
    );
  }

}

Login = fields(Login, {
  path: 'auth',
  fields: ['email', 'password']
});

Login = injectIntl(Login);

export default connect(state => ({
  auth: state.auth
}), firebaseActions)(Login);
