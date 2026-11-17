'use client'

import { useState } from 'react'
import { getBirthDateFromIdNumber } from '@/lib/definitions'

/** Client-side check for a South African ID number (13 digits + valid YYMMDD birth date). */
export function useIdNumberCheck(onValid?: (idNumber: string) => void) {

  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function check(raw: string) {

    const idNumber = raw.trim()
    setNotice(null)

    if (!/^\d{13}$/.test(idNumber)) {
      setError('Enter your 13-digit South African ID number.')
      return
    }

    if (getBirthDateFromIdNumber(idNumber) === null) {
      setError('That ID number does not start with a valid birth date (YYMMDD).')
      return
    }

    setError(null)

    if (onValid) onValid(idNumber)
    else setNotice('Registration lookup is not connected yet.')
  }

  return { error, notice, check }
}
