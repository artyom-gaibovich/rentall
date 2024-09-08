import React from 'react';
import { FormGroup, FormControl, Row, Col } from 'react-bootstrap'; // Bootstrap элементы
import { injectIntl } from 'react-intl'; // Для работы с интернационализацией

const getSuggestions = async (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  const result = await getUniqueAddressesSuggest(inputValue);
  return inputLength === 0
    ? []
    : result.filter(object =>
      object.value.toLowerCase().startsWith(inputValue),
    );
};

const getUniqueAddressesSuggest = async inputValue => [
  {
    type: 'geo',
    displayName: 'Астраханская область',
    value: 'Астраханская область',
  },
  {
    type: 'geo',
    displayName: 'Республиканская область',
    value: 'Ебланская область',
  },
  {
    type: 'geo',
    displayName: 'Коломенская область',
    value: 'Астраханская область',
  },
];

export class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      isSuggestionsVisible: false,
      highlightedIndex: -1,
    };
    this.onChange = this.onChange.bind(this);
  }


  async onChange(event) {
    const value = event.target.value;
    const suggestions = await getSuggestions(value);
    this.setState({
      value,
      suggestions,
      isSuggestionsVisible: true,
      highlightedIndex: -1,
    });
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={className}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={3}>
            <label>{label}</label>
          </Col>
          <Col xs={12} sm={12} md={12} lg={9}>
            <FormControl {...input} type={type} />
            {touched && error && <span>{formatMessage(error)}</span>}
          </Col>
        </Row>
      </FormGroup>
    );
  }

  onSuggestionClick = (suggestion) => {
    this.setState({
      value: suggestion.displayName,
      isSuggestionsVisible: false,
    });
  };

  renderSuggestions = () => {
    const { suggestions, isSuggestionsVisible, highlightedIndex } = this.state;
    if (!isSuggestionsVisible || suggestions.length === 0) {
      return null;
    }

    return (
      <ul style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.value}
            style={{
              ...styles.suggestion,
              ...(index === highlightedIndex
                ? styles.highlightedSuggestion
                : {}),
            }}
            onClick={() => this.onSuggestionClick(suggestion)}
          >
            {suggestion.displayName}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { value } = this.state;

    return (
      <div style={styles.container}>
        {/* Используем renderFormControl */}
        {this.renderFormControl({
          input: {
            value,
            onChange: this.onChange,
          },
          label: 'Введите область',
          type: 'text',
          meta: { touched: false, error: null },
          className: 'form-group-class', // Класс для стиля
        })}

        {this.renderSuggestions()}

        <button type="submit">Отправить</button>
      </div>
    );
  }
}

// В стиле этого компонента для автозаполнения:
const styles = {
  container: {
    position: 'relative',
    width: '300px',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    zIndex: 10,
    borderRadius: '4px',
  },
  suggestion: {
    padding: '10px',
    cursor: 'pointer',
  },
  highlightedSuggestion: {
    backgroundColor: '#ddd',
  },
};

// Используем injectIntl для работы с интернационализацией
export default injectIntl(Example);
