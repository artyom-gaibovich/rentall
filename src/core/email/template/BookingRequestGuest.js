import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class BookingRequestGuest extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      confirmationCode: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
    }).isRequired,

  };

  render() {
    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px',
    };

    const btnCenter = {
      textAlign: 'center',
    };

    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: '#ff5a5f',
      backgroundColor: '#ff5a5f',
      color: '#ffffff',
      borderTopWidth: '1px',

    };


    const { content: { guestName, listTitle, hostName, checkIn, threadId, confirmationCode, logo } } = this.props;
    const checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
    const messageURL = `${url}/message/${threadId}/guest`;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <div>
          <Table width="100%" >
            <TBody>
              <TR>
                <TD style={textStyle}>
                  <EmptySpace height={20} />
                  <div>
                    Приветствую {guestName},
                    </div>
                  <EmptySpace height={20} />
                  <div>
                  Ваш запрос на бронирование({confirmationCode}) в {listTitle} начале {checkInDate} отправлен вашему хозяину {hostName}. В течении
                    24 часов Вам поступит ответ.
                    </div>
                  <EmptySpace height={40} />
                  <div style={btnCenter}>
                    <a href={messageURL} style={buttonStyle}>Сообщение {hostName}</a>
                  </div>
                  <EmptySpace height={40} />
                  <div>
                    С уважением, <br />
                    Команда {sitename}
                    </div>
                </TD>
              </TR>
            </TBody>
          </Table>
          <EmptySpace height={40} />
        </div>
        <Footer />
        <EmptySpace height={20} />
      </Layout>
    );
  }

}

export default BookingRequestGuest;
