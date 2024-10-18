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

class NewInquiry extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      receiverName: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
      senderName: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkout: PropTypes.string.isRequired,
      personCapacity: PropTypes.number.isRequired,
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


    const { content: { receiverName, type, senderName, message, threadId, logo } } = this.props;
    const { content: { checkIn, checkOut, personCapacity } } = this.props;
    let messageURL = `${url}/message/${threadId}/guest`;
    if (type === 'host') {
      messageURL = `${url}/message/${threadId}/host`;
    }
    const checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
    const checkOutDate = checkOut != null ? moment(checkOut).format('ddd, Do MMM, YYYY') : '';

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
                    Приветствую {receiverName},
                    </div>
                  <EmptySpace height={20} />
                  <div>
                    У вас есть новый запрос от {senderName}.
                    </div>
                  <EmptySpace height={20} />
                  <div>
                    Начало заезда: {checkInDate}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    До: {checkOutDate}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Гостей: {personCapacity}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Сообщение:
                    </div>
                  <EmptySpace height={10} />
                  <div>
                    {
                      message && (message.trim()).split('\n').map((item, index) => (
                        <span>{item}<br /></span>
                        ))
                    }
                  </div>
                  <EmptySpace height={40} />
                  <div style={btnCenter}>
                    <a href={messageURL} style={buttonStyle}>Respond to {senderName}</a>
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

export default NewInquiry;
