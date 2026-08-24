"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, UploadCloud, Copy, CheckCircle2, Building2, Smartphone, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { submitPayment } from "@/actions/payments";
import { toast } from "sonner";

interface PaymentCheckoutProps {
  application: any;
  userEmail: string;
  userName: string;
  settings: any;
}

export function PaymentCheckoutClient({ application, userEmail, userName, settings }: PaymentCheckoutProps) {
  const router = useRouter();
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const pricingMap: Record<number, number> = {
    1: 99,
    2: 199,
    3: 299,
    6: 499,
  };

  const currentPrice = pricingMap[duration];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("applicationId", application.id);
      formData.append("enrollmentId", ""); 
      formData.append("amount", currentPrice.toString());

      await submitPayment(formData);
      
      toast.success("Payment details submitted successfully!");
      router.push("/dashboard?payment=pending_verification");
    } catch (error: any) {
      if (error.message === "DUPLICATE_TRANSACTION") {
        toast.error("This Transaction ID has already been submitted.");
      } else {
        toast.error(error.message || "Failed to submit payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resolve UPI IDs — handle both old `upi_id` and new `upi_id_primary` column names
  const upiPrimary = settings?.upi_id_primary || settings?.upi_id || "";
  const upiSecondary = settings?.upi_id_secondary || "";
  const payeeName = settings?.payee_name || settings?.account_holder_name || "CodeInternX";

  if (!settings) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Temporarily Unavailable</h2>
          <p className="text-sm text-muted-foreground">
            Payment details have not been configured yet. Please contact{" "}
            <a href="mailto:support@codeinternx.com" className="text-blue-600 underline">support@codeinternx.com</a>{" "}
            to complete your enrollment, or try again shortly.
          </p>
          <p className="text-xs text-slate-400">
            Admin: Configure payment details at <strong>Admin → Payment Settings</strong>.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="container max-w-5xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Complete Your Payment</h1>
        <p className="text-muted-foreground">Make a manual transfer using the official details below and upload your receipt for verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Payment Details & QR */}
        <div className="space-y-6">
          {/* Application Summary */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b pb-4">
              <CardDescription className="uppercase tracking-wider text-xs font-bold text-slate-500 mb-1">Application Summary</CardDescription>
              <CardTitle className="text-xl">{application.programs?.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm border-b pb-4">
                <span className="text-muted-foreground">Student Name</span>
                <span className="font-medium">{userName}</span>
              </div>
              
              <div className="pt-2">
                <label className="text-sm font-medium mb-2 block">Select Internship Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700 font-bold text-xl text-slate-900 dark:text-white">
                <span>Total Amount to Pay</span>
                <span>₹{currentPrice}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Details */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-900 dark:bg-slate-800 p-4 text-white">
              <h3 className="font-semibold flex items-center"><Building2 className="w-5 h-5 mr-2 text-blue-400" /> Bank Transfer</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Bank Name</p>
                <p className="font-medium">{settings.bank_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Account Holder</p>
                <p className="font-medium">{settings.account_holder_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold tracking-wider">{settings.account_number}</p>
                  <button onClick={() => handleCopy(settings.account_number, 'Account Number')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Copy account number">
                    {copied === 'Account Number' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">IFSC Code</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold tracking-wider">{settings.ifsc_code}</p>
                  <button onClick={() => handleCopy(settings.ifsc_code, 'IFSC Code')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Copy IFSC code">
                    {copied === 'IFSC Code' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UPI Details */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-purple-900 dark:bg-purple-800 p-4 text-white">
              <h3 className="font-semibold flex items-center"><Smartphone className="w-5 h-5 mr-2 text-purple-300" /> Pay Using UPI</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              {upiPrimary && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">UPI ID 1</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold tracking-wider">{upiPrimary}</p>
                    <button onClick={() => handleCopy(upiPrimary, 'UPI ID 1')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Copy UPI ID 1">
                      {copied === 'UPI ID 1' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              {upiSecondary && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">UPI ID 2</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold tracking-wider">{upiSecondary}</p>
                    <button onClick={() => handleCopy(upiSecondary, 'UPI ID 2')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Copy UPI ID 2">
                      {copied === 'UPI ID 2' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          {upiPrimary && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="bg-emerald-900 dark:bg-emerald-800 p-4 text-white">
                <h3 className="font-semibold flex items-center"><QrCode className="w-5 h-5 mr-2 text-emerald-300" /> Scan & Pay</h3>
              </div>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  {settings.payment_qr_code_url ? (
                    // Use uploaded official QR code image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.payment_qr_code_url} alt="Official Payment QR Code" className="w-48 h-48 object-contain" />
                  ) : (
                    // Generate QR dynamically from UPI intent
                    <QRCodeSVG 
                      value={`upi://pay?pa=${upiPrimary}&pn=${encodeURIComponent(payeeName)}&cu=INR&am=${currentPrice}`}
                      size={192}
                      level="H"
                      includeMargin={false}
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Scan this QR code with any UPI app to pay ₹{currentPrice}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {settings.instructions && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
              <strong>Important:</strong> {settings.instructions}
            </div>
          )}
        </div>

        {/* Right Col: Submission Form */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl border-t-4 border-t-slate-900 dark:border-t-blue-500 sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Submit Payment Proof</CardTitle>
              <CardDescription>Enter your transaction details after making the transfer.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method Used <span className="text-red-500">*</span></Label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    required
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select method</option>
                    <option value="UPI">UPI (GPay, PhonePe, Paytm, etc)</option>
                    <option value="IMPS">IMPS / NEFT Transfer</option>
                    <option value="BANK_DEPOSIT">Direct Bank Deposit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID / UTR Number <span className="text-red-500">*</span></Label>
                  <Input id="transactionId" name="transactionId" placeholder="e.g. 3019234857" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Date of Payment <span className="text-red-500">*</span></Label>
                    <Input id="paymentDate" name="paymentDate" type="date" required max={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTime">Time of Payment</Label>
                    <Input id="paymentTime" name="paymentTime" type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofFile">Upload Payment Screenshot <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group">
                    <Input 
                      id="proofFile" 
                      name="proofFile" 
                      type="file" 
                      accept="image/*,.pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      required
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-slate-600 mb-2 transition-colors" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG, or PDF (Max 5MB)</p>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-md mt-4" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                  {loading ? "Submitting..." : "Submit for Verification"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Your payment will be manually verified by our team within 24-48 hours. Falsifying payment proof may lead to application rejection.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
