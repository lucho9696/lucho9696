import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface FieldShellProps {
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

function FieldShell({ label, error, hint, optional, children }: FieldShellProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-navy-900">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Opcional</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const CONTROL =
  'block w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-[border-color,box-shadow] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'

function controlState(invalid: boolean) {
  return invalid ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-line hover:border-slate-300'
}

type BaseProps = { label: string; error?: string; hint?: ReactNode; optional?: boolean }

export function TextField({ label, error, hint, optional, className = '', ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <input id={id} aria-invalid={invalid} aria-describedby={describedBy} className={`${CONTROL} h-12 ${controlState(invalid)} ${className}`} {...props} />
      )}
    </FieldShell>
  )
}

export function TextAreaField({ label, error, hint, optional, className = '', ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} aria-invalid={invalid} aria-describedby={describedBy} className={`${CONTROL} min-h-28 resize-y py-3 ${controlState(invalid)} ${className}`} {...props} />
      )}
    </FieldShell>
  )
}

export function SelectField({ label, error, hint, optional, className = '', children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <select id={id} aria-invalid={invalid} aria-describedby={describedBy} className={`${CONTROL} h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%20fill='%235a6a80'%3E%3Cpath%20d='M5.3%207.3a1%201%200%200%201%201.4%200L10%2010.6l3.3-3.3a1%201%200%201%201%201.4%201.4l-4%204a1%201%200%200%201-1.4%200l-4-4a1%201%200%200%201%200-1.4z'/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${controlState(invalid)} ${className}`} {...props}>
          {children}
        </select>
      )}
    </FieldShell>
  )
}
