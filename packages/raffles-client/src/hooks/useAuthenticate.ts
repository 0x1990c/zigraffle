import { useApolloClient, useMutation } from '@apollo/client';
import { setToken } from '../util/token';
import { Mumbai, Polygon, useEthers } from '@usedapp/core';
import { useAsync } from 'react-use';
import { useState } from 'react';
import {
  GET_CURRENT_USER,
  GET_OR_CREATE_USER,
  AUTHENTICATE_METAMASK,
  GET_CURRENT_USER_BALANCE,
} from 'queries/users';
import { GET_AUCTIONS } from 'queries/auctions';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletType } from '@zignaly-open/raffles-shared/types';

export function useLogout(): () => Promise<void> {
  const { deactivate } = useEthers();
  const client = useApolloClient();
  return async () => {
    deactivate();
    setToken('');
    client.refetchQueries({
      include: [GET_AUCTIONS],
    });
  };
}

export default function useAuthenticate(): {
  authenticate: (walletType: WalletType, prov?: object) => void;
  isSigning: boolean;
  error: Error & { code: number };
} {
  const [getOrCreateUser] = useMutation(GET_OR_CREATE_USER);
  const [authenticate] = useMutation(AUTHENTICATE_METAMASK);
  const [isOkToStart, setIsOkToStart] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const client = useApolloClient();
  const { account, activateBrowserWallet, activate, library, switchNetwork } =
    useEthers();
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [walletType, setWalletType] = useState(null);

  async function createUserAndSign() {
    const {
      data: {
        getOrCreateUser: { messageToSign },
      },
    } = await getOrCreateUser({
      variables: { publicAddress: account.toLocaleLowerCase(), walletType },
    });

    if (!provider) {
      await switchNetwork(
        process.env.REACT_APP_USE_MUMBAI_CHAIN
          ? Mumbai.chainId
          : Polygon.chainId,
      );
    }

    setIsSigning(true);
    try {
      const signature = await library.getSigner().signMessage(messageToSign);

      const {
        data: {
          authenticate: { accessToken },
        },
      } = await authenticate({
        variables: {
          publicAddress: account.toLocaleLowerCase(),
          signature,
        },
      });
      setToken(accessToken);

      await client.refetchQueries({
        include: [GET_CURRENT_USER],
        updateCache(cache) {
          cache.evict({ fieldName: 'me' });
        },
      });

      client.refetchQueries({
        include: [GET_CURRENT_USER_BALANCE, GET_AUCTIONS],
        updateCache(cache) {
          cache.evict({ fieldName: 'balance' });
        },
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsSigning(false);
    }
  }

  useAsync(async () => {
    if (!account || !isOkToStart) return;
    setIsOkToStart(false);
    createUserAndSign();
  }, [account, isOkToStart]);

  const startAuthenticate = (
    wallType: WalletType,
    prov?: WalletConnectProvider,
  ) => {
    setError(null);
    setProvider(prov);
    setWalletType(wallType);

    // In case there is an old token saved, that will trigger useCurrentUser fetching
    // as soon as account connected, but new message not signed yet.
    setToken('');

    // Ready to connect
    setIsOkToStart(true);

    if (!account) {
      // Init account
      if (prov) {
        // WalletConnect
        activate(prov);
      } else {
        // Metamask
        activateBrowserWallet();
      }
    }
  };

  return {
    authenticate: startAuthenticate,
    isSigning,
    error,
  };
}
