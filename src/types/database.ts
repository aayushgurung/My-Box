export type EnquiryStatus = 'New' | 'In review' | 'Contacted' | 'Approved' | 'Closed';
export type BookingStatus = 'Scheduled' | 'In transit' | 'Delivered' | 'Cancelled';
export type EnquiryRow = {
  id: string; kind: 'driver' | 'franchise'; full_name: string; email: string;
  phone: string; city: string; message: string; details: Record<string, string>;
  status: EnquiryStatus; notes: string; created_at: string;
};
export type BookingRow = {
  id: string; customer: string; email: string; phone: string; pickup: string;
  destination: string; date: string; time: string; size: string; notes: string;
  status: BookingStatus; created_by: string; created_at: string;
};
type Table<Row, Insert> = { Row: Row; Insert: Insert; Update: Partial<Insert>; Relationships: [] };
export type Database = {
  public: {
    Tables: {
      mybox_enquiries: Table<EnquiryRow, Pick<EnquiryRow, 'kind' | 'full_name' | 'email' | 'phone' | 'city'> & Partial<EnquiryRow>>;
      mybox_bookings: Table<BookingRow, Pick<BookingRow, 'customer' | 'email' | 'phone' | 'pickup' | 'destination' | 'date' | 'time' | 'size'> & Partial<BookingRow>>;
      mybox_admins: Table<{ user_id: string; created_at: string }, { user_id: string; created_at?: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
