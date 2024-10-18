import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateBetween from './DateBetween';

class CountDown extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { remaining: null };
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const startDate = new Date();
    const endDate = new Date(this.props.options.endDate);
    const remaining = DateBetween(startDate, endDate);

    if (remaining === false) {
      window.clearInterval(this.interval);
      this.props.options.cb ? this.props.options.cb() : false;
    }

    this.setState({
      remaining: remaining || null,
    });
  }

  render() {
    return (
      <span className="date"> {this.state.remaining}</span>
    );
  }
}

export default CountDown;
