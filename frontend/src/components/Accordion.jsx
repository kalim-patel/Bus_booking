import { useState } from "react";

export function AccordionItem({ id, question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white dark:hover:bg-slate-700/50"
        >
          <span>{question}</span>
          <span className="shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-400"
      >
        {answer}
      </div>
    </div>
  );
}

export function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem key={item.id || i} id={item.id || i} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
