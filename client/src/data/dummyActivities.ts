import type { Activity } from '../types/index.ts';
import { generateGoogleMapsLink, generateAppleMapsLink } from '../utils/mapLinks';

const ORIGIN = 'Seattle, WA';

export const dummyActivities: Activity[] = [
  {
    id: 1,
    name: 'Woodland Park Zoo',
    emoji: '🦁',
    website: 'https://www.zoo.org',
    address: '5500 Phinney Ave N, Seattle, WA 98103',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '5500 Phinney Ave N, Seattle, WA 98103'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '5500 Phinney Ave N, Seattle, WA 98103'),
    description:
      'Perfect for your 5 and 8 year olds with over 1,000 animals across 92 acres. The zoo offers age-appropriate exhibits and interactive areas. Plan for 3-4 hours to explore. Open Saturday afternoons year-round.',
  },
  {
    id: 2,
    name: 'Pacific Science Center',
    emoji: '🔬',
    website: 'https://www.pacificsciencecenter.org',
    address: '200 2nd Ave N, Seattle, WA 98109',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '200 2nd Ave N, Seattle, WA 98109'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '200 2nd Ave N, Seattle, WA 98109'),
    description:
      'Hands-on science exhibits designed for elementary-aged children with live demonstrations and planetarium shows. Indoor facility perfect for any weather. Typical visit takes 2-3 hours. Great for curious minds.',
  },
  {
    id: 3,
    name: "Seattle Children's Museum",
    emoji: '🎨',
    website: 'https://www.thechildrensmuseum.org',
    address: '305 Harrison St, Seattle, WA 98109',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '305 Harrison St, Seattle, WA 98109'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '305 Harrison St, Seattle, WA 98109'),
    description:
      'Interactive exhibits focusing on global cultures, creative arts, and imaginative play. Perfect for kids under 10 with age-specific zones. Usually takes 2 hours to explore. Located at Seattle Center.',
  },
  {
    id: 4,
    name: 'Discovery Park',
    emoji: '🌳',
    website: 'https://www.seattle.gov/parks/find/parks/discovery-park',
    address: '3801 Discovery Park Blvd, Seattle, WA 98199',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '3801 Discovery Park Blvd, Seattle, WA 98199'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '3801 Discovery Park Blvd, Seattle, WA 98199'
    ),
    description:
      "Seattle's largest park with easy hiking trails, beach access, and lighthouse tours. Great for active families who love nature. Plan 2-4 hours depending on activities. Bring a picnic!",
  },
  {
    id: 5,
    name: 'Seattle Aquarium',
    emoji: '🐠',
    website: 'https://www.seattleaquarium.org',
    address: '1483 Alaskan Way, Seattle, WA 98101',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '1483 Alaskan Way, Seattle, WA 98101'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '1483 Alaskan Way, Seattle, WA 98101'),
    description:
      'Waterfront aquarium featuring Pacific Northwest marine life, touch tanks, and daily feeding shows. Perfect for all ages with special programs for kids. Expect 1.5-2 hours for a full visit.',
  },
  {
    id: 6,
    name: 'Alki Beach Park',
    emoji: '🏖️',
    website: 'https://www.seattle.gov/parks/find/parks/alki-beach-park',
    address: '1702 Alki Ave SW, Seattle, WA 98116',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '1702 Alki Ave SW, Seattle, WA 98116'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '1702 Alki Ave SW, Seattle, WA 98116'),
    description:
      'Beautiful beach with playground, walking paths, and stunning city views. Great for sandcastle building and outdoor fun. Free admission makes it budget-friendly. Best on sunny afternoons.',
  },
  {
    id: 7,
    name: 'KidsQuest Children Museum',
    emoji: '🧩',
    website: 'https://www.kidsquestmuseum.org',
    address: '1116 108th Ave NE, Bellevue, WA 98004',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '1116 108th Ave NE, Bellevue, WA 98004'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '1116 108th Ave NE, Bellevue, WA 98004'
    ),
    description:
      'Interactive museum in Bellevue with STEAM-focused exhibits and outdoor activities. Designed for kids 0-10 with special toddler area. Plan for 2-3 hours of hands-on learning and play.',
  },
  {
    id: 8,
    name: 'Ballard Locks',
    emoji: '⚓',
    website: 'https://www.nws.usace.army.mil/Missions/Civil-Works/Locks-and-Dams/Chittenden-Locks/',
    address: '3015 NW 54th St, Seattle, WA 98107',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '3015 NW 54th St, Seattle, WA 98107'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '3015 NW 54th St, Seattle, WA 98107'),
    description:
      'Watch boats navigate between Puget Sound and Lake Union, plus fish ladder with viewing windows. Free admission and educational. Great for 1-2 hours with nearby park for picnics.',
  },
  {
    id: 9,
    name: 'Remlinger Farms',
    emoji: '🎠',
    website: 'https://www.remlingerfarms.com',
    address: '32610 NE 32nd St, Carnation, WA 98014',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '32610 NE 32nd St, Carnation, WA 98014'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '32610 NE 32nd St, Carnation, WA 98014'
    ),
    description:
      'Family farm with amusement rides, petting zoo, and seasonal activities. Perfect for a full day outing with kids of all ages. Includes train rides and pony rides. Open weekends and holidays.',
  },
  {
    id: 10,
    name: 'Museum of Flight',
    emoji: '✈️',
    website: 'https://www.museumofflight.org',
    address: '9404 E Marginal Way S, Seattle, WA 98108',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '9404 E Marginal Way S, Seattle, WA 98108'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '9404 E Marginal Way S, Seattle, WA 98108'
    ),
    description:
      'One of the largest air and space museums with interactive exhibits and real aircraft. Kids can explore space shuttles and historic planes. Plan 2-4 hours. Educational and inspiring for young aviators.',
  },
  {
    id: 11,
    name: 'Green Lake Park',
    emoji: '🚴',
    website: 'https://www.seattle.gov/parks/find/parks/green-lake-park',
    address: '7201 East Green Lake Dr N, Seattle, WA 98115',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '7201 East Green Lake Dr N, Seattle, WA 98115'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '7201 East Green Lake Dr N, Seattle, WA 98115'
    ),
    description:
      'Popular park with 2.8-mile loop perfect for biking and walking. Playground, swimming beach, and boat rentals available. Great for active families. Can spend 2-4 hours enjoying outdoor activities.',
  },
  {
    id: 12,
    name: 'Imagine Children Museum',
    emoji: '🎭',
    website: 'https://www.imaginecm.org',
    address: '1502 Wall St, Everett, WA 98201',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '1502 Wall St, Everett, WA 98201'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '1502 Wall St, Everett, WA 98201'),
    description:
      'Creative play museum in Everett with art studio, rooftop playground, and themed exhibits. Perfect for ages 1-12 with indoor and outdoor spaces. Budget-friendly admission. Plan 2-3 hours.',
  },
  {
    id: 13,
    name: 'Point Defiance Zoo & Aquarium',
    emoji: '🐯',
    website: 'https://www.pdza.org',
    address: '5400 N Pearl St, Tacoma, WA 98407',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '5400 N Pearl St, Tacoma, WA 98407'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '5400 N Pearl St, Tacoma, WA 98407'),
    description:
      'Combined zoo and aquarium in Tacoma featuring exotic animals and marine life. Educational programs for kids and beautiful park setting. Full day activity with 4-5 hours needed to see everything.',
  },
  {
    id: 14,
    name: 'Seattle Public Library - Central',
    emoji: '📚',
    website: 'https://www.spl.org/hours-and-locations/central-library',
    address: '1000 4th Ave, Seattle, WA 98104',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '1000 4th Ave, Seattle, WA 98104'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '1000 4th Ave, Seattle, WA 98104'),
    description:
      "Stunning architectural landmark with amazing children's floor featuring story times and activities. Free admission makes it perfect for budget-conscious families. Plan 1-2 hours. Great for rainy days.",
  },
  {
    id: 15,
    name: 'Hiram M. Chittenden Locks Fish Ladder',
    emoji: '🐟',
    website: 'https://www.ballardlocks.org',
    address: '3015 NW 54th St, Seattle, WA 98107',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '3015 NW 54th St, Seattle, WA 98107'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '3015 NW 54th St, Seattle, WA 98107'),
    description:
      'Watch salmon swimming upstream through underwater viewing windows. Free and educational, especially during salmon runs. Combine with locks viewing for 1-2 hours of entertainment.',
  },
  {
    id: 16,
    name: 'Bellevue Botanical Garden',
    emoji: '🌺',
    website: 'https://bellevuebotanical.org',
    address: '12001 Main St, Bellevue, WA 98005',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '12001 Main St, Bellevue, WA 98005'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '12001 Main St, Bellevue, WA 98005'),
    description:
      'Beautiful 53-acre garden with stroller-friendly paths and seasonal displays. Free admission with special programs for families. Peaceful outdoor experience taking 1-2 hours. Great for nature-loving kids.',
  },
  {
    id: 17,
    name: 'Molbak Garden + Home',
    emoji: '🦋',
    website: 'https://www.molbaks.com',
    address: '13625 NE 175th St, Woodinville, WA 98072',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '13625 NE 175th St, Woodinville, WA 98072'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '13625 NE 175th St, Woodinville, WA 98072'
    ),
    description:
      'Year-round butterfly exhibit plus beautiful garden displays and holiday events. Kids love the free butterfly garden. Budget-friendly with 1-2 hours of enjoyment. Seasonal activities available.',
  },
  {
    id: 18,
    name: 'Gas Works Park',
    emoji: '🪁',
    website: 'https://www.seattle.gov/parks/find/parks/gas-works-park',
    address: '2101 N Northlake Way, Seattle, WA 98103',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '2101 N Northlake Way, Seattle, WA 98103'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '2101 N Northlake Way, Seattle, WA 98103'
    ),
    description:
      'Unique industrial park with great kite-flying hill and playground. Stunning lake and city views. Free admission with space to run and play. Perfect for 1-2 hours of outdoor fun.',
  },
  {
    id: 19,
    name: 'Snoqualmie Falls',
    emoji: '💦',
    website: 'https://www.snoqualmiefalls.com',
    address: '6501 Railroad Ave SE, Snoqualmie, WA 98065',
    googleMapsLink: generateGoogleMapsLink(
      ORIGIN,
      '6501 Railroad Ave SE, Snoqualmie, WA 98065'
    ),
    appleMapsLink: generateAppleMapsLink(
      ORIGIN,
      '6501 Railroad Ave SE, Snoqualmie, WA 98065'
    ),
    description:
      'Spectacular 268-foot waterfall with viewing platforms and short hiking trails. Free to visit with gift shop and cafe nearby. Easy 1-hour visit or longer with hiking. Great photo opportunities.',
  },
  {
    id: 20,
    name: 'Kelsey Creek Farm Park',
    emoji: '🐄',
    website: 'https://bellevuewa.gov/city-government/departments/parks/parks-and-trails/parks/kelsey-creek-farm',
    address: '410 130th Pl SE, Bellevue, WA 98005',
    googleMapsLink: generateGoogleMapsLink(ORIGIN, '410 130th Pl SE, Bellevue, WA 98005'),
    appleMapsLink: generateAppleMapsLink(ORIGIN, '410 130th Pl SE, Bellevue, WA 98005'),
    description:
      'Working farm with barnyard animals, playground, and walking trails. Free admission makes it perfect for families. Kids can pet animals and explore nature. Plan 1-2 hours for a fun farm experience.',
  },
];
