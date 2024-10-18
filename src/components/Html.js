import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { analytics } from '../config';
import { isRTL } from '../helpers/formatLocale';

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    styles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object,
    lang: PropTypes.string,
    children: PropTypes.string.isRequired,
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    state: null,
    lang: 'en',
  };
  render() {
    const { title, description, styles, scripts, state, lang, children, image } = this.props;
    const bodyClassName = isRTL(lang) ? 'rtl' : '';

    return (
      <html className="no-js" lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta httpEquiv="Cache-control" content="no-cache" />
          <title>Goodtrip</title>
          <meta name="description" content={"Рыбалка и отдых в Карелии. Прямая бронь и безопасный платеж"} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta name="twitter:card" content="photo" />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick-theme.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-swiper/swiper.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-swiper/swiper.min.css" />
          <link rel="stylesheet" href="/css/rentall-common.css" />
          <link rel="stylesheet" href="/css/min/dropzone.min.css" />
          <link rel="stylesheet" media="print" href="/css/print.css" />
          <link rel="stylesheet" type="text/css" href="/css/quill-snow.css" />
          <link rel="stylesheet" href="/css/rtl.css" />
          <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=82374b81-81ad-45e2-b8d2-4dfe666a175b&suggest_apikey=f29f7b82-0d4e-4e13-ba69-cf08cd68d116" async></script>
          <script dangerouslySetInnerHTML={{__html:'(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};   m[i].l=1*new Date();   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");   ym(92387837, "init", {        clickmap:true,        trackLinks:true,        accurateTrackBounce:true,        webvisor:true,        ecommerce:"dataLayer"    });'}}/>
          <script dangerouslySetInnerHTML={{__html:'var _tmr = window._tmr || (window._tmr = []); _tmr.push({id: "3372966", type: "pageView", start: (new Date()).getTime()}); (function (d, w, id) { if (d.getElementById(id)) return; var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id; ts.src = "https://top-fwz1.mail.ru/js/code.js"; var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);}; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }})(document, window, "tmr-code");' }}/>
          {
            isRTL(lang) && <link rel="stylesheet" id="rtl-style" href={'/css/rentall-rtl.min.css'} />
          }
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />,

          )}
      
        </head>
        <body className={bodyClassName}>
          <div
            id="app"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: children }}
          />
          {state && (
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html:
              `window.APP_STATE=${serialize(state, { isJSON: true })}` }}
            />
          )}
          {scripts.map(script => <script key={script} src={script} />)}
          {analytics.google.trackingId &&
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html:
              'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
              `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
            />

          }
          {analytics.google.trackingId &&
            <script src="https://www.google-analytics.com/analytics.js" async defer />
          }
          {/* <script id="stripe-js" src="https://js.stripe.com/v3/" async></script> */}
          {/* <script src="https://static.yoomoney.ru/checkout-js/v1/checkout.js"></script> */}
          <div dangerouslySetInnerHTML={{__html: '<noscript><div><img src="https://mc.yandex.ru/watch/92387837" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'}}/>
          <div dangerouslySetInnerHTML={{__html: '<noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3372966;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div></noscript>'}}/>
       </body>
      </html>
    );
  }
}

export default Html;
