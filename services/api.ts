import { ApiResponse, WalletHistoryItem } from '../types';

const API_URL = 'https://interface.aurapnl.io/api/wallet/history';

export const fetchWalletHistory = async (walletAddress: string): Promise<WalletHistoryItem[]> => {
  console.log(`Fetching history for ${walletAddress}...`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallets: [walletAddress],
        hide: true,
        term: 'all',
        type: 'sol',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json: ApiResponse = await response.json();
    console.log('API Response:', json);

    if (json.code !== 0) {
      throw new Error(json.msg || 'Unknown API error');
    }

    return json.data;
  } catch (error: any) {
    console.error('Failed to fetch wallet history:', error);
    throw error;
  }
};
