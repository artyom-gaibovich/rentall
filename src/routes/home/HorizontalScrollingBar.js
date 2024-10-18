import React, { Component } from 'react';
import s from './Home.css';

class HorizontalScrollingBar extends Component {
  render() {
    const headings = [
            { text: 'Трансфер на катере' }, // href: '/s?safetyAmenities=166' },
            { text: 'Встреча на машине' }, // href: '/s?safetyAmenities=225' },
            { text: 'Снасти в аренду' }, // href: '/s?safetyAmenities=226' },
            { text: 'Лицензии' }, // href: '/s?safetyAmenities=227' },
            // { text: 'Ягоды и Грибы', href: '/rooms/дом-в--лоухи-402' },
            { text: 'Доставка продуктов' }, // href: '/s?safetyAmenities=228'},
            { text: 'ГСМ' }, // href: '/s?safetyAmenities=229' },
            { text: 'Егерь' }, // href: '/s?safetyAmenities=173' },
            // { text: 'Аренда лодки', href: '/rooms/дом--в--поселке-софпорог-398' },
            // { text: 'Подводная рыбалка', href: '/link10' },
            // { text: 'Сплав Охота', href: '/rooms/дом-у-пяозеро-5-395' },
            // { text: 'Рафтинг', href: '/link12' },
            // { text: 'Экскурсии', href: '/rooms/дом--в--пяозерском-396' },
    ];

    return (
      <div className={s.scrollingContainer}>
        {headings.map((heading, index) => (
          <a
            key={index}
            className={s.scrollingItem}
            href={heading.href}
          >
            {heading.text}
          </a>
              ))}
      </div>
    );
  }
  }

export default HorizontalScrollingBar;
