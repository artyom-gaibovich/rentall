import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Rent.css';
import {
  Button,
} from 'react-bootstrap';
import cx from 'classnames';

// Redux Form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../../../locale/messages';

// Submit
import submit from '../../SearchForm/submit';

import CustomCheckbox from '../../../CustomCheckbox';

class Rent extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool,
  };

  static defaultProps = {
    isExpand: false,
    fieldsSettingsData: {
      roomType: [],
    },
    rent: [],
    smallDevice: false,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setBtnWrapperRef = this.setBtnWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  async handleSubmit() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    await change('currentPage', 1);
    submitForm('SearchForm');
    handleTabToggle('rent', !isExpand, true);
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    change('rent', []);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setBtnWrapperRef(node) {
    this.btnWrapperRef = node;
  }

  handleClickOutside(event) {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      change('currentPage', 1);
      submitForm('SearchForm');
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle('rent', !isExpand, true);
      }
    }
  }

  checkboxHorizontalGroup = ({ label, name, options, input }) => {
    const { formatMessage } = this.props.intl;
    console.log('inp', input);
    return (
      <div className={cx(s.displayTable)}>
        {
          options.map((option, index) => {
            if (option.isEnable !== '1') {
              return <span maxPrice />;
            }
            // const splitLineContent = option.itemDescription && option.itemDescription.split('\n');
            // const newSplitLineContent = splitLineContent && splitLineContent.filter(el => el);
            return (
              <div className={cx(s.displayTableRow)}>
                <div className={cx(s.displayTableCell, s.padding2, s.checkboxSection, s.NHtype)}>
                  <CustomCheckbox
                    key={index}
                    className={'icheckbox_square-green'}
                    name={`${input.name}[${index}]`}
                    value={option.id}
                    checked={input.value.indexOf(option.id) !== -1}
                    onChange={(event) => {
                      const newValue = [...input.value];
                      if (event === true) {
                        newValue.push(option.id);
                      } else {
                        newValue.splice(newValue.indexOf(option.id), 1);
                      }
                      input.onChange(newValue);
                    }}
                  />
                </div>
                <div className={cx(s.displayTableCell, s.captionTitle, s.padding2, s.NhName, 'NhNameRtl')}>
                  {option.itemName}
                  <div>
                    {/* {
                      newSplitLineContent && newSplitLineContent.length > 0 && newSplitLineContent.map((itemValue, indexes) => (
                        <p className={s.dot} dangerouslySetInnerHTML={{ __html: itemValue }} />
                        ))
                    } */}
                    {/* {option.itemDescription} */}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  };

  render() {
    const { className, handleTabToggle, isExpand, smallDevice } = this.props;
    const { fieldsSettingsData: { roomType }, rent } = this.props;
    const { formatMessage } = this.props.intl;
    const rentList = [ {itemName: "Снасти", id: 29, isEnable: "1" }, {itemName: "Плавсредства", id: 50, isEnable: "1" }, {itemName: "Снегоход", id: 202, isEnable: "1" }];
    console.log('zaq',roomType)

    // let buttonLabel = formatMessage(messages.rent);
    let singlerent;

    // if (rent && rent.length > 0) {
    //   if (rent.length > 1) {
    //     buttonLabel = `${buttonLabel}	· ${rent.length}`;
    //   } else if (rent.length == 1) {
    //     singlerent = roomType.filter(item => item.id == rent[0]);
    //     if (singlerent && singlerent.length > 0) {
    //       buttonLabel = singlerent[0].itemName;
    //     } else {
    //       buttonLabel = `${buttonLabel}	· ${rent.length}`;
    //     }
    //   }
    // }

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || rent.length > 0) }, s.btn, s.responsiveFontsize, s.searchBtn)}
            onClick={() => handleTabToggle('rent', !isExpand)}
          >
            Аренда
          </Button>
        </div>
        {
          isExpand && <div className={cx(s.searchFilterPopover, 'searchFilterPopoverRtl')} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <Field
                name="rent"
                component={this.checkboxHorizontalGroup}
                options={rentList}
              />
              <div className={cx(s.searchFilterPopoverFooter, s.displayTable)}>
                <div className={cx('text-left', s.displayTableCell)}>
                  {/* <Button
                    bsStyle="link"
                    className={cx(s.btnLink)}
                    onClick={this.handleReset}>
                    <FormattedMessage {...messages.clear} />
                  </Button> */}
                </div>
                <div className={cx('text-right', s.displayTableCell, 'textAlignLeftRtl')}>
                  <Button
                    bsStyle="link"
                    className={cx(s.btnLink, s.applyBtn)}
                    onClick={this.handleSubmit}
                  >
                    <FormattedMessage {...messages.apply} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

Rent = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Rent);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = state => ({
  fieldsSettingsData: state.listingFields.data,
  rent: selector(state, 'rent'),
});

const mapDispatch = {
  change,
  submitForm,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Rent)));