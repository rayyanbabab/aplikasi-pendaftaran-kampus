"use client"

import { Suspense } from "react"
import { OtpForm } from "@/components/auth/otp-form"

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OtpForm />
    </Suspense>
  )
}
