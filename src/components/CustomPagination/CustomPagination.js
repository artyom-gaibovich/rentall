import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!./index.css';
import { change } from 'redux-form';
import { isRTL } from '../../helpers/formatLocale';
import { connect } from 'react-redux';

// Message
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../locale/messages';

//yandex 
import {searchResultsData} from "../../actions/getSearchResults.js"

class CustomPagination extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    defaultCurrent: PropTypes.number.isRequired,
    defaultPageSize: PropTypes.number.isRequired,
    change: PropTypes.any.isRequired,
    currentPage: PropTypes.number.isRequired,
    paginationLabel: PropTypes.string,
  };

  static defaultProps = {
    paginationLabel: 'items',
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderShowTotal = this.renderShowTotal.bind(this);
  }
  initYmaps () {
    if (searchResultsData) {
      const map = new ymaps.Map(document.querySelector("#map"), {
        center: [searchResultsData.results[0].lat, searchResultsData.results[0].lng],
        zoom: 12
      })
      try {

      } catch (E) {}
      const searchedHouses = searchResultsData.results
      const coverPhoto = Array.from(document.querySelectorAll("._3pERg.swiper-lazy.swiper-lazy-loaded"))
      const filteredCovers = coverPhoto.filter(function(_, index) {
        return index % 2 == 1;
    })
      searchedHouses.map((item,index) => {
        const coverPhotoUrl = filteredCovers[index].style.backgroundImage;
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
              type: "Point",
              coordinates:[item.lat, item.lng]
          },
          modules:['geoObject.addon.balloon'],
          properties: {
            balloonContentHeader: `<a href="/rooms/${formatURL(item.title)}-${item.id}" target=>${item.title}</a>`,
              balloonContentBody: `<a href="/rooms/${formatURL(item.title)}-${item.id}"><div style='background-image: ${coverPhotoUrl}; background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
              balloonContentFooter: item.listingData.basePrice + " за ночь",
              iconContent: item.listingData.basePrice,
          }
      }, {
    preset: 'islands#blackStretchyIcon'
  })
  map.geoObjects.add(myGeoObject)
      })
      map.setBounds(map.geoObjects.getBounds());
    }
		
	}
  handleChange(currentPage, size) {
    const { change } = this.props;
    change(currentPage);
    ymaps.ready(this.initYmaps)
  }

  renderShowTotal(total, range) {
    const { paginationLabel } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={s.resultsCount}>
        <span>{range[0]}</span>
        <span>&nbsp;–&nbsp;</span>
        <span>{range[1]}</span>
        <span>&nbsp;{formatMessage(messages.PaginationOfContent)}&nbsp;</span>
        <span className="paginationRtl">{total}</span>
        <span>&nbsp;{paginationLabel}</span>
      </div>
    );
  }

  render() {
    const { total, defaultCurrent, defaultPageSize, currentPage } = this.props;
    const locale = { prev_page: 'Previous', next_page: 'Next' };

    return (
      <div className={'spaceTop4'}>
        <Pagination
          className="ant-pagination"
          defaultCurrent={defaultCurrent}
          current={currentPage}
          total={total}
          defaultPageSize={defaultPageSize}
          onChange={this.handleChange}
          showTotal={(total, range) => this.renderShowTotal(total, range)}
          locale={locale}
          showLessItems
        />
      </div>
    );
  }


}

const mapState = state => ({
});

const mapDispatch = {
};

// export default withStyles(s)(CustomPagination);

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(CustomPagination)));
