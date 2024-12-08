'use client';

import { useEffect, useState } from 'react';

interface Trade {
  base_amount: number;
  counter_amount: number;
  rate: number;
  executed_time: string;
  buyer: string;
  seller: string;
  tx_hash: string;
}

export default function LatestBuys() {
  const [latestBuy, setLatestBuy] = useState<Trade | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatBuyerAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchLatestBuy = async () => {
      try {
        const url = 'https://data.xrplf.org/v1/iou/exchanges/r3q4Hhc7pSc4rGNMc1mLkzQECW4bhTnPVp_5852504F6E6C696E650000000000000000000000/XRP?limit=10&descending=true';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        const firstBuy = data.find((trade: Trade) => 
          trade.seller === 'rQJwonL7jgjHqEfMSYQmvV8RHyjRn1XM3f'
        );
        
        setLatestBuy(firstBuy || null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching latest buy:', error);
        setIsLoading(false);
      }
    };

    fetchLatestBuy();
    const interval = setInterval(fetchLatestBuy, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-2">
        <div className="flex items-center">
          <div className="text-[10px] font-bold mr-4">LATEST BUY:</div>
          <div className="animate-pulse h-3 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-2">
      <div className="flex items-center">
        <div className="text-[10px] font-bold mr-4">LATEST BUY:</div>
        {latestBuy ? (
          <div className="text-[10px] flex items-center space-x-2">
            <a 
              href={`https://xrpscan.com/tx/${latestBuy.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              {new Date(latestBuy.executed_time).toLocaleTimeString()}
            </a>
            <span className="font-bold text-green-600">
              {latestBuy.base_amount.toFixed(2)} XPO
            </span>
            <span className="text-gray-600">
              ({latestBuy.counter_amount.toFixed(2)} XRP)
            </span>
            <span className="text-blue-600">
              by {formatBuyerAddress(latestBuy.buyer)}
            </span>
          </div>
        ) : (
          <div className="text-[10px] text-gray-500">No recent buys</div>
        )}
      </div>
    </div>
  );
} 