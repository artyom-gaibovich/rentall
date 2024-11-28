import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Help.css';
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
import submitMap from '../../SearchForm/submitMap';

import CustomCheckbox from '../../../CustomCheckbox';

class Help extends Component {

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
    help: [],
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
    handleTabToggle('help', !isExpand, true);
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    change('help', [], true);
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
        handleTabToggle('help', !isExpand);
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
                <div className={cx(s.displayTableCell, s.padding4, s.checkboxSection, s.NHtype)}>
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
                <div className={cx(s.displayTableCell, s.captionTitle, s.padding4, s.NhName, 'NhNameRtl')}>
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
    const { fieldsSettingsData: { roomType }, help } = this.props;
    const { formatMessage } = this.props.intl;
    const helpList = [ {itemName: "Трансфер", id: 225, isEnable: "1" }, {itemName: "Егерь", id: 173, isEnable: "1" }, {itemName: "Помощник по хозяйству", id: 230, isEnable: "1" }];
    console.log('zaq',roomType)

    // let buttonLabel = formatMessage(messages.help);
    let singlehelp;

    // if (help && help.length > 0) {
    //   if (help.length > 1) {
    //     buttonLabel = `${buttonLabel}	· ${help.length}`;
    //   } else if (help.length == 1) {
    //     singlehelp = roomType.filter(item => item.id == help[0]);
    //     if (singlehelp && singlehelp.length > 0) {
    //       buttonLabel = singlehelp[0].itemName;
    //     } else {
    //       buttonLabel = `${buttonLabel}	· ${help.length}`;
    //     }
    //   }
    // }

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || help.length > 0) }, s.btn, s.responsiveFontsize, s.searchBtn)}
            onClick={() => handleTabToggle('help', !isExpand)}
          >
            В помощь
          </Button>
        </div>
        {
          isExpand && <div className={cx(s.searchFilterPopover, s.smallFilter, { [s.searchFilterPopoverFull]: smallDevice == true }, 'searchFilterPopoverRtl')} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <Field
                name="help"
                component={this.checkboxHorizontalGroup}
                options={helpList}
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

Help = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Help);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = state => ({
  fieldsSettingsData: state.listingFields.data,
  help: selector(state, 'help'),
});

const mapDispatch = {
  change,
  submitForm,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Help)));