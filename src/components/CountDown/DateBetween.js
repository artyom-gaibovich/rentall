const DateBetween = function (startDate, endDate) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const distance = endDate - startDate;

  if (distance < 0) {
    return false;
  }

  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / second);


  const between = [];

  // days > 0 ? between.push(`${days} : `) : false;
  hours > 0 ? between.push(`${hours} : `) : between.push('00');
  minutes > 0 ? between.push(`${minutes} : `) : between.push('00');
  seconds > 0 ? between.push(`${seconds}`) : between.push('00');

  return between.join(' ');
};

module.exports = DateBetween;
