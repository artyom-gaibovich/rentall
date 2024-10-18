import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, gql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import HorizontalScrollingBar from './HorizontalScrollingBar';
// Components
import BannerCaption from '../../components/Home/BannerCaption';
import HomeSlider from '../../components/Home/HomeSlider';
import NewsBox from '../../components/Home/NewsBox';
import SearchForm from '../../components/Home/SearchForm';
import Loader from '../../components/Loader';
import SeeAll from '../../components/Home/SeeAll';
import HomeKindofTrip from '../../components/Home/HomeKindofTrip';
import PopularLocationGrid from '../../components/Home/PopularLocationGrid';
import Layout4 from '../../components/Home/Layout4';
import Layout1 from '../../components/Home/Layout1';
import Layout3 from '../../components/Home/Layout3';

// Graphql
import getRecommendQuery from './getRecommend.graphql';
import getImageBannerQuery from './getImageBanner.graphql';
import getMostViewedListingQuery from './getMostViewedListing.graphql';
import getPopularLocationQuery from './getPopularLocation.graphql';
import getStaticBlockInfoQuery from './getStaticBlockInfo.graphql';
import getHomeBanner from './getHomeBanner.graphql';

// Locale
import messages from '../../locale/messages';

class Homepage extends React.Component {
  static propTypes = {
    getRecommendData: PropTypes.shape({
      loading: PropTypes.bool,
      getRecommendData: PropTypes.array,
    }),
    getImageBannerData: PropTypes.shape({
      loading: PropTypes.bool,
      getImageBanner: PropTypes.object,
    }),
    getMostViewedListingData: PropTypes.shape({
      loading: PropTypes.bool,
      GetMostViewedListing: PropTypes.array,
    }),
    getPopularLocationData: PropTypes.shape({
      loading: PropTypes.bool,
      GetMostViewedListing: PropTypes.array,
    }),
    getHomeBannerData: PropTypes.shape({
      loading: PropTypes.bool,
      getHomeBanner: PropTypes.object,
    }),
    formatMessage: PropTypes.func,
  };

  static defaultProps = {
    getRecommendData: {
      loading: true,
    },
    getImageBannerData: {
      loading: true,
    },
    getMostViewedListingData: {
      loading: true,
    },
    getPopularLocationData: {
      loading: true,
    },
    homeBannerImages: {
      loading: true,
    },
    getHomeBanner: {
      loading: true,
    },
  }
  static metrikaAdded = false;
  addYandexMetrika = () => {
    try {
      if (Homepage.metrikaAdded === false) {
        // const script = document.createElement('script');
        const scriptMetrika = document.createElement('script');
        scriptMetrika.innerHTML =
          '(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};   m[i].l=1*new Date();   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");   ym(92387837, "init", {        clickmap:true,        trackLinks:true,        accurateTrackBounce:true,        webvisor:true,        ecommerce:"dataLayer"   }); ';
        document.getElementsByTagName('head')[0].appendChild(scriptMetrika);
        // const metrikaNoscript = document.createElement('script');
        // metrikaNoscript.innerHTML = '<noscript><div><img src="https://mc.yandex.ru/watch/92387837" style="position:absolute; left:-9999px;" alt="" /></div></noscript>';
        // document.getElementsByTagName('head')[0].appendChild(metrikaNoscript);
        Homepage.metrikaAdded = true;
        // console.log('metrika added');
      } else {
        // console.log('metrika already added');
        return null;
      }
    } catch (e) {
      // console.log(e);
    }
  };

