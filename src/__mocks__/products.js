import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    createdAt: '27/03/2019',
    description: 'Long-Term Storage Credit | Maricopa Water District, Maricopa County, AZ',
    media: '/static/images/products/1.png',
    title: 'LTS Credit',
    type: 'Sale',
    totalDownloads: '156.34'
  },
  {
    id: uuid(),
    createdAt: '31/03/2019',
    description: 'Groundwater lease | Roosevelt Water District, Scott County, MN | 2 Year',
    media: '/static/images/products/2.png',
    title: 'Groundwater',
    type: 'Lease',
    totalDownloads: '16.15'
  },
  {
    id: uuid(),
    createdAt: '03/04/2019',
    description: 'Surface Water Rights | Eastwick Water Conservation Trust | California',
    media: '/static/images/products/3.png',
    title: 'Littoral',
    type: 'Lease',
    totalDownloads: '31.78'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Groundwater lease | King County Water District, King County, WA',
    media: '/static/images/products/4.jpg',
    title: 'Groundwater',
    type: 'Sale',
    totalDownloads: '44.67'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Pre-1914 Appropriative Rights (Rev-Share) | Boone County Water, KY',
    media: '/static/images/products/5.png',
    title: 'Riparian',
    type: 'Sale',
    totalDownloads: '93.45'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Littoral lease | Non-exclusive | Utah County Water Trust, Utah',
    media: '/static/images/products/6.png',
    title: 'Littoral',
    type: 'Lease',
    totalDownloads: '11.19'
  }
];
