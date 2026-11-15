import { ReactNode } from 'react';
export default function InfoCard({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return <article className="public-info-card"><div><span className="public-card-icon">{icon}</span><small>{number}</small></div><h3>{title}</h3><p>{text}</p></article>;
}
