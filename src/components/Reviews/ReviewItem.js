import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { Panel, Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reviews.css';

// Redux
import { connect } from 'react-redux';

// Component
import ResponseItem from './ResponseItem';
import Avatar from '../Avatar';
import Link from '../Link';

// Locale
import messages from '../../locale/messages';

class ReviewItem extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    picture: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profileId: PropTypes.number.isRequired,
    reviewContent: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    response: PropTypes.object,
    otherUserResponse: PropTypes.bool,
    showUserName: PropTypes.bool,
    otherUserName: PropTypes.string,
    otherUserProfileId: PropTypes.number,
    isAdmin: PropTypes.bool,
    siteName: PropTypes.string,
  };

  static defaultProps = {
    response: null,
    showUserName: false,
  };

  render() {
    const { firstName, lastName, profileId, picture, otherUserName, otherUserProfileId, isAdmin } = this.props;
    const { reviewContent, createdAt, response, otherUserResponse, showUserName, siteName } = this.props;
    const date = moment(createdAt).format('MMMM YYYY');
    const { formatMessage } = this.props.intl;

    const isGuestImage = response && response.authorData && response.authorData.picture;
    const isGuestProfileId = response && response.authorData && response.authorData.profileId;
    const showAvatar = showUserName == false ? picture : isGuestImage;
        // let isProfileId = showUserName == false ? profileId : isGuestProfileId;
    let isProfileId;
    if (!showUserName) {
      isProfileId = profileId;
    } else {
      isProfileId = isGuestProfileId;
    }

    return (
      <li>
        <div className={cx(s.displayTable, s.space3)}>
          <div className={s.displayTableRow}>
            <div className={cx(s.displayTableCell, s.LeftBg)}>
              {
                                !isAdmin && <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter, 'reviewsId')} >
                                  <Avatar
                                    source={picture}
                                    height={68}
                                    width={68}
                                    title={firstName}
                                    className={s.profileAvatar}
                                    withLink
                                    linkClassName={s.profileAvatarLink}
                                    profileId={profileId}
                                  />
                                    {
                                        showUserName && <div className={s.name}>
                                          <FormattedMessage {...messages.youLabel} />
                                        </div>
                                    }
                                </div>
                            }
              {
                                isAdmin && <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter, 'reviewsId')} >
                                  <Avatar
                                    source={'../../../adminAvatar.png'}
                                    height={68}
                                    width={68}
                                    title={`${formatMessage(messages.verifiedBy)} ${siteName}`}
                                    className={cx(s.profileAvatar, s.noBackground)}
                                    staticImage
                                  />
                                  <div className={s.name}>
                                    {`${formatMessage(messages.verifiedBy)} ${siteName}`}
                                  </div>
                                </div>
                            }
            </div>
            <div className={cx(s.displayTableCell, s.rightBg, 'dashRightBg')}>
              <div className={s.reviewBody}>
                {
                                    showUserName && <span className={s.textBold}>

                                      <FormattedMessage {...messages.Youhadreviewsfor} />{' '}
                                        {/* You had reviews for {' '} */}
                                      <Link to={`/users/show/${otherUserProfileId}`}>{otherUserName}</Link>:
                                    </span>
                                }

                {

                                    !isAdmin && !showUserName &&
                                    <div className={s.nameBold}>
                                      <Link to={`/users/show/${profileId}`}>{firstName} {lastName}</Link><span>'<FormattedMessage {...messages.sreview} /></span>
                                    </div>
                                }
                <p>
                  {
                                        reviewContent && (reviewContent.trim()).split('\n').map((content, index) => (
                                          <span key={index}>
                                            {content}
                                            <br />
                                          </span>
                                            ))
                                    }
                </p>
                {
                                    response && <ResponseItem
                                      data={response}
                                      otherUserResponse={otherUserResponse}
                                    />
                                }
                <p className={s.reviewMuted}>{date}</p>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

const mapState = state => ({
  siteName: state.siteSettings.data.siteName,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ReviewItem)));
