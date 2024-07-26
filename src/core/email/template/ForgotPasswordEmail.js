import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ForgotPasswordEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  };

  render() {
    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'normal',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: '#ff5a5f',
      backgroundColor: '#ff5a5f',
      color: '#ffffff',
      borderTopWidth: '1px',
    };

    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px',
    };
    const { content: { token, email, name, logo } } = this.props;
    const verificationURL = `${url}/password/verification?token=${token}&email=${email}`;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <Body textStyle={textStyle}>
          <div>
            Приветствую {name},
          </div>
          <EmptySpace height={20} />
          <div>
            Вы получили запрос на сброс пароля.
          </div>
          <EmptySpace height={20} />
          <div>
            Если вы не делали запрос, просто проигнорируйте это сообщение. В противном случае вы можете сбросить пароль по этой ссылке:
          </div>
          <EmptySpace height={40} />
          <div>
            <a style={buttonStyle} href={verificationURL}>Нажмите здесь, чтобы сбросить пароль</a>
          </div>
          <EmptySpace height={30} />
          <div>
            С уважением, <br />
            Команда {sitename}
          </div>
        </Body>
        <Footer />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default ForgotPasswordEmail;
