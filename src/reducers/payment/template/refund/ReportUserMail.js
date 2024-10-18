import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ReportUserMail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      userName: PropTypes.string.isRequired,
      reporterName: PropTypes.string.isRequired,
      reportType: PropTypes.string.isRequired,
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
    const { content: { userName, reporterName, reportType, logo } } = this.props;

    return (
      <Layout>
        <Header color="#FF5A5F" backgroundColor="#F7F7F7" logo={logo} />
        <Body textStyle={textStyle}>
          <div>
                        Приветствую Администратора,
                    </div>
          <EmptySpace height={20} />
          <div>
                        Вы получили уведомление о нарушении прав пользователя.
                    </div>
          <EmptySpace height={20} />
          <div>
            {userName} нарушает условия платформы и сообщается следующее: {reporterName} <br /><br />
            Нарушение: {reportType}
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

export default ReportUserMail;
