import {
  Reservation,
  UserProfile,
  User,
  Listing,
  ListingData,
  ThreadItems,
  SiteSettings,
} from '../../../../data/models';
import { sendEmail } from '../../../email/sendEmail';

export async function emailBroadcast(id) {
  // Get Reservation Data
  const reservation = await Reservation.findOne({
    where: { id },
  });

  let emailLogo,
    getEmailLogo;
  getEmailLogo = await SiteSettings.findOne({
    where: {
      title: 'Email Logo',
    },
    raw: true,
  });

  emailLogo = getEmailLogo && getEmailLogo.value;

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


    // Get Thread Data
    const threadData = await ThreadItems.findOne({
      where: { reservationId: id },
    });

    const reservationId = reservation.id;
    const confirmationCode = reservation.confirmationCode;
    const hostEmail = host.email;
    const hostName = host.profile.firstName;
    const guestEmail = guest.email;
    const guestName = guest.profile.firstName;
    const guestLastName = guest.profile.lastName;
    const guestLocation = guest.profile.location;
    const guestProfilePic = guest.profile.picture;
    const guestJoinedDate = guest.profile.createdAt;
    const checkIn = reservation.checkIn;
    const checkOut = reservation.checkOut;
    const guests = reservation.guests;
    const listTitle = list.title;
    const listCity = list.city;
    const allowedCheckInTime = list.listingData.checkInStart;
    const allowedCheckOutTime = list.listingData.checkInEnd;
    const basePrice = reservation.basePrice;
    const total = reservation.total;
    const hostServiceFee = reservation.hostServiceFee;
    const currency = reservation.currency;
    const isTour = reservation.isTour;
    let threadId;
    const insurance = reservation.insurance;
    const tax = reservation.tax;
    const guestServiceFee = reservation.guestServiceFee;
    let hostTotal = 0;
    if (threadData) {
      threadId = threadData.threadId;
    }

    // For Booking Request
    if (reservation.reservationState === 'pending') {
      // hostTotal = total - (insurance + tax + guestServiceFee);
      hostTotal = total;
      // Send email to host
      const contentForHost = {
        reservationId,
        confirmationCode,
        hostName,
        guestName,
        checkIn,
        checkOut,
        listTitle,
        basePrice,
        total: hostTotal,
        hostServiceFee,
        threadId,
        currency,
        logo: emailLogo,
      };
      if (!isTour) {
        await sendEmail(hostEmail, 'bookingRequest', contentForHost);
      } else {
        await sendEmail(hostEmail, 'bookingTourRequest', contentForHost);
      }
      // Send email to guest
      const contentForguest = {
        reservationId,
        confirmationCode,
        hostName,
        guestName,
        checkIn,
        listTitle,
        threadId,
        logo: emailLogo,
      };
      if (!isTour) {
        await sendEmail(guestEmail, 'bookingRequestGuest', contentForguest);
      } else {
        await sendEmail(guestEmail, 'bookingTourRequestGuest', contentForguest);
      }
    }

    if (reservation.reservationState === 'approved') {
      // Send email to host
      const contentForHost = {
        reservationId,
        threadId,
        confirmationCode,
        guestName,
        guestLastName,
        guestLocation,
        guestProfilePic,
        guestJoinedDate,
        checkIn,
        checkOut,
        guests,
        allowedCheckInTime,
        allowedCheckOutTime,
        logo: emailLogo,
      };
      await sendEmail(hostEmail, 'bookingConfirmedToHost', contentForHost);

      // Send email to guest
      const contentForguest = {
        reservationId,
        hostName,
        guestName,
        listTitle,
        listCity,
        threadId,
        logo: emailLogo,
      };
      await sendEmail(guestEmail, 'bookingConfirmedToGuest', contentForguest);
    }


    return {
      status: 'email is sent',
    };
  }
  return {
    status: 'failed to send email',
  };
}
