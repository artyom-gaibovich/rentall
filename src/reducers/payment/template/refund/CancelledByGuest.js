import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import CurrencyView from '../modules/CurrencyView';
// Helper
import { getDateUsingTimeZone } from '../../../helpers/dateRange';

class CancelledByGuest extends Component {
  static propTypes = {
    content: PropTypes.shape({
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      confirmationCode: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      payoutToHost: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
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

    const { content: { guestName, hostName, confirmationCode, checkIn, listTitle, payoutToHost, currency, logo, country } } = this.props;
    const checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
    const momentStartDate = moment(checkIn).startOf('day');
    const today = getDateUsingTimeZone(country, false);
    const interval = momentStartDate.diff(today, 'days');
    let isPastDay = false;
    if (interval < 0) {
      isPastDay = true;
    }

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
										Приветствую {hostName},
			        				</div>
                  <EmptySpace height={20} />
                  <div>
                  С сожалением сообщаем вам, что ваш гость {guestName} отменил бронирование
								        {' '}{confirmationCode} at {listTitle} {isPastDay ? 'started' : 'starting'} on {checkInDate}.
								        {
											payoutToHost > 0 && <span> В соответствии с политикой отмены, ваша выплата будет
                        обновлена до <CurrencyView amount={payoutToHost} currency={currency} />.
								        	</span>
										}
                  {
											payoutToHost === 0 && <span> В соответствии с политикой отмены вы не будете
                      получать какие-либо выплаты по этому бронированию.
								        	</span>
										}
                  <EmptySpace height={10} />
                  <p>Ваш календарь также был обновлен, чтобы показать, что ранее забронированные даты теперь доступны.</p>
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

export default CancelledByGuest;
