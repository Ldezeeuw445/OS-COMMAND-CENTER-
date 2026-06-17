import { useMemo, useState } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const auth = useAuth();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => otp.length >= 6 && !submitting, [otp.length, submitting]);

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await auth.login(otp);
      setOtp("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#0b101a] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_0_30px_rgba(6,182,212,0.06)]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-300" />
          <h1 className="text-sm font-semibold text-white/85">OS Command Center Login</h1>
        </div>
        <p className="mt-2 text-[11px] text-white/45">
          Enter your OTP code to open the command center.
        </p>

        {(auth.error || auth.loading) && (
          <div className={`mt-3 rounded-md border px-2.5 py-2 text-[11px] ${auth.error ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-white/10 bg-white/[0.03] text-white/50"}`}>
            {auth.error || "Checking session..."}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <button
            type="button"
            onClick={() => void onSubmit()}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300 disabled:opacity-50"
          >
            <Lock size={11} />
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