  render() {
    const { getRecommendData, getImageBannerData, getMostViewedListingData, getBannerData } = this.props;
    const { getPopularLocationData, layoutType, getStaticBlockInfoData, homeBannerImages } = this.props;
    const { getHomeBannerData } = this.props;
    const getHomeBanner = getHomeBannerData && getHomeBannerData.getHomeBanner;

    return (
      <div className={s.root}>
        {/* {this.addYandexMetrika()} */}
        {
          layoutType && layoutType == 1 && <Layout1
            layoutType={layoutType}
            data={getBannerData}
            homeBannerImages={getHomeBanner}
          />
        }

        {
          layoutType && layoutType == 3 && <Layout3
            layoutType={layoutType}
            data={getBannerData}
            homeBannerImages={getHomeBanner}
          />
        }

        {
          layoutType && layoutType == 4 && <Layout4
            layoutType={layoutType}
            data={getBannerData}
            homeBannerImages={getHomeBanner}
          />
        }


        <div className={s.container}>
          <img className={s.mainPageImg} src="../../../images/home/mainPageNew.webp" />
          <div className={s.mainText}>
            <h1>Рыбалка и отдых</h1>
            <h2>Прямая бронь и  все услуги для отличного улова</h2>
          </div>

          {
            layoutType && layoutType == 2 && <div className={s.pageContainer}>
              <BannerCaption data={getBannerData} />
              <div className={s.pageContainer}>
                <SearchForm />
              </div>
            </div>
          }
          { /* <HorizontalScrollingBar/> */ }
          {/* {
            layoutType && layoutType == 2 && <div className={s.pageContainer}>
              <SearchForm />
            </div>
          } */}
          <div className={s.popularLocationBlock}>
            {
                getPopularLocationData.getPopularLocationAdmin && getPopularLocationData.getPopularLocationAdmin.length > 0 && <div className={s.pageContainer}>
                  {/* <h3 className={cx(s.containerTitle, s.marginLeft)}>
                    <FormattedMessage {...messages.popularLocation} />
                  </h3> */}
                  <PopularLocationGrid
                    data={getPopularLocationData.getPopularLocationAdmin}
                  />
                </div>
              }
          </div>
          <div className={s.whyBlockContainer}>
            {/* <img className={s.whyBlockContainerImg} src= "../../../images/home/whyBlock.jpeg"/> */}
          </div>
          {
            getRecommendData.loading && getImageBannerData.loading && getMostViewedListingData.loading && <div>
              <Loader type="text" />
            </div>
          }
          {
            !getRecommendData.loading && !getImageBannerData.loading && !getMostViewedListingData.loading && !getStaticBlockInfoData.loading && <div className={s.pageContainer}>
              {
                getRecommendData && getRecommendData.getRecommend.length > 0 && <div >
                  <h3 className={s.containerTitle}>
                  ЛУЧШИЕ МЕСТА ДЛЯ АКТИВНОГО ОТДЫХА
                  </h3>
                  <HomeSlider data={getRecommendData.getRecommend} />
                  <SeeAll />
                </div>

              }

              {/* {
                getMostViewedListingData && getMostViewedListingData.GetMostViewedListing.length > 0 && <div className={s.pageContainer}>
                  <h3 className={s.containerTitle}>
                    <FormattedMessage {...messages.mostViewed} />
                    <SeeAll />
                  </h3>
                  <HomeSlider data={getMostViewedListingData.GetMostViewedListing} />
                </div>
              } */}
              {

              }


              {/* {
                getImageBannerData.getImageBanner != null && <div className={s.pageContainer}>
                  <NewsBox data={getImageBannerData.getImageBanner} />
                </div>
              }

              {
                getStaticBlockInfoData && !getStaticBlockInfoData.loading && getStaticBlockInfoData.getStaticInfo && getStaticBlockInfoData.getStaticInfo.length > 0 && getStaticBlockInfoData.getStaticInfo[0].isEnable == true && <div className="hidden-xs">
                  <HomeKindofTrip data={getStaticBlockInfoData} />
                </div>
              } */}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(s),
  graphql(gql`
        query getBanner{
          getBanner {
            id
            title
            content
          }
        }
      `, {
        name: 'getBannerData',
        options: {
          ssr: true,
        },
      }),
  graphql(getHomeBanner, {
    name: 'getHomeBannerData',
    options: {
      ssr: true,
      // fetchPolicy: 'network-only'
    },
  }),
  graphql(getRecommendQuery, {
    name: 'getRecommendData',
    options: {
      ssr: true,
      // fetchPolicy: 'network-only'
    },
  }),
  graphql(getMostViewedListingQuery, {
    name: 'getMostViewedListingData',
    options: {
      ssr: true,
      // fetchPolicy: 'network-only'
    },
  }),
  graphql(getImageBannerQuery, {
    name: 'getImageBannerData',
    options: {
      ssr: true,
    },
  }),
  graphql(getPopularLocationQuery, {
    name: 'getPopularLocationData',
    options: {
      ssr: true,
    },
  }),
  graphql(getStaticBlockInfoQuery, {
    name: 'getStaticBlockInfoData',
    options: {
      ssr: true,
    },
  }),

)(Homepage);
