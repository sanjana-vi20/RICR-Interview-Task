import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

const ShareModal = ({ onClose, formToken, formId, formTitle }) => {

  let baseUrl = window.location.origin;
  if (baseUrl.includes("localhost") && import.meta.env.VITE_PUBLIC_URL) {
    baseUrl = import.meta.env.VITE_PUBLIC_URL;
  }
  const cleanBase = baseUrl.replace(/\/+$/, "");

  const tokenOrId = formToken ;
  const formUrl = `${cleanBase}/fill-form/${tokenOrId}`;

  const qrRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    try {
      const canvas = qrRef.current?.querySelector("canvas");
      if (!canvas) {
        toast.error("QR Code canvas not found!");
        return;
      }

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${formTitle || "Feedback_Form"}_QR.png`;
      link.click();
      toast.success("QR Code image downloaded!");
    } catch (err) {
      console.error("QR Download Error:", err);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Share Feedback Form
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {formTitle || "Form Link & QR Code"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
          >
            <QRCodeCanvas
              value={formUrl}
              size={180}
              level="M"
              includeMargin={true}
            />
          </div>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="mt-3 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            📥 Download QR Code
          </button>
        </div>

        {/* Direct URL Input & Copy */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Public Form Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={formUrl}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600 font-medium outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
