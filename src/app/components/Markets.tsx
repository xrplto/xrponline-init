'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
}

const fakeMarketData: MarketData[] = [
  { symbol: 'XRP', price: 0.65, change: 2.5 },
  { symbol: 'BTC', price: 65432.10, change: -1.2 },
  { symbol: 'ETH', price: 3456.78, change: 5.7 },
];

export default function Markets() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="aol-button flex items-center gap-2"
      >
        <Image
          src="/chart.svg"
          alt="Chart icon"
          width={16}
          height={16}
          className="invert"
        />
        Markets
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="win98-window w-80">
            <div className="win98-title-bar">
              <span>Market Prices</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-[#f0f0f0]">
              {fakeMarketData.map((market) => (
                <div
                  key={market.symbol}
                  className="flex justify-between items-center mb-2 bg-white p-2 border border-gray-400"
                >
                  <span className="font-bold">{market.symbol}</span>
                  <div className="text-right">
                    <div>${market.price.toLocaleString()}</div>
                    <div
                      className={market.change >= 0 ? 'text-green-700' : 'text-red-700'}
                    >
                      {market.change >= 0 ? '+' : ''}
                      {market.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 