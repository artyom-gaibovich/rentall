import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Pagination from 'rc-pagination';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!./CustomPagination.css';
import { FormattedMessage } from 'react-intl';

// Locale
import messages from '../../../locale/messages';

class CustomPagination extends Component {

  constructor(props) {
    super(props);
    this.renderShowTotal = this.renderShowTotal.bind(this);
  }

  renderShowTotal(total, range) {
    return (
      <div className={s.resultsCount}><span>{range[0]}</span><span>&nbsp;–&nbsp;</span><span>{range[1]}</span><span>&nbsp;из&nbsp;</span><span className="paginationRtl">{total}</span><span>&nbsp;<FormattedMessage {...messages.rentals} /></span></div>
    );
  }

  render() {
    const { total, defaultCurrenct, defaultPageSize, handleChange, current } = this.props;
    const locale = { prev_page: 'Previous', next_page: 'Next' };

    return (
      <div className={'spaceTop4'}>
        <Pagination
          className="ant-pagination"
          defaultCurrent={defaultCurrenct}
          current={current}
          total={total}
          defaultPageSize={defaultPageSize}
          onChange={handleChange}
          showTotal={(total, range) => this.renderShowTotal(total, range)}
          locale={locale}
        />
      </div>
    );
  }
}

export default withStyles(s)(CustomPagination);
