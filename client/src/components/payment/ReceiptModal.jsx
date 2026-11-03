import React, { useRef, useState } from 'react';
import { IoCloseOutline, IoDownloadOutline, IoShareSocialOutline } from 'react-icons/io5';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const ReceiptModal = ({ isOpen, onClose, data }) => {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !data) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = receiptRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          const tempCanvas = clonedDoc.createElement('canvas');
          tempCanvas.width = 1;
          tempCanvas.height = 1;
          const ctx = tempCanvas.getContext('2d');

          const convertColor = (val) => {
            if (!val || typeof val !== 'string') return val;
            if (!val.includes('oklab') && !val.includes('oklch') && !val.includes('color(')) {
              return val;
            }
            try {
              ctx.fillStyle = '#ffffff';
              ctx.fillStyle = val;
              return ctx.fillStyle;
            } catch {
              return '#ffffff';
            }
          };

          const sanitizeNode = (node) => {
            if (node.nodeType !== 1) return;
            const computed = clonedDoc.defaultView
              ? clonedDoc.defaultView.getComputedStyle(node)
              : window.getComputedStyle(node);

            const colorProps = [
              'color',
              'backgroundColor',
              'borderColor',
              'borderTopColor',
              'borderRightColor',
              'borderBottomColor',
              'borderLeftColor',
              'outlineColor',
              'fill',
              'stroke',
            ];

            for (const prop of colorProps) {
              const val = computed[prop];
              if (val && (val.includes('oklab') || val.includes('oklch') || val.includes('color('))) {
                node.style[prop] = convertColor(val);
              }
            }

            if (computed.boxShadow && (computed.boxShadow.includes('oklab') || computed.boxShadow.includes('oklch'))) {
              node.style.boxShadow = 'none';
            }
            if (computed.textShadow && (computed.textShadow.includes('oklab') || computed.textShadow.includes('oklch'))) {
              node.style.textShadow = 'none';
            }

            for (let i = 0; i < node.children.length; i++) {
              sanitizeNode(node.children[i]);
            }
          };

          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.color = '#111827';
          clonedElement.style.boxShadow = 'none';
          sanitizeNode(clonedElement);
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${data.razorpay_order_id || 'order'}.pdf`);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download receipt.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const textToShare = `Receipt for Order ${data.razorpay_order_id}\nAmount Paid: ₹${data.amount}\nPayment ID: ${data.razorpay_payment_id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Receipt',
          text: textToShare,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        toast.success('Receipt details copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy receipt details.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Options */}
        <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Scrollable Receipt Area */}
        <div
          className="overflow-y-auto flex-1 p-6"
          ref={receiptRef}
          style={{ backgroundColor: '#ffffff', color: '#111827' }}
        >
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black" style={{ color: '#111827' }}>
              Payment Successful
            </h2>
            <p className="mt-1" style={{ color: '#6b7280' }}>
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div
              className="p-4 rounded-xl space-y-2 text-sm"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <div className="flex justify-between">
                <span style={{ color: '#6b7280' }}>Order ID</span>
                <span
                  className="font-semibold break-all ml-4 text-right"
                  style={{ color: '#1f2937' }}
                >
                  {data.razorpay_order_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6b7280' }}>Payment ID</span>
                <span
                  className="font-semibold break-all ml-4 text-right"
                  style={{ color: '#1f2937' }}
                >
                  {data.razorpay_payment_id}
                </span>
              </div>
            </div>

            <div
              className="border-t border-dashed pt-4"
              style={{ borderColor: '#e5e7eb' }}
            >
              <h3 className="font-bold mb-3" style={{ color: '#111827' }}>
                Order Details
              </h3>
              <div className="space-y-3">
                {data.items &&
                  data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span style={{ color: '#374151' }}>
                        {item.quantity}x {item.item.itemName}
                      </span>
                      <span className="font-semibold" style={{ color: '#1f2937' }}>
                        ₹{item.item.price * item.quantity}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div
              className="border-t pt-4 flex justify-between items-center"
              style={{ borderColor: '#e5e7eb' }}
            >
              <span className="text-lg font-bold" style={{ color: '#111827' }}>
                Total Paid
              </span>
              <span className="text-2xl font-black" style={{ color: '#ea580c' }}>
                ₹{data.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <IoDownloadOutline size={20} />
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-500/30"
          >
            <IoShareSocialOutline size={20} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
