import { supabase } from '../supabase';
import type { EnquiryRow } from '../../types/database';

export type Enquiry = {
  id: string; kind: EnquiryRow['kind']; name: string; email: string; phone: string;
  city: string; status: EnquiryRow['status']; date: string; message: string;
  vehicle: string; availability: string; investment: string; experience: string; notes: string;
  details: Record<string, string>;
};
export function toEnquiry(row: EnquiryRow): Enquiry {
  const details = row.details || {};
  return { id: row.id, kind: row.kind, name: row.full_name, email: row.email,
    phone: row.phone, city: row.city, status: row.status, date: row.created_at.slice(0, 10),
    message: row.message, notes: row.notes, details, vehicle: details.vehicle || '',
    availability: details.availability || '', investment: details.investment || '', experience: details.experience || '' };
}
export async function getEnquiries() {
  const { data, error } = await supabase.from('mybox_enquiries').select('*').order('created_at', { ascending: false }).returns<EnquiryRow[]>();
  if (error) throw new Error('Could not load enquiries. Check your connection and database permissions.');
  return data.map(toEnquiry);
}
export async function updateEnquiry(value: Enquiry) {
  const { data, error } = await supabase.from('mybox_enquiries').update({
    full_name: value.name.trim(), email: value.email.trim(), phone: value.phone.trim(), city: value.city.trim(),
    message: value.message, status: value.status, notes: value.notes,
    details: { ...value.details, vehicle: value.vehicle, availability: value.availability, investment: value.investment, experience: value.experience },
  }).eq('id', value.id).select().returns<EnquiryRow[]>().single();
  if (error) throw new Error('Could not save this enquiry. Your changes are still in the form.');
  return toEnquiry(data);
}
export async function deleteEnquiry(id: string) {
  const { data, error } = await supabase.from('mybox_enquiries').delete().eq('id', id).select('id').single();
  if (error || !data) throw new Error('Could not delete this enquiry. Check your permissions and try again.');
}
