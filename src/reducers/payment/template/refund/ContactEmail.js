import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ContactEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      ContactMessage: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      phoneNumber: PropTypes.any.isRequired,
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
    const { content: { ContactMessage, email, name, phoneNumber, logo } } = this.props;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <Body textStyle={textStyle}>
          <div>
                        Приветствую Администратора,
                    </div>
          <EmptySpace height={20} />
          <div>
                        Вы получили сообщение от отдела поддержки клиентов платформы, вот информация.
                    </div>
          <EmptySpace height={20} />
          <div>
                        Имя: {name}<br /><br />
                        Email: {email}<br /><br />
                        Контактный номер: {phoneNumber}<br /><br />
                        Сообщение:
                        {
                            ContactMessage && (ContactMessage.trim()).split('\n').map((item, index) => (
                              <span key={index}>{item}<br /></span>
                                ))
                        }
            <br />
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

export default ContactEmail;
