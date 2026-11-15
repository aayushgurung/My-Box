import { Check, PackageCheck, Truck } from 'lucide-react';
export default function DeliveryVisual() { return (<div className="hero-visual">
            <div className="sun-disc" />
            <div className="route-line route-one" /><div className="route-line route-two" />
            <div className="parcel-card card-one"><PackageCheck size={20} /><div><strong>Parcel ready</strong><span>Box 24 / 10:42 AM</span></div><Check size={18} className="card-check" /></div>
            <div className="parcel-card card-two"><Truck size={22} /><div><strong>On the way</strong><span>Arriving in 18 min</span></div></div>
            <div className="delivery-box"><div className="box-glow" /><div className="box-top" /><div className="box-body"><span className="box-logo">M</span><span className="box-label">MYBOX<br /><small>LOCAL DELIVERY</small></span></div><div className="box-shadow" /></div>
            <div className="visual-caption"><span className="caption-number">01</span><span>One local box.<br /><strong>Many possibilities.</strong></span></div>
          </div>); }
