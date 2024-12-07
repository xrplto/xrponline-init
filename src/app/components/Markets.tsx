'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  close: number;
  counter_volume: number;
  change24h: number;
  high: number;
  low: number;
  open: number;
  base_volume: number;
  exchanges: number;
  unique_buyers: number;
  unique_sellers: number;
}

export default function Markets() {
  const [marketData, setMarketData] = useState<MarketData>({
    close: 0,
    counter_volume: 0,
    change24h: 0,
    high: 0,
    low: 0,
    open: 0,
    base_volume: 0,
    exchanges: 0,
    unique_buyers: 0,
    unique_sellers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Construct the currency identifier - using URL encoding for safety
        const base = encodeURIComponent('r3q4Hhc7pSc4rGNMc1mLkzQECW4bhTnPVp_5852504F6E6C696E650000000000000000000000');
        const counter = 'XRP';

        const url = `https://data.xrplf.org/v1/iou/market_data/${base}/${counter}?interval=1d&limit=2&descending=true`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch market data: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (!data || data.length === 0) {
          setError('No market data available');
          return;
        }

        if (data.length >= 2) {
          const current = data[0];
          const previous = data[1];

          const change = ((current.close - previous.close) / previous.close) * 100;

          setMarketData({
            close: current.close,
            counter_volume: current.counter_volume,
            change24h: Number(change.toFixed(2)),
            high: current.high,
            low: current.low,
            open: current.open,
            base_volume: current.base_volume,
            exchanges: current.exchanges,
            unique_buyers: current.unique_buyers,
            unique_sellers: current.unique_sellers
          });
        } else {
          setMarketData({
            close: data[0].close,
            counter_volume: data[0].counter_volume,
            change24h: 0,
            high: data[0].high,
            low: data[0].low,
            open: data[0].open,
            base_volume: data[0].base_volume,
            exchanges: data[0].exchanges,
            unique_buyers: data[0].unique_buyers,
            unique_sellers: data[0].unique_sellers
          });
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 border-2 border-[#1f3973] animate-pulse">
          <h2 className="text-center font-bold mb-4 text-[#1f3973]">XPO MARKET DATA</h2>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 border-2 border-red-500">
          <h2 className="text-center font-bold mb-4 text-[#1f3973]">XPO MARKET DATA</h2>
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border-2 border-[#1f3973]">
        <h2 className="text-center font-bold mb-4 text-[#1f3973]">XPO MARKET DATA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">Current Price:</span>
              <span className="text-right">{marketData.close.toFixed(8)} XRP</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">24h High:</span>
              <span className="text-right">{marketData.high.toFixed(8)} XRP</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">24h Low:</span>
              <span className="text-right">{marketData.low.toFixed(8)} XRP</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">24h Open:</span>
              <span className="text-right">{marketData.open.toFixed(8)} XRP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1f3973]">24h Change:</span>
              <span className={`text-right ${marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">24h Volume (XRP):</span>
              <span className="text-right">{marketData.counter_volume.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">24h Volume (XPO):</span>
              <span className="text-right">{marketData.base_volume.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">Trades:</span>
              <span className="text-right">{marketData.exchanges}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-bold text-[#1f3973]">Unique Buyers:</span>
              <span className="text-right">{marketData.unique_buyers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1f3973]">Unique Sellers:</span>
              <span className="text-right">{marketData.unique_sellers}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-600">
        Data updates every 5 minutes
      </div>
    </div>
  );
} 