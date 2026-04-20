import { useLocation } from "wouter";
import { ShoppingCart, Trash2, Plus, Minus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, clearCart, getTotalAmount, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 py-10" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">سلة التبرعات</h1>
            <p className="text-slate-600">سلتك فارغة حالياً</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center space-y-6"
          >
            <ShoppingCart className="w-24 h-24 mx-auto text-slate-300" />
            <p className="text-lg text-slate-600">لم تقم بإضافة أي مشاريع للسلة بعد</p>
            <Button 
              type="button" 
              onClick={() => setLocation("/donate/opportunities")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              تصفح فرص التبرع
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const donationTypeLabels = {
    single: 'تبرع واحد',
    quick: 'تبرع سريع',
    recurring: 'تبرع دوري'
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 md:py-10" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">سلة التبرعات</h1>
            <p className="text-slate-600 mt-1">لديك {getTotalItems()} {getTotalItems() === 1 ? 'منتج' : 'منتجات'} في السلة</p>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setLocation("/donate/opportunities")}
          >
            متابعة التسوق
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.amount}-${item.donationType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{donationTypeLabels[item.donationType]}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.amount)}
                        className="text-red-500 hover:text-red-700 transition p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 border border-slate-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.amount, item.quantity - 1)}
                          className="p-2 hover:bg-slate-100 transition"
                        >
                          <Minus className="h-4 w-4 text-slate-600" />
                        </button>
                        <span className="px-3 font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.amount, item.quantity + 1)}
                          className="p-2 hover:bg-slate-100 transition"
                        >
                          <Plus className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>

                      <div className="text-left">
                        <p className="text-xl font-black text-slate-800">{item.amount * item.quantity} ر.س</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-500">{item.amount} ر.س × {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
              <h2 className="text-xl font-extrabold text-slate-800 mb-4">ملخص السلة</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-700">
                  <span>عدد المنتجات:</span>
                  <span className="font-bold">{getTotalItems()}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-slate-800">الإجمالي:</span>
                  <span className="text-2xl font-black text-emerald-600">{getTotalAmount()} ر.س</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  type="button"
                  onClick={() => setLocation("/checkout")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12"
                >
                  <Heart className="w-5 h-5 ml-2" />
                  إتمام التبرع
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={clearCart}
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  إفراغ السلة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
