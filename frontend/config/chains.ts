import { defineChain } from '@reown/appkit/networks'

export const rskTestnet = defineChain({
  id: 31,
  caipNetworkId: 'eip155:31',
  chainNamespace: 'eip155',
  name: 'RSK Testnet',
  nativeCurrency: {
    name: 'tRBTC',
    symbol: 'tRBTC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://public-node.testnet.rsk.co'] },
  },
  blockExplorers: {
    default: { name: 'RSK Testnet Explorer', url: 'https://explorer.testnet.rootstock.io' },
  },
  testnet: true,
})

export const localhost = defineChain({
  id: 31337,
  caipNetworkId: 'eip155:31337',
  chainNamespace: 'eip155',
  name: 'Localhost',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
})
