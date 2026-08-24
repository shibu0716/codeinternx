"use client";

import { useState } from "react";
import { updatePaymentSettings } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Loader2, Building2, Smartphone, QrCode } from "lucide-react";

export function PaymentSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await updatePaymentSettings(formData);
      
      if (result.success) {
        toast.success("Payment settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* Bank Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bank Transfer Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="account_holder_name">Account Holder Name <span className="text-red-500">*</span></Label>
            <Input id="account_holder_name" name="account_holder_name" defaultValue={initialSettings?.account_holder_name || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name <span className="text-red-500">*</span></Label>
            <Input id="bank_name" name="bank_name" defaultValue={initialSettings?.bank_name || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number <span className="text-red-500">*</span></Label>
            <Input id="account_number" name="account_number" defaultValue={initialSettings?.account_number || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ifsc_code">IFSC Code <span className="text-red-500">*</span></Label>
            <Input id="ifsc_code" name="ifsc_code" defaultValue={initialSettings?.ifsc_code || ''} required />
          </div>
        </div>
      </div>

      {/* UPI Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">UPI Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="payee_name">UPI Payee Name <span className="text-red-500">*</span></Label>
            <Input id="payee_name" name="payee_name" defaultValue={initialSettings?.payee_name || ''} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upi_id_primary">Primary UPI ID <span className="text-red-500">*</span></Label>
            <Input id="upi_id_primary" name="upi_id_primary" defaultValue={initialSettings?.upi_id_primary || initialSettings?.upi_id || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="upi_id_secondary">Secondary UPI ID (Optional)</Label>
            <Input id="upi_id_secondary" name="upi_id_secondary" defaultValue={initialSettings?.upi_id_secondary || ''} />
          </div>
        </div>
      </div>

      {/* QR Code & Instructions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">QR Code & Instructions</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_qr_code_url">QR Code Image URL (Optional)</Label>
            <Input id="payment_qr_code_url" name="payment_qr_code_url" defaultValue={initialSettings?.payment_qr_code_url || ''} placeholder="https://..." />
            <p className="text-xs text-slate-500">Provide an official QR Code image URL to display. If left blank, a QR code will be generated automatically based on the Primary UPI ID.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Payment Instructions</Label>
            <Textarea 
              id="instructions" 
              name="instructions" 
              rows={4}
              defaultValue={initialSettings?.instructions || 'Please make your payment only to the official CodeInternX payment details displayed above. After completing the payment, enter your transaction/UTR number and upload your payment receipt or screenshot for manual verification.'} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Save Payment Details</>
          )}
        </Button>
      </div>
    </form>
  );
}
