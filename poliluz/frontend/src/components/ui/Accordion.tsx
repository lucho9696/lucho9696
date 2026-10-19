import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

export interface AccordionItem {
  question: string
  answer: string
}

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, index) => {
        const expanded = open === index
        const buttonId = `${baseId}-button-${index}`
        const panelId = `${baseId}-panel-${index}`
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 transition-colors hover:bg-surface/70 sm:px-6"
              >
                {item.question}
                <span className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${expanded ? 'rotate-180 bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
                  <ChevronDown className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden" inert={!expanded}>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
