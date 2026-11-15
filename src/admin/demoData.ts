export type Enquiry = {
  id: string; kind: 'driver' | 'franchise'; name: string; email: string; phone: string;
  city: string; status: 'New' | 'In review' | 'Contacted' | 'Approved' | 'Closed';
  date: string; message: string; vehicle: string; availability: string; investment: string; experience: string; notes: string;
};
export type Booking = { id: string; customer: string; email: string; phone: string; pickup: string; destination: string; date: string; time: string; size: string; notes: string; status: string };
const base = { notes: '', vehicle: '', availability: '', investment: '', experience: '' };
export const demoEnquiries: Enquiry[] = [
  { ...base, id: 'DR-1042', kind: 'driver', name: 'Oliver Bennett', email: 'oliver@example.com', phone: '0400 000 101', city: 'Sydney', status: 'New', date: '2026-11-15', vehicle: 'Van', availability: 'Weekdays', message: 'Interested in local delivery routes. I have my own van and a full licence.' },
  { ...base, id: 'FR-2038', kind: 'franchise', name: 'Amelia Wilson', email: 'amelia@example.com', phone: '0400 000 102', city: 'Melbourne', status: 'In review', date: '2026-11-14', investment: '$50,000–$100,000', experience: '5 years in retail operations', message: 'I would love to open a MyBox location in my community.' },
  { ...base, id: 'DR-1041', kind: 'driver', name: 'Noah Williams', email: 'noah@example.com', phone: '0400 000 103', city: 'Brisbane', status: 'Contacted', date: '2026-11-14', vehicle: 'Car', availability: 'Weekends', message: 'Looking for flexible weekend delivery work.' },
  { ...base, id: 'FR-2037', kind: 'franchise', name: 'Charlotte Lee', email: 'charlotte@example.com', phone: '0400 000 104', city: 'Sydney', status: 'New', date: '2026-11-13', investment: '$100,000+', experience: 'Small business owner', message: 'Please share the requirements for becoming a franchise partner.' },
  { ...base, id: 'DR-1040', kind: 'driver', name: 'Leo Martin', email: 'leo@example.com', phone: '0400 000 105', city: 'Perth', status: 'Approved', date: '2026-11-12', vehicle: 'Van', availability: 'Full time', message: 'Experienced courier available for full-time routes.' },
  { ...base, id: 'FR-2036', kind: 'franchise', name: 'Isla Thompson', email: 'isla@example.com', phone: '0400 000 106', city: 'Adelaide', status: 'Contacted', date: '2026-11-11', investment: '$50,000–$100,000', experience: 'Logistics management', message: 'Interested in bringing MyBox to Adelaide.' },
];
export const demoBookings: Booking[] = [
  { id: 'BK-3002', customer: 'James Parker', email: 'james@example.com', phone: '0400 000 201', pickup: '12 George Street, Sydney', destination: '45 King Street, Newtown', date: '2026-11-16', time: '10:00', size: 'Medium parcel', notes: 'Ring the doorbell on arrival.', status: 'Scheduled' },
  { id: 'BK-3001', customer: 'Sophie Taylor', email: 'sophie@example.com', phone: '0400 000 202', pickup: '8 Collins Street, Melbourne', destination: '22 Smith Street, Fitzroy', date: '2026-11-16', time: '14:30', size: 'Small parcel', notes: '', status: 'Scheduled' },
];

