import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Redux  Action
import { setPersonalizedValues } from '../../../../actions/personalized';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!react-geosuggest/module/geosuggest.css';

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
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
  }

  async onTextChange(event) {
    const text = event.target.value;

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
    const suggestItems = locations.filter(location =>
      location.value.toLowerCase().includes(text.toLowerCase()),
    ).slice(0, 10);

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
      const { onChange } = this.props;
      onChange(suggestion.value);
    }
  }

  render() {
    const { label, className, containerClassName } = this.props;
    const { suggestItems } = this.state;

    return (
      <div className={`popularLocationAutoComplete ${containerClassName}`}>
        <input
          type="text"
          placeholder={label}
          className={className}
          onChange={this.onTextChange}
        />
        {suggestItems.length > 0 && (
          <ul className={s.suggestionsList}>
            {suggestItems.map((item, index) => (
              <li key={index} onClick={() => this.onSuggestSelect(item)}>
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
