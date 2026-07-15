interface AIRechargeModalProps {
  rechargeAmount: number;
  setRechargeAmount: (amount: number) => void;
  setShowRecharge: (show: boolean) => void;
  rechargeAiQuota: (amount: number) => Promise<any>;
  navigate: (path: string) => void;
}

export default function AIRechargeModal({
  rechargeAmount,
  setRechargeAmount,
  setShowRecharge,
  rechargeAiQuota,
  navigate
}: AIRechargeModalProps) {

  const handleRecharge = () => {
    rechargeAiQuota(rechargeAmount).then(res => {
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        setShowRecharge(false);
      }
    }).catch(err => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
      console.error(err);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-surface-variant">
        <h3 className="text-xl font-bold mb-3 text-on-surface">Recharge AI Messages</h3>
        <p className="mb-5 text-sm text-on-surface-variant font-medium leading-relaxed">You have run out of AI messages. Recharge now for 10.00 EGP per 20 messages.</p>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-on-surface">Amount (EGP)</label>
          <select 
            className="w-full border border-surface-variant rounded-xl p-3 text-sm text-on-surface font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-container"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(Number(e.target.value))}
          >
            <option value={10}>10.00 EGP (20 Messages)</option>
            <option value={20}>20.00 EGP (40 Messages)</option>
            <option value={30}>30.00 EGP (60 Messages)</option>
            <option value={50}>50.00 EGP (100 Messages)</option>
          </select>
        </div>
        <div className="flex gap-3 justify-end">
          <button 
            className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-xl hover:bg-surface-container"
            onClick={() => setShowRecharge(false)}
          >
            Cancel
          </button>
          <button 
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
            onClick={handleRecharge}
          >
            Recharge via Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
