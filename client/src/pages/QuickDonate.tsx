import { useState } from "react";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function QuickDonate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [, setLocation] = useLocation();

  const amounts = [50, 100, 250, 500, 1000, 2500];
  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = () => {
    if (!finalAmount || finalAmount <= 0) {
      alert('الرجاء اختيار مبلغ صحيح');
      return;
    }
    // Store the amount and navigate to donate page
    sessionStorage.setItem('quickDonateAmount', finalAmount.toString());
    setLocation('/donate');
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-0 pb-0 bg-white">
        <div className="w-full relative">
          <img src="https://h.top4top.io/p_3683pksu61.jpg" alt="بانر التبرع السريع" className="w-full h-64 object-cover object-center" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 mb-0">
          <div className="text-center space-y-6 bg-white bg-opacity-90 rounded-xl py-8 shadow">
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 text-sm font-medium">تبرع وغير الحياة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">
              كل ريال
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black max-w-3xl mx-auto">
              يحمل أملاً
            </h2>
          </div>
        </div>
      </section>

      {/* Amount Selection */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">اختر مبلغ التبرع</h2>
              <p className="text-slate-700">ادخل المبلغ الذي تود التبرع به</p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all font-bold ${
                    selectedAmount === amount && !customAmount
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-white hover:border-emerald-500/50 text-slate-700'
                  }`}
                >
                  ر.س {amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="max-w-md mx-auto w-full">
              <label className="block text-sm font-bold text-slate-900 mb-3">أو ادخل مبلغاً آخر</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="مثال: 100"
                  className="flex-1 px-4 py-3 border-2 border-slate-300 bg-white text-slate-900 rounded-lg focus:outline-none focus:border-emerald-500 text-lg"
                  min="1"
                />
                <span className="py-3 px-4 bg-slate-100 rounded-lg text-slate-900 font-semibold">ر.س</span>
              </div>
            </div>

            {/* Donate Button */}
            <div>
              <button
                onClick={handleDonate}
                disabled={!finalAmount || finalAmount <= 0}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-4 text-lg font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                تبرع الآن
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}






