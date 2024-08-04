import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Redux
import {connect} from 'react-redux';
import {change, submit as submitForm} from 'redux-form';

// Translation
import {injectIntl} from 'react-intl';

// Google Places Suggest Component
// import GoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMapLoader from 'react-google-maps-loader';

// Constants
import {googleMapAPI} from '../../../config';

import Geosuggest from 'react-geosuggest';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!react-geosuggest/module/geosuggest.css';
import c from './HeaderLocationSearch.css';
import cx from 'classnames';

// Redux  Action
import {setPersonalizedValues} from '../../../actions/personalized';

// Locale
import messages from '../../../locale/messages';

// History
import history from '../../../core/history';

//yandex
import {Search} from "../../../routes/search/Search.js"
import {need_locations} from "../../../helpers/locations";

class HeaderLocationSearch extends Component {

    static propTypes = {
        label: PropTypes.string,
        className: PropTypes.string,
        containerClassName: PropTypes.string,
        setPersonalizedValues: PropTypes.any,
        googleMaps: PropTypes.object,
        personalized: PropTypes.shape({
            location: PropTypes.string,
            lat: PropTypes.number,
            lng: PropTypes.number,
            geography: PropTypes.string,
        }),
    };

    static defaultProps = {
        personalized: {
            location: '',
        },
    }

