import NetInfo from "@react-native-community/netinfo";

export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}

export function useNetworkStatus(callback: (connected: boolean) => void) {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected === true);
  });
}
