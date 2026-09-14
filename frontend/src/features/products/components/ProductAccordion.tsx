import { useState } from 'react';

interface AccordionItem {
  title: string;
  body: string;
}

export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="pd-accordion">
      {items.map((item, i) => (
        <div key={item.title} className={`pd-acc-item${openIndex === i ? ' open' : ''}`}>
          <button
            type="button"
            className="pd-acc-head"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {item.title} <span className="pd-acc-icon">{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && <div className="pd-acc-body">{item.body}</div>}
        </div>
      ))}
    </div>
  );
}
