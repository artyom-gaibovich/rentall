import { Reservation, UserProfile, User, Listing, ListingData, ThreadItems } from '../../data/models';
import { sendEmail } from '../email/sendEmail';

export async function emailBroadcast(id, logo) {
  // Get Reservation Data
  const reservation = await Reservation.findOne({
    where: { id },
  });
  if (reservation) {
    // Get Host Data
    const host = await User.findOne({
      where: {
        id: reservation.hostId,
      },
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });
    // Get Guest Data
    const guest = await User.findOne({
      where: {
        id: reservation.guestId,
      },
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });
    // Get List Data
    const list = await Listing.findOne({
      where: {
        id: reservation.listId,
      },
      include: [
        {
          model: ListingData,
          as: 'listingData',
        },
      ],
    });

    const reservationId = reservation.id;
    const confirmationCode = reservation.confirmationCode;
    const hostEmail = host.email;
    const hostName = host.profile.firstName;
    const guestEmail = guest.email;
    const guestName = guest.profile.firstName;
    const checkIn = reservation.checkIn;
    const listTitle = list.title;

    // Send email to host
    const contentForHost = {
      reservationId,
      confirmationCode,
      hostName,
      guestName,
      listTitle,
      logo,
    };
    await sendEmail(hostEmail, 'bookingExpiredHost', contentForHost);

    // Send email to guest
    const contentForGuest = {
      reservationId,
      listTitle,
      guestName,
      checkIn,
      confirmationCode,
      logo,
    };
    await sendEmail(guestEmail, 'bookingExpiredGuest', contentForGuest);

    return {
      status: 'email is sent',
    };
  }
  return {
    status: 'failed to send email',
  };
}
