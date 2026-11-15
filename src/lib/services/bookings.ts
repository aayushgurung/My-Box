import { supabase } from '../supabase';
import type { BookingRow } from '../../types/database';
export type Booking = Omit<BookingRow, 'created_at' | 'created_by'>;
export type BookingInput = Omit<Booking, 'id'>;

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from('mybox_bookings').select('*').order('date').order('time').returns<BookingRow[]>();
  if (error) throw new Error('Could not load bookings. Check your connection and database permissions.');
  return data;
}
export async function saveBooking(value: BookingInput, id?: string): Promise<Booking> {
  const payload = { customer: value.customer.trim(), email: value.email.trim(), phone: value.phone.trim(), pickup: value.pickup.trim(), destination: value.destination.trim(), date: value.date, time: value.time, size: value.size, notes: value.notes, status: value.status };
  const query = id ? supabase.from('mybox_bookings').update(payload).eq('id', id) : supabase.from('mybox_bookings').insert(payload);
  const { data, error } = await query.select().returns<BookingRow[]>().single();
  if (error) throw new Error('Could not save this booking. Your changes are still in the form.');
  return data;
}
export async function deleteBooking(id: string) {
  const { data, error } = await supabase.from('mybox_bookings').delete().eq('id', id).select('id').single();
  if (error || !data) throw new Error('Could not delete this booking. Check your permissions and try again.');
}
