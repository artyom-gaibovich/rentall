import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class BookingPreApproval extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      guestName: PropTypes.string.isRequired,
      hostName: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      listTitle: PropTypes.number.isRequired,
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

    const linkText = {
      color: '#ff5a5f',
      fontSize: '16px',
      textDecoration: 'none',
      cursor: 'pointer',
    };

    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px',
    };
    const { content: { guestName, hostName, threadId, listTitle, logo } } = this.props;
    const contactURL = `${url}/message/${threadId}/guest`;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <Body textStyle={textStyle}>
          <div>
                        Приветствую {guestName},
                    </div>
          <EmptySpace height={20} />
          <div>
          Ваша запрос предварительно одобрен хозяином.
          Выбранные вами даты свободны. Цена рассчитана верно. Для бронирования, вам нужно <a style={linkText} href={contactURL}>внести</a> оплату. При заселении вы оплачиваете оставшуюся часть. Бронирование возможно только через сайт. Без оплаты бронирование не производим. Для внесения оплаты нажмите кнопку <a style={linkText} href={contactURL}>забронировать</a> на этой странице. После оплаты вам на почту придет подтверждение.
                    </div>
          <EmptySpace height={20} />
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

export default BookingPreApproval;
