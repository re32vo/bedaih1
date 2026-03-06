import { useState } from "react";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function QuickDonate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [, setLocation] = useLocation();

  const quickAmounts = [100, 200, 300, 400, 500];
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
      {/* Hero Section with Mobile Phone */}
      <section className="relative py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 w-fit">
                <Heart className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 text-sm font-medium">تبرع وغير الحياة</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black leading-tight">
                  كل ريال
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                  يحمل أملاً
                </h2>
              </div>

              <p className="text-lg text-slate-600 max-w-md">
                تبرعك البسيط قد يكون سبباً في تغيير حياة أسرة كاملة. ساهم الآن وكن جزءاً من الحركة الخيرية.
              </p>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative h-96 sm:h-[500px] flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Phone Image */}
                <div className="bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-black">
                  <img
                    src="https://h.top4top.io/p_3683pksu61.jpg"
                    alt="App Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay Content on Phone */}
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 px-4">
                  {/* Logo */}
                  <div className="mb-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto"
                    >
                      <circle cx="20" cy="20" r="20" fill="#4ADE80" />
                      <path
                        d="M20 10L26 18H14L20 10Z"
                        fill="white"
                      />
                      <ellipse cx="20" cy="24" rx="6" ry="5" fill="white" />
                    </svg>
                  </div>

                  {/* Quick Amounts Buttons */}
                  <div className="flex gap-2 justify-center flex-wrap px-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        className="bg-black text-white rounded-full px-4 py-1 text-sm font-bold hover:bg-gray-800 transition"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  {/* Donate Button */}
                  <button className="bg-black text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-gray-800 transition">
                    تبـــــرع الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amount Selection Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2">
                اختر مبلغ التبرع
              </h2>
              <p className="text-slate-600 text-lg">
                أدخل المبلغ الذي تود التبرع به
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                    selectedAmount === amount && !customAmount
                      ? 'bg-black text-white border-2 border-black'
                      : 'bg-white text-black border-2 border-gray-300 hover:border-black'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="bg-white p-6 rounded-2xl mb-8">
              <p className="text-black font-bold mb-4">مبلغ مخصص</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="أدخل المبلغ"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black text-black placeholder-gray-400"
                  min="1"
                />
                <span className="px-4 py-3 bg-gray-100 rounded-xl text-black font-bold">
                  ر.س
                </span>
              </div>
            </div>

            {/* Donate Now Button */}
            <button
              onClick={handleDonate}
              disabled={!finalAmount || finalAmount <= 0}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              تبرع الآن
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-black mb-3">سريع وآمن</h3>
              <p className="text-slate-600">تبرعك في ثوانٍ معدودة عبر طرق دفع آمنة</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-black mb-3">بدون حد أدنى</h3>
              <p className="text-slate-600">لا يوجد حد أدنى للتبرع، اختر ما يناسبك</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-black mb-3">إيصال فوري</h3>
              <p className="text-slate-600">احصل على إيصال رسمي فوراً على بريدك الإلكتروني</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}






