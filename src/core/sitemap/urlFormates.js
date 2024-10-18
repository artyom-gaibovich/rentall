import {
    Listing,
} from '../../data/models';
import { formatURL } from '../../helpers/formatURL';

export async function listingURLs() {
  const dataItems = [];
  const data = await Listing.findAll({
    where: {
      isPublished: true,
    },
    raw: true,
  });

  if (data && data.length > 0) {
    await Promise.all(data.map(async (item) => {
      const title = formatURL(item.title);
      const listingURLData = `/rooms/${title}-${item.id}`;
      dataItems.push(listingURLData);
    }));
  }
  return dataItems;
}


export async function listURLs() {
  const dataItems = [];
  const data = await Listing.findAll({
    where: {
      isPublished: true,
    },
    raw: true,
  });

  if (data && data.length > 0) {
    await Promise.all(data.map(async (item) => {
      const listingURLData = `/rooms/${item.id}`;
      dataItems.push(listingURLData);
    }));
  }
  return dataItems;
}

