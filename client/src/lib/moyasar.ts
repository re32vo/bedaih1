type StartMoyasarPaymentInput = {
  amount: number;
  method: string;
  email?: string;
  name?: string;
  phone?: string;
  token?: string;
};

export async function startMoyasarPayment(input: StartMoyasarPaymentInput) {
  const response = await fetch("/api/moyasar/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(input.token ? { Authorization: `Bearer ${input.token}` } : {}),
    },
    body: JSON.stringify({
      amount: input.amount,
      method: input.method,
      email: input.email || "guest@donation.local",
      name: input.name,
      phone: input.phone,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "تعذر إنشاء عملية الدفع");
  }

  if (!data.paymentUrl) {
    throw new Error("لم يتم استلام رابط الدفع من ميسر");
  }

  sessionStorage.setItem(
    "pendingMoyasarDonation",
    JSON.stringify({
      amount: input.amount,
      email: input.email || undefined,
      name: input.name || undefined,
      phone: input.phone || undefined,
      method: input.method,
    }),
  );

  window.location.href = data.paymentUrl;
}
