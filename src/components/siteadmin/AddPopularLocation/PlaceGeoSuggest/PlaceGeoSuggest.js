import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Redux  Action
import { setPersonalizedValues } from '../../../../actions/personalized';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!react-geosuggest/module/geosuggest.css';
import cx from 'classnames';

class PlaceGeoSuggest extends Component {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    setPersonalizedValues: PropTypes.func,
    personalized: PropTypes.shape({
      locationAddress: PropTypes.string,
    }),
  };

  static defaultProps = {
    formName: 'AddPopularLocation',
    personalized: {
      locationAddress: null,
    },
  };


  constructor(props) {
    super(props);
    this.state = {
      suggestItems: [],
      inputValue: '', // State for input value
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
  }

  async onTextChange(event) {
    const text = event.target.value;

    this.setState({ inputValue: text }); // Update input value as user types

    if (text.length === 0) {
      this.setState({ suggestItems: [] });
      return;
    }

    // Fetch suggestions
    const suggestItems = await this.getSuggest(text);
    this.setState({ suggestItems });
  }

  async getSuggest(text) {
    const locations = await PlaceGeoSuggest.getUniqueAddresses(text);
    console.log(locations);
    const suggestItems = locations
      .filter(location => location && location.value && location.value.toLowerCase()
        .includes(text.toLowerCase()))
      .slice(0, 10);

    return suggestItems;
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
    const variables = { query: text };
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    });
    const response = await resp.json();
    return response.data.SearchGeo.results;
  }


  onSuggestSelect(suggestion) {
    if (suggestion) {
      this.setState({
        inputValue: suggestion.value, // Update the input value with the selected suggestion
        suggestItems: [] // Clear suggestions after selection
      });

      const { onChange } = this.props;
      onChange(suggestion.value); // Notify parent component
    }
  }

  componentDidMount() {
    const { initialValues } = this.props;
    if (initialValues && initialValues.locationAddress) {
      this.setState({
        inputValue: initialValues.locationAddress
      });
    }
  }

  render() {
    const { label, className, containerClassName } = this.props;
    const { suggestItems, inputValue } = this.state;
    return (
      <div className={`popularLocationAutoComplete ${containerClassName}`}>
        <input
          type="text"
          placeholder={label}
          className={cx(className, 'form-control')}
          value={inputValue} // Bind input value to state
          onChange={this.onTextChange}
        />
        {suggestItems.length > 0 && (
          <ul className="suggestionsList">
            {suggestItems.map((item, index) => (
              <li
                key={index}
                className={cx({ 'active': index === s.activeSuggestion })} // Добавляем класс active для подсветки
                onClick={() => this.onSuggestSelect(item)}
              >
                {item.displayName}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  personalized: state.personalized,
});

const mapDispatch = {
  setPersonalizedValues,
};

export default withStyles(s)(connect(mapState, mapDispatch)(PlaceGeoSuggest));
