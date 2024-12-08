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

interface Exchange {
  base_amount: number;
  counter_amount: number;
  rate: number;
  buyer: string;
  seller: string;
  executed_time: string;
  tx_hash: string;
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
  const [recentExchanges, setRecentExchanges] = useState<Exchange[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = encodeURIComponent('r3q4Hhc7pSc4rGNMc1mLkzQECW4bhTnPVp_5852504F6E6C696E650000000000000000000000');
        const counter = 'XRP';

        const marketDataUrl = `https://data.xrplf.org/v1/iou/market_data/${base}/${counter}?interval=1d&limit=2&descending=true`;
        const exchangesUrl = `https://data.xrplf.org/v1/iou/exchanges/${base}/${counter}?limit=5&descending=true`;

        console.log('Fetching market data from:', marketDataUrl);
        console.log('Fetching exchanges from:', exchangesUrl);

        const [marketDataResponse, exchangesResponse] = await Promise.all([
          fetch(marketDataUrl),
          fetch(exchangesUrl)
        ]);

        if (!marketDataResponse.ok || !exchangesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [marketData, exchangesData] = await Promise.all([
          marketDataResponse.json(),
          exchangesResponse.json()
        ]);

        console.log('Exchanges data:', exchangesData);

        if (marketData && marketData.length > 0) {
          if (marketData.length >= 2) {
            const current = marketData[0];
            const previous = marketData[1];

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
              close: marketData[0].close,
              counter_volume: marketData[0].counter_volume,
              change24h: 0,
              high: marketData[0].high,
              low: marketData[0].low,
              open: marketData[0].open,
              base_volume: marketData[0].base_volume,
              exchanges: marketData[0].exchanges,
              unique_buyers: marketData[0].unique_buyers,
              unique_sellers: marketData[0].unique_sellers
            });
          }
        }

        if (exchangesData && exchangesData.length > 0) {
          setRecentExchanges(exchangesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
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
      <div className="bg-white p-4 border-2 border-[#1f3973]">
        <h2 className="text-center font-bold mb-4 text-[#1f3973]">RECENT TRADES</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[#1f3973] py-2">Time</th>
                <th className="text-right text-[#1f3973] py-2">Type</th>
                <th className="text-right text-[#1f3973] py-2">Price (XRP)</th>
                <th className="text-right text-[#1f3973] py-2">Amount (XPO)</th>
                <th className="text-right text-[#1f3973] py-2">Total (XRP)</th>
              </tr>
            </thead>
            <tbody>
              {recentExchanges.map((exchange, idx) => (
                <tr key={`${exchange.tx_hash}-${idx}`} className="border-b border-gray-100">
                  <td className="py-2">
                    {new Date(exchange.executed_time).toLocaleTimeString()}
                  </td>
                  <td className="text-right py-2">
                    <span className={`font-semibold ${exchange.seller === 'rQJwonL7jgjHqEfMSYQmvV8RHyjRn1XM3f' ? 'text-green-600' : 'text-red-600'}`}>
                      {exchange.seller === 'rQJwonL7jgjHqEfMSYQmvV8RHyjRn1XM3f' ? 'BUY' : 'SELL'}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    {exchange.rate.toFixed(8)}
                  </td>
                  <td className="text-right py-2">
                    {exchange.base_amount.toFixed(2)}
                  </td>
                  <td className="text-right py-2">
                    {exchange.counter_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentExchanges.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No recent trades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center text-sm text-gray-600">
        Data updates every 5 minutes
      </div>
    </div>
  );
} 