    constructor(props) {

        super(props);
        this.inputRef = React.createRef(null);
        this.state = {
            locationValue: '',
            chosenSuggest: '',
            suggestItems: []
        };
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const {personalized, personalized: {location}} = this.props;
        if (personalized && location) {
            this.setState({
                locationValue: location,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {personalized, personalized: {location}} = nextProps;
        if (personalized) {
            this.setState({
                locationValue: location,
            });
        }
    }

    //yandex
//   suggest() {

//     var suggestView1 = new ymaps.SuggestView('geosuggest__input--suggest');
// }
    async refreshYmaps() {
        if (Search.map) {
            Search.map.geoObjects.removeAll();
            await Search.initYmaps()

        } else {

        }
    }

    onSuggestSelect(data) {
        const {setPersonalizedValues, change} = this.props;
        const locationData = {};
        let updatedURI,
            uri = '/s?';
        let types = [],
            geoType;

        if (data.displayName) {
            uri = `${uri}&address=${data.displayName}&chosen=${1}`;
            updatedURI = encodeURI(uri);
            history.push(updatedURI);
            this.refreshYmaps()
        }
        if (data && data.gmaps) {
            types = data.gmaps.types;
            data.gmaps.address_components.map((item, key) => {
                if (item.types[0] == 'administrative_area_level_1' || item.types[0] == 'administrative_area_level_2' || item.types[0] == 'administrative_area_level_3') {
                    locationData.administrative_area_level_1_short = item.short_name;
                    locationData.administrative_area_level_1_long = item.long_name;
                } else if (item.types[0] == 'country') {
                    locationData[item.types[0]] = item.short_name;
                } else {
                    locationData[item.types[0]] = item.long_name;
                }
            });

            if (types && types.length > 0) {
                if (types.indexOf('country') > -1) {
                    geoType = 'country';
                } else if (types.indexOf('administrative_area_level_1') > -1 || types.indexOf('administrative_area_level_2') > -1 || types.indexOf('administrative_area_level_3') > -1) {
                    geoType = 'state';
                } else {
                    geoType = null;
                }
            }
            setPersonalizedValues({name: 'geography', value: JSON.stringify(locationData)});
            setPersonalizedValues({name: 'geoType', value: geoType});
            setPersonalizedValues({name: 'location', value: data.label});
            setPersonalizedValues({name: 'lat', value: data.location.lat});
            setPersonalizedValues({name: 'lng', value: data.location.lng});
            setPersonalizedValues({name: 'chosen', value: 1});
            // setPersonalizedValues({ name: 'showMap', value: true });
            uri = `${uri}&address=${data.label}&chosen=${1}`;

            updatedURI = encodeURI(uri);
            history.push(updatedURI);
            this.refreshYmaps()
        }
    }

    onChange(value) {
        const {setPersonalizedValues, change, submitForm} = this.props;
        // ymaps.ready(this.suggest);
        let location;
        let updatedURI,
            uri = '/s';
        if (history.location) {
            location = history.location.pathname;
        }

        setPersonalizedValues({name: 'location', value});
        setPersonalizedValues({name: 'geoType', value: null});
        setPersonalizedValues({name: 'chosen', value: null});
        setPersonalizedValues({name: 'geography', value: null});
        setPersonalizedValues({name: 'lat', value: null});
        setPersonalizedValues({name: 'lng', value: null});
        // setPersonalizedValues({ name: 'showMap', value: true });

        if (location == '/s' && !value) {
            setPersonalizedValues({name: 'location', value: ''});
            change('SearchForm', 'geography', null);
            change('SearchForm', 'geoType', null);
            change('SearchForm', 'lat', null);
            change('SearchForm', 'lng', null);
            change('SearchForm', 'lat', null);
            change('SearchForm', 'searchByMap', true);

            //uri = `${uri}&address=${value}&chosen=${1}`;
            updatedURI = encodeURI(uri);
            history.push(updatedURI);
            this.refreshYmaps()
        }

    }

    async getSuggest(event) {
        const text = event.target.value
        if (!text.length) {
            this.setState({
                ...this.state,
                suggestItems: []
            })
            return false
        } else {
            //const result = await ymaps.suggest(text)
            const locations_old = [
                {type: "geo", displayName: "Верхнекалиновский", value: "Верхнекалиновский"},
                {type: "geo", displayName: "Деревянное", value: "Деревянное"},
                {type: "geo", displayName: "Караульное", value: "Караульное"},
                {type: "geo", displayName: "Жан-Аул", value: "Жан-Аул"},
                {type: "geo", displayName: "Станья", value: "Станья"},
                {type: "geo", displayName: "Гандурино", value: "Гандурино"},
                {type: "geo", displayName: "Каралат", value: "Каралат"},
                {type: "geo", displayName: "Ревин Хутор", value: "Ревин Хутор"},
                {type: "geo", displayName: "Иванчуг", value: "Иванчуг"},
                {type: "geo", displayName: "Полдневое", value: "Полдневое"},
                {type: "geo", displayName: "Самосделка", value: "Самосделка"},
                {type: "geo", displayName: "Нижненикольский", value: "Нижненикольский"},
                {type: "geo", displayName: "село Затон", value: "село Затон"},
                {type: "geo", displayName: "Аккусинский", value: "Аккусинский"},
                {type: "geo", displayName: "село Тузуклей", value: "село Тузуклей"},
                {type: "geo", displayName: "остров Таппараки", value: "остров Таппараки"},
                {type: "geo", displayName: "остров Лайдасалма", value: "остров Лайдасалма"},
                {type: "geo", displayName: "Пяозеро", value: "Пяозеро"},
                {type: "geo", displayName: "Энергоозеро", value: "Энергоозеро"},
                {type: "geo", displayName: "Сапфорог", value: "Сапфорог"},
                {type: "geo", displayName: "вуошкалошари остров", value: "вуошкалошари остров"},
                {type: "geo", displayName: "остров Педаяшари", value: "остров Педаяшари"},
                {type: "geo", displayName: "остров майя", value: "остров майя"},
                {type: "geo", displayName: "река Софьянга", value: "река Софьянга"},
                {type: "geo", displayName: "Нижняя Пулонга", value: "Нижняя Пулонга"},
                {type: "geo", displayName: "Энгозеро", value: "Энгозеро"},
                {type: "geo", displayName: "деревня Коккосалма", value: "деревня Коккосалма"},
                {type: "geo", displayName: "озеро Пяозеро", value: "озеро Пяозеро"},
                {type: "geo", displayName: "остров Малошари", value: "остров Малошари"},
                {type: "geo", displayName: "остров Вуошкалошари", value: "остров Вуошкалошари"},
                {type: "geo", displayName: "урочище Таванга", value: "урочище Таванга"},
                {type: "geo", displayName: "Сафпорог", value: "Софпорог"},
                {type: "geo", displayName: "территория Суоперя", value: "территория Суоперя"},
                {type: "geo", displayName: "Кумское водохранилище", value: "Кумское водохранилище"},
                {type: "geo", displayName: "Риеккалансаари", value: "Риеккалансаари"},
                {type: "geo", displayName: "Волома", value: "Волома"},
                {type: "geo", displayName: "Кааламское", value: "Кааламское"},
                {type: "geo", displayName: "Кишкойла", value: "Кишкойла"},
                {type: "geo", displayName: "Кулмукса", value: "Кулмукса"},
                {type: "geo", displayName: "Тарулинна", value: "Тарулинна"},
                {type: "geo", displayName: "Песчаное", value: "Песчаное"},
                {type: "geo", displayName: "Нурмойла", value: "Нурмойла"},
                {type: "geo", displayName: "Токкарлахти", value: "Токкарлахти"},
                {type: "geo", displayName: "Кирьявалахти", value: "Кирьявалахти"},
                {type: "geo", displayName: "Кильпола", value: "Кильпола"},
                {type: "geo", displayName: "Эссойльское", value: "Эссойльское"},
                {type: "geo", displayName: "Рантуэ", value: "Рантуэ"},
                {type: "geo", displayName: "Ламберг", value: "Ламберг"},
                {type: "geo", displayName: "Сяндеба", value: "Сяндеба"},
                {type: "geo", displayName: "Чёлмужи", value: "Чёлмужи"},
                {type: "geo", displayName: "Туоксъярви", value: "Туоксъярви"},
                {type: "geo", displayName: "Ледмозерское", value: "Ледмозерское"},
                {type: "geo", displayName: "Койкары", value: "Койкары"},
                {type: "geo", displayName: "Ляскеля", value: "Ляскеля"},
                {type: "geo", displayName: "Сумериа", value: "Сумериа"},
                {type: "geo", displayName: "Важинская Пристань", value: "Важинская Пристань"},
                {type: "geo", displayName: "Крошнозеро", value: "Крошнозеро"},
                {type: "geo", displayName: "Шальский", value: "Шальский"},
                {type: "geo", displayName: "Сикопохья", value: "Сикопохья"},
                {type: "geo", displayName: "Ниэмелянхови", value: "Ниэмелянхови"},
                {type: "geo", displayName: "Лахденпохья", value: "Лахденпохья"},
                {type: "geo", displayName: "Шала", value: "Шала"},
                {type: "geo", displayName: "Село Нурмойла", value: "Село Нурмойла"},
                {type: "geo", displayName: "Остречье", value: "Остречье"},
                {
                    type: "geo",
                    displayName: "Республика Карелия, Беломорский муниципальный округ, Село Лехта",
                    value: "Село Лехта"
                },
                {type: "geo", displayName: "Лобское", value: "Лобское"},
                {type: "geo", displayName: "Олонка", value: "Олонка"},
                {type: "geo", displayName: "Чуралахта", value: "Чуралахта"},
                {type: "geo", displayName: "Ялгуба", value: "Ялгуба"},
                {type: "geo", displayName: "Тихтозеро", value: "Тихтозеро"},
                {type: "geo", displayName: "Устье Тулоксы", value: "Устье Тулоксы"},
                {type: "geo", displayName: "Питкярантский район", value: "Питкярантский район"},
                {type: "geo", displayName: "Коконниеми", value: "Коконниеми"},
                {type: "geo", displayName: "Повенец", value: "Повенец"},
                {type: "geo", displayName: "Гурвич", value: "Гурвич"}]
            const locations = await HeaderLocationSearch.getUniqueAddresses(text)
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

    static async getUniqueAddresses(text) {
        const query = `
      query SearchGeo($query: String!) {
    SearchGeo(query: $query) {
      results {
        type
        displayName
        value
      }
    }
  }
    `;
        const variables = {
            query: text
        };
        const resp = await fetch('/graphql', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
                // variables: [],
            }),
            credentials: 'include',
        });

        const response = await resp.json();
        console.log('map results', response, query)
        console.log(response.data.SearchGeo.results)

        return response.data.SearchGeo.results;
    }


    render() {
        const {className, containerClassName, personalized} = this.props;
        const {formatMessage} = this.props.intl;
        const {locationValue} = this.state;

        return (
            <div className={'headerSearch'}>
                <div className={cx(c.displayTable, c.searchContainer)}>
                    <div className={cx(c.displayTableCell, c.searchIconContainer, 'searchIconContainerrtl')}>
                        <svg
                            viewBox="0 0 24 24" role="presentation" aria-hidden="true"
                            focusable="false" className={c.searchIcon}
                        >
                            <path
                                d="m10.4 18.2c-4.2-.6-7.2-4.5-6.6-8.8.6-4.2 4.5-7.2 8.8-6.6 4.2.6 7.2 4.5 6.6 8.8-.6 4.2-4.6 7.2-8.8 6.6m12.6 3.8-5-5c1.4-1.4 2.3-3.1 2.6-5.2.7-5.1-2.8-9.7-7.8-10.5-5-.7-9.7 2.8-10.5 7.9-.7 5.1 2.8 9.7 7.8 10.5 2.5.4 4.9-.3 6.7-1.7v.1l5 5c .3.3.8.3 1.1 0s .4-.8.1-1.1"/>
                        </svg>
                    </div>
                    <div className={c.displayTableCell}>
                        <input defaultValue={locationValue} ref={this.inputRef} onInput={e => {
                            if (e.target.value) {
                                this.getSuggest(e);
                            } else {
                                window.location = '/s';
                            }
                        }} className='geosuggest__input suggest' placeholder='Направление, город, адрес'></input>
                        {this.state.suggestItems.length > 0 && <div className={c.suggest__items}>
                            {this.state.suggestItems.map(item => {
                                return <p onClick={e => {
                                    this.onSuggestSelect(item);
                                    this.inputRef.current.value = item.displayName;
                                    this.props.personalized.location = item.displayName;
                                    this.setState({...this.state, suggestItems: []})
                                }} className={c.suggest__item}>{item.displayName}</p>
                            })}
                        </div>}
                        {/* <ReactGoogleMapLoader
              params={{
                key: googleMapAPI, // Define your api key here
                libraries: 'places', // To request multiple libraries, separate them with a comma
              }}
              render={googleMaps =>
                googleMaps && (
                <Geosuggest
                id="suggest"
                  ref={el => this._geoSuggest = el}
                  country={'ru'}
                  placeholder={formatMessage(messages.homeWhere)}
                  inputClassName={className}
                  className={containerClassName}
                  initialValue={locationValue}
                  onChange={this.onChange}
                  onSuggestSelect={this.onSuggestSelect}
                  // autoComplete={'off'}
                  onKeyDown={(e) =>  e.key == 'Enter' ? this.onChange(this._geoSuggest.current) : false }
                  tabIndex="0"
                />
                )}
            /> */}
                    </div>
                </div>
            </div>

        );
    }
}

const mapState = state => ({
    personalized: state.personalized,
});

const mapDispatch = {
    setPersonalizedValues,
    change,
    submitForm,
};

export default injectIntl(withStyles(s, c)(connect(mapState, mapDispatch)(HeaderLocationSearch)));
