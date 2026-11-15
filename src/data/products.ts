export type Product = { id: string; category: 'boxes' | 'tickets'; name: string; price: number; description: string; features: string[]; tag: string };
// Sample catalogue and prices for the university frontend.
export const products: Product[] = [
  { id: 'box-home', category: 'boxes', name: 'Everyday parcel box', price: 49, description: 'A dedicated home for your everyday deliveries.', features: ['Compact doorstep design', 'For smaller everyday parcels', 'One parcel box'], tag: 'THE EVERYDAY ESSENTIAL' },
  { id: 'box-plus', category: 'boxes', name: 'Parcel box plus', price: 89, description: 'A little more room for your delivery routine.', features: ['Larger parcel capacity', 'For busier households', 'One parcel box'], tag: 'A LITTLE MORE SPACE' },
  { id: 'ticket-single', category: 'tickets', name: 'Single delivery ticket', price: 5, description: 'Start with one ticket for your next parcel.', features: ['One delivery ticket', 'For occasional senders', 'Sample standard delivery option'], tag: 'ONE SIMPLE DELIVERY' },
  { id: 'ticket-pack', category: 'tickets', name: 'Five-ticket pack', price: 22, description: 'Keep your next few deliveries in mind.', features: ['Five delivery tickets', 'For regular senders', 'A convenient ticket bundle'], tag: 'PLAN AHEAD' },
];
export const formatPrice = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
