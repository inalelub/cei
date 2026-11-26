'use client'

import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type TextFieldProps = Omit<React.ComponentProps<'input'>, 'id'> & {
  name: string
  label: string
  hint?: string
  errors?: string[]
  optional?: boolean
}

const inputClass =
  'h-10 w-full rounded-control border border-cei-border bg-white px-3.5 text-sm text-cei-ink outline-none transition-colors placeholder:text-cei-ink/40 focus:border-2 focus:border-cei-blue focus:px-[13px] aria-invalid:border-cei-error aria-invalid:bg-cei-error-tint/40'

export function TextField({ name, label, hint, errors, optional, className, ...props }: TextFieldProps) {
  const id = useId()
  const hasError = Boolean(errors?.length)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-cei-navy">
        {label}
        {optional ? <span className="ml-1 font-normal text-cei-gray">(optional)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClass} ${className ?? ''}`}
        {...props}
      />
      {hasError ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-cei-error">
          {errors!.join(' ')}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-cei-gray">{hint}</p>
      ) : null}
    </div>
  )
}

export function PasswordField({ name, label, hint, errors, ...props }: Omit<TextFieldProps, 'type' | 'optional'>) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const hasError = Boolean(errors?.length)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-cei-navy">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${inputClass} pr-11`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-cei-gray hover:text-cei-blue"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hasError ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-cei-error">
          {errors!.join(' ')}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-cei-gray">{hint}</p>
      ) : null}
    </div>
  )
}

export function SubmitButton({ pending, children, pendingLabel }: { pending: boolean; children: React.ReactNode; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-control bg-cei-blue px-4 text-sm font-semibold tracking-[0.03em] text-white uppercase shadow-[0_3px_1px_-2px_#00000033,0_2px_2px_#00000024,0_1px_5px_#0000001f] transition-colors hover:bg-cei-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cei-blue disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="rounded-control border border-cei-error/40 bg-cei-error-tint px-3.5 py-2.5 text-[13px] text-cei-error">
      {children}
    </div>
  )
}

/** Live checklist shown under the register password field. */
export function PasswordRules({ value }: { value: string }) {
  const rules = [
    { label: '8+ characters', ok: value.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(value) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(value) },
    { label: 'Number', ok: /[0-9]/.test(value) },
    { label: 'Special character', ok: /[^a-zA-Z0-9]/.test(value) },
  ]

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Password requirements">
      {rules.map((rule) => (
        <li key={rule.label} className={rule.ok ? 'text-cei-success' : 'text-cei-gray'}>
          {rule.ok ? '✓' : '•'} {rule.label}
        </li>
      ))}
    </ul>
  )
}
