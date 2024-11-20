
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AllResults.css';

// Locale
import messages from '../../../locale/messages';

class AllResults extends React.Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <section>
            <h1 className={s.headingText}><span>Вы не выбрали регион</span></h1>
            <div className={s.subHeading}>
              <p>Пожалуйста, укажите регион для поиска</p>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AllResults);
