import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout4.css';
import cx from 'classnames';
import { connect } from 'react-redux';

// Components
import DetailSearchForm from '../DetailSearchForm/DetailSearchForm';

class Layout4 extends React.Component {
  constructor(props) {
    super(props);
    this.scrollTop = this.scrollTop.bind(this);
  }

  scrollTop() {
    window.scrollTo({
      top: screen.height,
      behavior: 'smooth',
    });
  }

  render() {
    const { data: { loading, getBanner }, homeBannerImages } = this.props;

    const path = '/images/home/xx_large_';
    let homeBannerFirst;

    if (homeBannerImages && homeBannerImages.length > 0) {
      homeBannerFirst = path + homeBannerImages[0].name;
    }

    return (
      <div>
        <div className={cx(s.bannerLayoutContainer)}>
          <div
            className={cx(s.bannerBackgroundImage)}
            style={{ backgroundImage: `url(${homeBannerFirst})` }}
          />
          <div className={cx(s.searchFormContainer)}>
            <h1 className={cx(s.mainHeader)}>
              Рыбалка и отдых. Прямая бронь и безопасный платеж.
            </h1>
            <div className="searchFormFlex" style={{display:'flex'}}>
            {
                            !loading && getBanner && <div className={s.searchFormWrap}>
                                {/* <h1><span>{getBanner.title}</span>
                                    {' '} {getBanner.content}
                                </h1> */}
                              {/* <DetailSearchForm /> */}
                            </div>
                        }
                         <div class="whyBlock">
               <h3>Почему GOODTRIP?</h3>
               <ul>
               <li>Без Переплат</li>
               <li>Самая полная база жилья</li>
               <li>Безопасность платежей</li>
               <li>Только проверенное жилье</li>
               </ul>
           </div>
                        </div>
                        {/* <div className='span-slogan'>
          <span style={{ WebkitTextFillColor: '#ffffff', 'font-weight': 'bold', 'text-shadow': '#000 3px 0 3px', 'fontSize':'40px'}}>Портал прямого бронирования </span>
              <span style={{ WebkitTextFillColor: '#ff3a40', 'font-weight': 'bold', 'text-shadow': '#000 3px 0 3px','fontSize':'40px' }}>GOODTRIP</span>
        </div> */}
        </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(Layout4));
