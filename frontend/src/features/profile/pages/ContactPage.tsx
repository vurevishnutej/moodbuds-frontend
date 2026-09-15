import { useEffect, useState } from 'react';
import { useToast } from '../../../app/providers/ToastProvider';
import { siteContentService, type ContactContent } from '../../content/services/siteContentService';

const SUPPORT_CARDS = [
  { ico: '⊞', label: 'Live Chat', value: 'Chat now', desc: 'Available 9am–11pm daily' },
  { ico: '◎', label: 'Track Order', value: 'Order status', desc: 'Real-time tracking' },
];

export function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState<ContactContent | null>(null);
  const toast = useToast();

  useEffect(() => { void siteContentService.contact().then(setContact).catch(() => undefined); }, []);

  const contactCards = [
    { ico: '✉', label: 'Email', value: contact?.supportEmail || 'Loading…', desc: 'Send us a note anytime' },
    { ico: '☏', label: 'Phone', value: contact?.supportPhone || 'Loading…', desc: contact?.supportHours || 'Checking support hours…' },
    ...SUPPORT_CARDS,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent — we\u2019ll get back to you soon');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Contact Us</div>
        <div className="prof-panel-sub">We&apos;re here to help — always</div>
      </div>
      <div className="prof-box">
        <div className="contact-grid">
          {contactCards.map((c) => (
            <div className="contact-card" key={c.label}>
              <div className="contact-ico">{c.ico}</div>
              <div className="contact-label">{c.label}</div>
              <div className="contact-value">{c.value}</div>
              <div className="contact-desc">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="prof-box-head" style={{ marginTop: 8 }}>Send a Message</div>
        <form className="contact-form prof-form" onSubmit={handleSubmit}>
          <div className="prof-form-row">
            <div className="prof-field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="prof-field">
              <label>Order ID (optional)</label>
              <input type="text" placeholder="#MBD-XXXXXX" />
            </div>
          </div>
          <div className="prof-field">
            <label>Message</label>
            <textarea
              placeholder="Describe your issue…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="prof-save-btn" type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
