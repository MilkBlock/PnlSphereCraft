import { ApiResponse, WalletHistoryItem } from '../types';

const TARGET_URL = 'http://interface.cryproject.xyz/api/wallet/history';
// Using corsproxy.io to handle Mixed Content (HTTPS -> HTTP) and CORS
const API_URL = `https://corsproxy.io/?${TARGET_URL}`;

export const fetchWalletHistory = async (walletAddress: string): Promise<WalletHistoryItem[]> => {
  console.log(`Fetching history for ${walletAddress} via proxy...`);
  
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
    // Provide a more helpful error message for Mixed Content issues if the proxy fails
    if (error.message === 'Failed to fetch') {
      throw new Error('Network Error: Could not connect to the API. This might be due to Mixed Content (HTTP API on HTTPS site). The proxy attempted to resolve this but failed.');
    }
    throw error;
  }
};
