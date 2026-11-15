import { FormEvent, useState } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRef } from 'react';

type EnquiryKind = 'driver' | 'franchise';


type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  availability: string;
  vehicle: string;
  investment: string;
  experience: string;
};

const initialForm: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  message: '',
  availability: '',
  vehicle: '',
  investment: '',
  experience: '',
};

export default function EnquiryForm({ kind }: { kind: EnquiryKind }) {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const submissionLock = useRef(false);
  const isDriver = kind === 'driver';
  const title = isDriver ? 'Drive with MyBox' : 'Bring MyBox to your community';
  const subtitle = isDriver ? 'Tell us a little about yourself and your availability. Our team will be in touch shortly.' : 'Interested in opening a MyBox location? Share a few details and we will send the next steps.';

  const update = (field: keyof FormValues, value: string) => setValues((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionLock.current) return;
    if ([values.fullName, values.email, values.phone, values.city, values.message].some(value => !value.trim())) {
      setError('Please complete all required fields.'); return;
    }
    submissionLock.current = true;
    setSubmitting(true); setError('');
    const details: Record<string, string> = isDriver ? { availability: values.availability, vehicle: values.vehicle, experience: values.experience } : { investment: values.investment, experience: values.experience };
    try {
    const { error: insertError } = await supabase.from('mybox_enquiries').insert({ kind, full_name: values.fullName.trim(), email: values.email.trim(), phone: values.phone.trim(), city: values.city.trim(), message: values.message.trim(), details });
    if (insertError) { setError('We could not send your enquiry. Please try again.'); return; }
    setSubmitted(true);
    } catch { setError('We could not connect. Please check your connection and try again.'); } finally { submissionLock.current = false; setSubmitting(false); }
  };

  if (submitted) return <div className="public-form-success" role="status"><span className="success-icon"><Check /></span><div className="eyebrow">Thank you</div><h2>Your next chapter starts here.</h2><p>We have received your enquiry. The MyBox team will be in touch to discuss the next steps.</p><button className="primary-button" onClick={() => { setSubmitted(false); setValues(initialForm); }}>Send another enquiry <ArrowRight size={17} /></button></div>;

  return <div className="public-enquiry-card"><div className="eyebrow">{isDriver ? 'Driver recruitment' : 'Franchise enquiry'}</div><h2>{title}</h2><p className="modal-subtitle">{subtitle}</p><form onSubmit={submit}><p className="public-form-note">All fields are required. Your details will be used to respond to this enquiry.</p><div className="form-grid"><Field label="Full name" value={values.fullName} onChange={(value) => update('fullName', value)} required /><Field label="Email address" type="email" value={values.email} onChange={(value) => update('email', value)} required /><Field label="Phone number" type="tel" value={values.phone} onChange={(value) => update('phone', value)} required /><Field label="City / postcode" value={values.city} onChange={(value) => update('city', value)} required /></div>{isDriver ? <div className="form-grid"><SelectField label="Availability" value={values.availability} options={['Full-time', 'Part-time', 'Weekends']} onChange={(value) => update('availability', value)} required /><SelectField label="Vehicle type" value={values.vehicle} options={['Car', 'Van', 'Motorbike', 'I will need support']} onChange={(value) => update('vehicle', value)} required /></div> : <div className="form-grid"><SelectField label="Investment range" value={values.investment} options={['Under GBP 10,000', 'GBP 10,000 - 25,000', 'GBP 25,000+']} onChange={(value) => update('investment', value)} required /><Field label="Relevant experience" value={values.experience} onChange={(value) => update('experience', value)} required /></div>}<label className="field full-field"><span>{isDriver ? 'Tell us about your experience' : 'Tell us about your location or idea'}</span><textarea value={values.message} onChange={(event) => update('message', event.target.value)} placeholder="Write your message here..." required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button form-submit" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send enquiry'} <ArrowRight size={17} /></button></form></div>;
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function SelectField({ label, value, options, onChange, required = false }: { label: string; value: string; options: string[]; onChange: (value: string) => void; required?: boolean }) {
  return <label className="field select-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} required={required}><option value="">Select one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={16} /></label>;
}






