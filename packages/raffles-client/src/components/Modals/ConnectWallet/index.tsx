import React, { useEffect, useState } from 'react';
import { ButtonContainer, Gap, Subtitle } from './styles';
import { ConnectWalletModalProps } from './types';
import DialogContainer from '../DialogContainer';
import { Button } from '@zignaly-open/ui';
import { ReactComponent as MetaMaskLogo } from '../../../assets/icons/metamask-logo.svg';
import { useTranslation } from 'react-i18next';
import useAuthenticate from 'hooks/useAuthenticate';
import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import theme from 'theme';
import useCurrentUser from 'hooks/useCurrentUser';
import { useEthers } from '@usedapp/core';
import { useAsync } from 'react-use';
import UnlockMetamaskModal from '../UnlockMetamask';
import { useModal } from 'mui-modal-provider';
import NoMetaMask from '../NoMetaMask';
import ConnectionCanceledModal from '../ConnectionCanceledModal';

const ConnectWalletModal = (props: ConnectWalletModalProps) => {
  const {
    authenticate,
    isSigning,
    error: authenticateError,
  } = useAuthenticate();
  const { t } = useTranslation('connect-wallet');
  const matchesSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const { user } = useCurrentUser();
  const { error } = useEthers();
  const [showUnlock, setShowUnlock] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const { showModal } = useModal();

  useEffect(() => {
    if (user) {
      // Close modal once user is connected
      props.onClose(null, 'escapeKeyDown');
    }
  }, [user]);

  // Show unlock modal when MM stuck due to locked
  useAsync(async () => {
    if (!error) return;

    const { code } = error as Error & { code: number };
    if (code === -32002) {
      const isUnlocked = await window.ethereum?._metamask.isUnlocked();
      setShowUnlock(!isUnlocked);
    }
  }, [error]);

  // Canceled modal
  useEffect(() => {
    if (!authenticateError) return;
    const { code } = authenticateError as Error & { code: number };

    if (code === 4001) {
      setShowCanceled(true);
    }
  }, [authenticateError]);

  const handleAccountsChanged = (accounts: object[]) => {
    // Should be always positive here
    if (accounts.length) {
      setShowUnlock(false);
    }
  };

  useEffect(() => {
    window.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleMetaMaskConnect = () => {
    if (window.ethereum) {
      authenticate();
    } else {
      showModal(NoMetaMask);
    }
  };

  if (showUnlock) {
    return <UnlockMetamaskModal {...props} />;
  } else if (showCanceled) {
    return (
      <ConnectionCanceledModal
        {...props}
        onCancel={() => {
          setShowCanceled(false);
        }}
      />
    );
  }

  return (
    <DialogContainer title={t('title')} {...props}>
      <Gap gap={8} />
      {isSigning ? (
        <>
          <Subtitle variant='body1' weight='regular' color='neutral200'>
            {t('waiting-signature')}
          </Subtitle>
          <Box
            display='flex'
            mt={4}
            alignItems={'center'}
            justifyContent='center'
          >
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          <Subtitle variant='body1' weight='regular' color='neutral200'>
            {t('subtitle')}
          </Subtitle>
          <Gap gap={20} />
          <ButtonContainer>
            <Button
              variant='primary'
              minWidth={matchesSmall ? 255 : 180}
              size={matchesSmall ? 'xlarge' : 'large'}
              caption={t('metamask')}
              onClick={handleMetaMaskConnect}
              leftElement={<MetaMaskLogo />}
            />
          </ButtonContainer>
        </>
      )}
    </DialogContainer>
  );
};

export default ConnectWalletModal;
