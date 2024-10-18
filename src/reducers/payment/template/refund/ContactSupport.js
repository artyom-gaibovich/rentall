import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ContactSupport extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      ContactMessage: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
      listId: PropTypes.number.isRequired,
      confirmationCode: PropTypes.number.isRequired,
    }),
  };

  render() {
    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px',
    };
    const textBold = {
      fontWeight: 'bold',
    };
    const { content: { ContactMessage, email, name, confirmationCode, userType, listId, logo } } = this.props;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <Body textStyle={textStyle}>
          <div>
                        Приветствую Администратор,
                    </div>
          <EmptySpace height={20} />
          <div>
            {userType} хотел связаться с вами для поддержки, относительно бронирования #{confirmationCode} по идентификатору номера {listId}.
                    </div>
          <EmptySpace height={20} />
          <div>
            <span style={textBold}>Контактное лицо:</span> {name}<br />
            <span style={textBold}>Email адрес:</span> {email}<br />
            <span style={textBold}>Сообщение:</span>
            {
                            ContactMessage && (ContactMessage.trim()).split('\n').map((item, index) => (
                              <span>{item}<br /></span>
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

export default ContactSupport;
