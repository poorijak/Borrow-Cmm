import { ActiveStatus } from '@prisma/client';

export const course = [
  // ===== Year 1 =====
  {
    code: 'CMM101',
    label: 'Mathematics for Multimedia',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM102',
    label: 'Foundation of Programming and Software Development',
    status: ActiveStatus.active,
  },
  { code: 'CMM110', label: 'Basic Art', status: ActiveStatus.active },
  { code: 'CMM111', label: 'Design Fundamentals', status: ActiveStatus.active },

  {
    code: 'CMM112',
    label: 'Graphic Design Layout and Digital Art',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM113',
    label: 'Photography for Multimedia',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM114',
    label: 'Digital Character Creation',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM120',
    label: 'Object-Oriented Programming Essentials',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM121',
    label: 'Database Management System',
    status: ActiveStatus.active,
  },

  // ===== Year 2 =====
  {
    code: 'CMM201',
    label: 'Motion Graphics and Sound Design',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM210',
    label: 'Digital Video and Sound Production',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM212',
    label: 'User Experience and Interface Design',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM214',
    label: '3D Animation Fundamentals',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM222',
    label: 'Information System Analysis and Design',
    status: ActiveStatus.active,
  },

  {
    code: 'CMM215',
    label: '3D Modeling Setup and Animation Workflow',
    status: ActiveStatus.active,
  },
  { code: 'CMM221', label: 'Web Development', status: ActiveStatus.active },
  {
    code: 'CMM231',
    label: 'Interactive Embedded Hardware',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM240',
    label: 'Digital Marketing Strategies',
    status: ActiveStatus.active,
  },

  // ===== Year 3 =====
  {
    code: 'CMM301',
    label: 'Game Design and Development',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM311',
    label: 'Interactive Learning Media',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM320',
    label: 'Smart Device Application Development',
    status: ActiveStatus.active,
  },

  { code: 'CMM321', label: 'AI for Multimedia', status: ActiveStatus.active },
  {
    code: 'CMM340',
    label: 'Business Intelligence and Data Analytics',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM380',
    label: 'Professional Practices in Multimedia Technology',
    status: ActiveStatus.active,
  },
  {
    code: 'CMM399',
    label: 'Project Study in Multimedia Technology',
    status: ActiveStatus.active,
  },
];
