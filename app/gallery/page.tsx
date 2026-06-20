'use client';

import { useState } from 'react';
import Gallery from '@/components/Gallery';

const events = [
  {
    name: 'GLIMPSES OF AUTOMECHANICA DUBAI 2022',
    images: Array.from(
      { length: 22 },
      (_, i) =>
        `/images/GLIMPSES OF AUTOMECHANICA DUBAI 2022/AUTOMECHANI-A-DUBAI-2022-img-${i + 1}.jpeg`
    ),
  },
  {
    name: 'GLIMPSES OF AUTOMEC BRAZIL 2023',
    images: Array.from(
      { length: 8 },
      (_, i) =>
        `/images/GLIMPSES OF AUTOMEC BRAZIL 2023/AUTOMEC-BRAZIL-2023-img-${i + 1}.jpeg`
    ),
  },
  {
    name: 'GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023',
    images: Array.from(
      { length: 30 },
      (_, i) =>
        `/images/GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023/IMG_dubai_${i + 1}.jpeg`
    ),
  },
  {
    name: 'AUTOMECHANIKA-HO-CHI-MINH CITY 2023',
    images: Array.from(
      { length: 24 },
      (_, i) =>
        `/images/AUTOMECHANIKA-HO-CHI-MINH CITY 2023/AUTOMECHANIKA-HO-CHI-MINH-img-${i + 1}.jpeg`
    ),
  },
  {
  name: 'GLIMPSES OF AUTOMECHANICA DUBAI 2019',
  images: Array.from(
    { length: 18 },
    (_, i) =>
      `/images/GLIMPSES OF AUTOMECHANICA DUBAI 2019/GLIMPSES-OF-AUTOMECHANIC-A-DUBAI-2019-img-${i + 1}.jpg`
  ),
},
];

export default function GalleryPage() {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    <Gallery
      events={events}
      selectedEvent={selectedEvent}
      setSelectedEvent={setSelectedEvent}
    />
  );
}