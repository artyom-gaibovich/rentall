import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class BookingConfirmationGuest extends Component {
  static propTypes = {
    content: PropTypes.shape({
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      listCity: PropTypes.string.isRequired,
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

    const linkText = {
      color: '#ff5a5f',
      fontSize: '16px',
      textDecoration: 'none',
      cursor: 'pointer',
    };


    const { content: { guestName, hostName, listTitle, listCity, threadId, logo } } = this.props;
    const contactURL = `${url}/message/${threadId}/guest`;

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
										Пакуйте чемоданы - вы собираетесь {listCity}
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    {hostName} подтвердил ваш запрос на {listTitle}. Пожалуйста, ознакомьтесь с подробностями вашей поездки и
					          {' '}<a style={linkText} href={contactURL}>связаться с хостом</a>{' '} для согласования времени регистрации заезда и обмена ключами.
					        </div>
                  <EmptySpace height={20} />
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

export default BookingConfirmationGuest;
