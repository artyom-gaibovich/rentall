export function getSubject(type) {
  let subject,
    previewText;

  if (type === 'welcomeEmail' || type === 'confirmEmail') {
    subject = 'Пожалуйста, подтвердите адрес вашей электронной почты';
    previewText = 'Необходимое действие! Подтвердить ваш адрес электронной почты';
  }
  if (type === 'bookingRequest') {
    subject = 'У вас есть новое бронирование';
    previewText = 'Отличные новости! У вас есть новое бронирование';
  }
  if (type === 'bookingRequestGuest') {
    subject = 'Ваш запрос на бронирование отправлен хозяину';
    previewText = 'Отличные новости! Ваше бронирование доступно хозяину';
  }
  if (type === 'bookingConfirmedToHost') {
    subject = 'Вы подтвердили бронирование';
    previewText = 'Сведения о подтвержденном бронировании';
  }
  if (type === 'bookingConfirmedToGuest') {
    subject = 'Ваше бронирование подтверждено принимающей стороной';
    previewText = 'Пакуйте чемоданы, вы готовы к путешествию!';
  }
  if (type === 'bookingDeclinedToGuest') {
    subject = 'Ваш запрос на бронирование отклонен принимающей стороной';
    previewText = 'Сожалеем, ваш запрос отклонен';
  }
  if (type === 'bookingExpiredGuest') {
    subject = 'Срок действия вашего запроса на бронирование истек';
    previewText = 'Извините, срок действия вашего запроса истек';
  }
  if (type === 'bookingExpiredHost') {
    subject = 'Срок действия вашего бронирования истек';
    previewText = 'Срок действия вашего бронирования истек';
  }
  if (type === 'cancelledByHost') {
    subject = 'Ваше бронирование отменено хозяином';
    previewText = 'Ваше бронирование отменено';
  }
  if (type === 'cancelledByGuest') {
    subject = 'Ваше бронирование отменено гостем';
    previewText = 'Ваше бронирование отменено';
  }
  if (type === 'completedGuest') {
    subject = 'Пожалуйста, напишите коментарий о вашей поездке';
    previewText = 'Необходимое действие! Написать рецензию';
  }
  if (type === 'completedHost') {
    subject = 'Пожалуйста, напишите отзыв для вашего гостя';
    previewText = 'Необходимое действие! Написать рецензию';
  }
  if (type === 'forgotPasswordLink') {
    subject = 'Сбросить пароль';
    previewText = 'Необходимое действие! Сбросить пароль';
  }

  if (type === 'message') {
    subject = 'Вы получили новое сообщение';
    previewText = 'Кто-то отправил вам новое сообщение!';
  }

  if (type === 'inquiry') {
    subject = 'У вас есть новый запрос';
    previewText = 'Кто-то отправил вам запрос из контактной формы!';
  }

  if (type === 'documentVerification') {
    subject = 'Статус проверки документов';
    previewText = 'Статус проверки документов';
  }
  if (type === 'contact') {
    subject = 'Вы получили уведомление службы поддержки';
    previewText = 'Вы получили уведомление службы поддержки';
  }
  if (type === 'reportUser') {
    subject = 'Вы получили уведомление о нарушении пользователем';
    previewText = 'Вы получили уведомление о нарушении прав пользователя. Сообщение от кого-либо.';
  }
  if (type === 'bookingPreApproval') {
    subject = 'Хозяин предварительно одобрил ваш запрос';
    previewText = 'Бронирование предварительно одобрено';
  }

  if (type === 'banStatusServiceStatusBanned') {
    subject = 'Ваш аккаунт был отключен';
    previewText = 'Ваш аккаунт был отключен!';
  }
  if (type === 'banStatusServiceStatusUnBanned') {
    subject = 'Ваша учетная запись активирована';
    previewText = 'Ваша учетная запись активирована!';
  }
  if (type === 'contactSupport') {
    subject = 'Служба поддержки';
    previewText = 'Служба поддержки';
  }
  if (type === 'userFeedback') {
    subject = 'Отзывы клиентов';
    previewText = 'Отзывы клиентов';
  }

  return {
    subject,
    previewText,
  };
}
