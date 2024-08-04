import React from 'react';
import PropTypes from 'prop-types';
// Redux
import {connect} from 'react-redux';

// Translation
import {FormattedMessage, injectIntl} from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchForm.css';
import bt from '../../commonStyle.css';

import {Field, reduxForm} from 'redux-form';

import {
    Button,
    Grid,
    Row,
    Col,
    FormControl,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// History
import history from '../../../core/history';

// Components
import DateRange from '../DateRange';
import PlaceGeoSuggest from '../PlaceGeoSuggest';
import MobileDateRange from '../MobileDateRange';

// Redux Action
import {getSpecificSettings} from '../../../actions/getSpecificSettings';
import {setPersonalizedValues} from '../../../actions/personalized';

// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';

// Locale
import messages from '../../../locale/messages';
import {lakes} from "../../../helpers/getUniqueSubjects";

class SearchForm extends React.Component {
    static propTypes = {
        setPersonalizedValues: PropTypes.any.isRequired,
        getSpecificSettings: PropTypes.any.isRequired,
        personalized: PropTypes.shape({
            location: PropTypes.string,
            lat: PropTypes.number,
            lng: PropTypes.number,
            chosen: PropTypes.number,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            personCapacity: PropTypes.number,
            formatMessage: PropTypes.any,
        }),
        settingsData: PropTypes.shape({
            listSettings: PropTypes.array.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        listingFields: [],
    };

    static defaultProps = {
        personalized: {
            location: null,
            lat: null,
            lng: null,
            startDate: null,
            endDate: null,
            personCapacity: null,
            chosen: null,
        },
        settingsData: {
            listSettings: [],
        },
    };

    constructor(props) {
        super(props);
        this.inputRef = React.createRef(null);
        this.state = {
            mobileDevice: false,
            personCapacity: [],
            isLoad: false,
            smallDevice: false,
            verySmallDevice: false,
            chosenSuggest: '',
            suggestItems: [],
            suggestEmpty: false
        },
            this.handleClick = this.handleClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        // const script = document.createElement('script');
        // script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.YANDEX_APP_ID}&lang=ru_RU&t=2`;
        // script.async = true;
        // document.body.appendChild(script);

        this.setState({isLoad: false});
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            this.handleResize();
            window.addEventListener('resize', this.handleResize);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {listingFields} = nextProps;
        if (listingFields != undefined) {
            this.setState({
                roomType: listingFields.roomType,
                personCapacity: listingFields.personCapacity,
            });
        }
    }

    componentWillMount() {

        const {getSpecificSettings, listingFields} = this.props;
        if (detectMobileBrowsers.isMobile() === true) {
            this.setState({mobileDevice: true});
        }
        if (listingFields != undefined) {
            this.setState({
                roomType: listingFields.roomType,
                personCapacity: listingFields.personCapacity,
            });
        }
    }

    componentWillUnmount() {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            window.removeEventListener('resize', this.handleResize);
        }
    }


    handleResize(e) {
        const isBrowser = typeof window !== 'undefined';
        const smallDevice = isBrowser ? window.matchMedia('(max-width: 767px)').matches : true;
        const verySmallDevice = isBrowser ? window.matchMedia('(max-width: 480px)').matches : false;

        this.setState({
            smallDevice,
            verySmallDevice,
        });
    }


    handleClick() {
        const {personalized, setPersonalizedValues} = this.props;
        if (!this.inputRef.current.value) {
            this.setState({
                ...this.state,
                suggestEmpty: true
            })
            console.log('not chosed location')
            return false
        }
        if (this.inputRef.current.value == 'Астрахань') {
            this.inputRef.current.value = 'Астраханская область'
            personalized.location = 'Астраханская область'
        }
        let updatedURI,
            uri = '/s?';

        if (personalized.chosen != null) {
            uri = `${uri}&address=${personalized.location}&chosen=${personalized.chosen}`;
        } else if (personalized.location != null) {
            uri = `${uri}&address=${personalized.location}`;
        }

        if (personalized.startDate != null && personalized.endDate != null) {
            uri = `${uri}&startdate=${personalized.startDate}&enddate=${personalized.endDate}`;
        }

        if (personalized.personCapacity != null && !isNaN(personalized.personCapacity)) {
            uri = `${uri}&guests=${personalized.personCapacity}`;
        }

        updatedURI = encodeURI(uri);
        history.push(updatedURI);
    }


    async getSuggest(event) {
        const text = event.target.value.trim();


        if (!text.length) {
            this.setState({
                ...this.state,
                suggestItems: []
            })
            return false
        } else {
            const locations = [
                { type: "geo", displayName: "Верхнекалиновский", value: "Верхнекалиновский" },
                { type: "geo", displayName: "Деревянное", value: "Деревянное" },
                { type: "geo", displayName: "Караульное", value: "Караульное" },
                { type: "geo", displayName: "Жан-Аул", value: "Жан-Аул" },
                { type: "geo", displayName: "Станья", value: "Станья" },
                { type: "geo", displayName: "Гандурино", value: "Гандурино" },
                { type: "geo", displayName: "Каралат", value: "Каралат" },
                { type: "geo", displayName: "Ревин Хутор", value: "Ревин Хутор" },
                { type: "geo", displayName: "Иванчуг", value: "Иванчуг" },
                { type: "geo", displayName: "Полдневое", value: "Полдневое" },
                { type: "geo", displayName: "Самосделка", value: "Самосделка" },
                { type: "geo", displayName: "Нижненикольский", value: "Нижненикольский" },
                { type: "geo", displayName: "село Затон", value: "село Затон" },
                { type: "geo", displayName: "Аккусинский", value: "Аккусинский" },
                { type: "geo", displayName: "село Тузуклей", value: "село Тузуклей" },
                { type: "geo", displayName: "остров Таппараки", value: "остров Таппараки" },
                { type: "geo", displayName: "остров Лайдасалма", value: "остров Лайдасалма" },
                { type: "geo", displayName: "Пяозеро", value: "Пяозеро" },
                { type: "geo", displayName: "Энергоозеро", value: "Энергоозеро" },
                { type: "geo", displayName: "Сапфорог", value: "Сапфорог" },
                { type: "geo", displayName: "вуошкалошари остров", value: "вуошкалошари остров" },
                { type: "geo", displayName: "остров Педаяшари", value: "остров Педаяшари" },
                { type: "geo", displayName: "остров майя", value: "остров майя" },
                { type: "geo", displayName: "река Софьянга", value: "река Софьянга" },
                { type: "geo", displayName: "Нижняя Пулонга", value: "Нижняя Пулонга" },
                { type: "geo", displayName: "Энгозеро", value: "Энгозеро" },
                { type: "geo", displayName: "деревня Коккосалма", value: "деревня Коккосалма" },
                { type: "geo", displayName: "озеро Пяозеро", value: "озеро Пяозеро" },
                { type: "geo", displayName: "остров Малошари", value: "остров Малошари" },
                { type: "geo", displayName: "остров Вуошкалошари", value: "остров Вуошкалошари" },
                { type: "geo", displayName: "урочище Таванга", value: "урочище Таванга" },
                { type: "geo", displayName: "Сафпорог", value: "Софпорог" },
                { type: "geo", displayName: "территория Суоперя", value: "территория Суоперя" },
                { type: "geo", displayName: "Кумское водохранилище", value: "Кумское водохранилище" },
                { type: "geo", displayName: "Риеккалансаари", value: "Риеккалансаари" },
                { type: "geo", displayName: "Волома", value: "Волома" },
                { type: "geo", displayName: "Кааламское", value: "Кааламское" },
                { type: "geo", displayName: "Кишкойла", value: "Кишкойла" },
                { type: "geo", displayName: "Кулмукса", value: "Кулмукса" },
                { type: "geo", displayName: "Тарулинна", value: "Тарулинна" },
                { type: "geo", displayName: "Песчаное", value: "Песчаное" },
                { type: "geo", displayName: "Нурмойла", value: "Нурмойла" },
                { type: "geo", displayName: "Токкарлахти", value: "Токкарлахти" },
                { type: "geo", displayName: "Кирьявалахти", value: "Кирьявалахти" },
                { type: "geo", displayName: "Кильпола", value: "Кильпола" },
                { type: "geo", displayName: "Эссойльское", value: "Эссойльское" },
                { type: "geo", displayName: "Рантуэ", value: "Рантуэ" },
                { type: "geo", displayName: "Ламберг", value: "Ламберг" },
                { type: "geo", displayName: "Сяндеба", value: "Сяндеба" },
                { type: "geo", displayName: "Чёлмужи", value: "Чёлмужи" },
                { type: "geo", displayName: "Туоксъярви", value: "Туоксъярви" },
                { type: "geo", displayName: "Ледмозерское", value: "Ледмозерское" },
                { type: "geo", displayName: "Койкары", value: "Койкары" },
                { type: "geo", displayName: "Ляскеля", value: "Ляскеля" },
                { type: "geo", displayName: "Сумериа", value: "Сумериа" },
                { type: "geo", displayName: "Важинская Пристань", value: "Важинская Пристань" },
                { type: "geo", displayName: "Крошнозеро", value: "Крошнозеро" },
                { type: "geo", displayName: "Шальский", value: "Шальский" },
                { type: "geo", displayName: "Сикопохья", value: "Сикопохья" },
                { type: "geo", displayName: "Ниэмелянхови", value: "Ниэмелянхови" },
                { type: "geo", displayName: "Лахденпохья", value: "Лахденпохья" },
                { type: "geo", displayName: "Шала", value: "Шала" },
                { type: "geo", displayName: "Село Нурмойла", value: "Село Нурмойла" },
                { type: "geo", displayName: "Остречье", value: "Остречье" },
                { type: "geo", displayName: "Республика Карелия, Беломорский муниципальный округ, Село Лехта", value: "Село Лехта" },
                { type: "geo", displayName: "Лобское", value: "Лобское" },
                { type: "geo", displayName: "Олонка", value: "Олонка" },
                { type: "geo", displayName: "Чуралахта", value: "Чуралахта" },
                { type: "geo", displayName: "Ялгуба", value: "Ялгуба" },
                { type: "geo", displayName: "Тихтозеро", value: "Тихтозеро" },
                { type: "geo", displayName: "Устье Тулоксы", value: "Устье Тулоксы" },
                { type: "geo", displayName: "Питкярантский район", value: "Питкярантский район" },
                { type: "geo", displayName: "Коконниеми", value: "Коконниеми" },
                { type: "geo", displayName: "Повенец", value: "Повенец" },
                { type: "geo", displayName: "Гурвич", value: "Гурвич" }]
            const suggestItems = [];
            for (let location of locations) {
                if (location.value.toLowerCase().includes(text.toLowerCase())) {
                    suggestItems.push(location);
                }
                if (suggestItems.length >= 10) {
                    break;
                }
            }


            this.setState({
                ...this.state,
                suggestItems: suggestItems
            })
        }

    }


    render() {
        const {location, dates, settingsData, setPersonalizedValues, personalized, listingFields} = this.props;
        const {formatMessage} = this.props.intl;
        const {personCapacity, smallDevice, verySmallDevice} = this.state;
        const rows = [];
        const isBrowser = typeof window !== 'undefined';

        let startValue,
            endValue;
        if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
            for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
                rows.push(<option value={i}
                                  key={i}>{i} {i > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}</option>);
                startValue = personCapacity[0].startValue;
                endValue = personCapacity[0].endValue;
            }
        }
        // const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} className={s.greenSearchForm}>
                        <form>
                            <div className={cx(s.searchFormInputs, 'homeSearchForm', 'verticalsearchform')}>
                                <div className={s.searchForm}>
                                    <div className={cx(s.table)}>
                                        <div className={cx(s.tableRow)}>
                                            <div className={cx(s.tableCell, s.location, 'tableCellRTL')}>
                                                {/* <label className={s.label}>
                          <span> <FormattedMessage {...messages.where} /></span>
                        </label> */}
                                                <input ref={this.inputRef} onInput={e => {
                                                    this.getSuggest(e)
                                                }}
                                                       className={`geosuggest__input suggest ${this.state.suggestEmpty ? 'geosuggest__input_err' : ''}`}
                                                       placeholder='Направление, город, адрес'></input>
                                                {this.state.suggestItems.length > 0 &&
                                                    <div className={s.suggest__items}>
                                                        {this.state.suggestItems.map(item => {
                                                            return <p onClick={e => {
                                                                this.inputRef.current.value = item.displayName;
                                                                this.props.personalized.location = item.displayName;
                                                                this.setState({
                                                                    ...this.state,
                                                                    suggestEmpty: false,
                                                                    suggestItems: []
                                                                })
                                                            }} className={s.suggest__item}>{item.displayName}</p>
                                                        })}
                                                    </div>}
                                                {this.state.suggestEmpty &&
                                                    <span className='geosuggest__err'>{'Необходимо выбрать'}</span>}
                                                {/* <PlaceGeoSuggest
                          label={formatMessage(messages.homeWhere)}
                          className={cx(s.formControlInput, s.input)}
                          containerClassName={s.geoSuggestContainer}
                        /> */}
                                            </div>
                                            <div className={cx(s.tableCell, s.dates)}>
                                                {/* <label className={s.label}>
                          <span> <FormattedMessage {...messages.when} /></span>
                        </label> */}
                                                <span
                                                    className={cx('homeDate', s.formControlInput, s.input, 'homeDateAR')}>
                          {
                              !smallDevice && <DateRange
                                  formName={'SearchForm'}
                                  numberOfMonths={2}
                              />
                          }

                                                    {
                                                        smallDevice && <MobileDateRange
                                                            formName={'SearchForm'}
                                                            numberOfMonths={1}
                                                        />
                                                    }

                        </span>
                                            </div>
                                            <div
                                                className={cx(s.tableCell, s.guests, s.guestPadding, s.mobilePadding, 'tableCellLeftRTL')}>
                                                {/* <label className={cx(s.selectPadding, s.label)}>
                          <span> <FormattedMessage {...messages.guest} /></span>
                        </label> */}
                                                <FormControl
                                                    componentClass="select"
                                                    className={cx(s.formControlSelect, s.input, s.inputPadding, 'inputPaddingAR')}
                                                    onChange={e => setPersonalizedValues({
                                                        name: 'personCapacity',
                                                        value: Number(e.target.value)
                                                    })}
                                                    defaultValue={personalized.personCapacity}
                                                >
                                                    {rows}
                                                </FormControl>
                                            </div>
                                            <div className={cx(s.tableCell, s.search, s.noBroderRight)}>
                                                <Button className={cx(bt.btnPrimary, s.btnBlock, s.searchButton)}
                                                        style={{color: "white !important"}} onClick={this.handleClick}>
                          <span className={cx('hidden-lg hidden-xs')}>
                            <FontAwesome.FaSearch/>
                          </span>
                                                    <span className={cx('hidden-md hidden-sm')}>
                            <FormattedMessage {...messages.search} />
                          </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

SearchForm = reduxForm({
    form: 'SearchForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(SearchForm);

const mapState = state => ({
    personalized: state.personalized,
    settingsData: state.viewListing.settingsData,
    listingFields: state.listingFields.data,
});

const mapDispatch = {
    getSpecificSettings,
    setPersonalizedValues,
};

export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(SearchForm)));
