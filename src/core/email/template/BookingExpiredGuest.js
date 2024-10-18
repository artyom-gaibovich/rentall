import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { sitename } from '../../../config';

class BookingExpiredGuest extends Component {
  static propTypes = {
    content: PropTypes.shape({
      listTitle: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      confirmationCode: PropTypes.number.isRequired,
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


	    const { content: { guestName, listTitle, confirmationCode, checkIn, logo } } = this.props;
	    const checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
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
                  К сожалению вынуждены отклонить вашу заявку на бронирование. Возможно за это время {listTitle} был зарезервирован другими пользователями.
                  Вы можете рассмотреть другие варианты жилья у нас на сайте...
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

export default BookingExpiredGuest;
