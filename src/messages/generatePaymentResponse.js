export async function generatePaymentResponse(id) {
  const reservation = await Reservation.update({
    paymentState: 'completed',
  },
    {
      where: {
        id,
      },
    });

  if (reservation) {
    return {
      status: 'updated',
    };
  }
  return {
    status: 'failed to update the reservation',
  };
}
