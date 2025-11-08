export default function CheckEmailPage() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Check your email</h1>
      <p className="text-sm text-slate-500">
        We have sent a magic link. Open it on this device to finish signing in.
      </p>
    </div>
  );
}
