'use client';

const marketData = {
  price: 0.62,
  volume: 1234567,
  change24h: 2.5
} as const;

export default function Markets() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border-2 border-[#1f3973]">
        <h2 className="text-center font-bold mb-4 text-[#1f3973]">XRP MARKET DATA</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="font-bold text-[#1f3973]">Current Price:</span>
            <span className="text-right">${marketData.price.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="font-bold text-[#1f3973]">24h Volume:</span>
            <span className="text-right">${marketData.volume.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#1f3973]">24h Change:</span>
            <span className={`text-right ${marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
            </span>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-600">
        Data updates every 5 minutes
      </div>
    </div>
  );
} 