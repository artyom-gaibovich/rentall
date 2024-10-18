import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Panel } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reviews.css';
import bt from '../../components/commonStyle.css';

// Components
import ReviewItem from './ReviewItem';
import Loader from '../Loader';

// Locale
import messages from '../../locale/messages';

class PastReviews extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      formatMessage: PropTypes.any,
      userReviews: PropTypes.arrayOf(PropTypes.shape({
        reservationId: PropTypes.number.isRequired,
        listId: PropTypes.number.isRequired,
        authorId: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        reviewsCount: PropTypes.number.isRequired,
        authorData: PropTypes.shape({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
          picture: PropTypes.string.isRequired,
          profileId: PropTypes.number.isRequired,
        }),
        reviewContent: PropTypes.string.isRequired,
        parentId: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        response: PropTypes.shape({
          reservationId: PropTypes.number.isRequired,
          listId: PropTypes.number.isRequired,
          authorId: PropTypes.string.isRequired,
          userId: PropTypes.string.isRequired,
          authorData: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            picture: PropTypes.string.isRequired,
            profileId: PropTypes.number.isRequired,
          }),
          reviewContent: PropTypes.string.isRequired,
          parentId: PropTypes.number.isRequired,
          createdAt: PropTypes.string.isRequired,
        }),
      })),
    }),
  };

  render() {
    const { data: { loading, userReviews }, loadMore } = this.props;
    const { formatMessage } = this.props.intl;
    let showLoadMore = false;
    if (userReviews && userReviews.length > 0) {
      showLoadMore = true;
    }

    return (
      <div>
        <Panel className={s.panelNolist} >
          <div>
            <h3 className={bt.listingTitleText}>{formatMessage(messages.pastReviewTitle)} </h3>
          </div>
          {
            loading && <Loader type={'text'} />
          }
          {
            !loading && (userReviews === null || userReviews.length === 0) && <p>
              <FormattedMessage {...messages.noReviewPast} />
            </p>
          }
          {
            !loading && userReviews && <ul className={cx(s.listStyle, s.spaceTop4, s.recommondations)}>
              {
                userReviews.map((item, index) => {
                  if (item.reviewsCount === userReviews.length) {
                    showLoadMore = false;
                  }
                  if (item.authorData) {
                    return (<ReviewItem
                      key={index}
                      picture={item.authorData.picture}
                      firstName={item.authorData.firstName}
                      lastName={item.authorData.lastName}
                      otherUserName={item.userData.firstName}
                      otherUserProfileId={item.userData.profileId}
                      profileId={item.authorData.profileId}
                      reviewContent={item.reviewContent}
                      createdAt={item.createdAt}
                      response={item.response}
                      otherUserResponse
                      showUserName
                    />);
                  }
                })
              }
            </ul>
          }
          {
            !loading && showLoadMore && <div className={cx(s.textCenter, s.spaceTop3)}>
              <a className={cx(s.btn, bt.btnPrimary, s.loadMoreLink)} onClick={() => loadMore('me')}>
                <FormattedMessage {...messages.loadMore} />...
              </a>
            </div>
          }
        </Panel>
      </div>
    );
  }
}

export default injectIntl(withStyles(s, bt)(PastReviews));
