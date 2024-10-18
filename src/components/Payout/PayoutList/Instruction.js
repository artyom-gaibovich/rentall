import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Panel,
} from 'react-bootstrap';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmptyList.css';
import bt from '../../../components/commonStyle.css';


// Redirection
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class Instruction extends Component {
    render() {
        // console.log(this.props);
        return (
          <div className={'commonListingBg'}>
          </div>
        );
      }
}
