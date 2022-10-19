import React from 'react';
import { Service } from '../../../../apis/service/types';
import { useIsServiceOwner } from '../../../../apis/service/use';
import { Box } from '@mui/system';
import { getServiceLogo } from '../../../../util/images';
import { Avatar } from '@zignaly-open/ui';
import {
  InvestButton,
  InvestedButton,
  LiquidatedLabel,
  OtherAccountsButton,
  ServiceInformation,
} from './atoms';
import { useMediaQuery } from '@mui/material';
import theme from 'theme';
import {
  useIsInvestedInService,
  useSetSelectedInvestment,
} from '../../../../apis/investment/use';
import { useCoinBalances } from '../../../../apis/coin/use';
import { ShowFnOutput, useModal } from 'mui-modal-provider';
import EditInvestmentModal from '../../../Dashboard/components/ManageInvestmentModals/EditInvestmentModal';
import { serviceToInvestmentServiceDetail } from '../../../../apis/investment/util';
import {
  useActiveExchange,
  useIsAuthenticated,
  useSetMissedRoute,
} from '../../../../apis/user/use';
import { useNavigate } from 'react-router-dom';
import { ROUTE_LOGIN } from '../../../../routes';
import { useUpdateEffect } from 'react-use';
import InvestModal from 'views/Dashboard/components/ManageInvestmentModals/InvestModal';

const ServiceProfileContainer: React.FC<{ service: Service }> = ({
  service,
}) => {
  const isOwner = useIsServiceOwner(service.id);
  const isInvested = useIsInvestedInService(service.id);
  const md = useMediaQuery(theme.breakpoints.up('sm'));
  const activeExchange = useActiveExchange();
  const selectInvestment = useSetSelectedInvestment();

  const navigate = useNavigate();
  const setMissedRoute = useSetMissedRoute();
  const isAuthenticated = useIsAuthenticated();
  // we do not use the results of this till before the modal
  useCoinBalances();
  const { showModal } = useModal();

  useUpdateEffect(() => {
    activeExchange?.internalId && isInvested.refetch();
  }, [activeExchange?.internalId]);

  const onClickEditInvestment = () => {
    selectInvestment(serviceToInvestmentServiceDetail(service));
    const modal: ShowFnOutput<void> = showModal(EditInvestmentModal, {
      close: () => modal.hide(),
    });
  };

  const onClickMakeInvestment = () => {
    if (isAuthenticated) {
      selectInvestment(serviceToInvestmentServiceDetail(service));
      const modal: ShowFnOutput<void> = showModal(InvestModal, {
        close: () => modal.hide(),
      });
    } else {
      setMissedRoute();
      navigate(ROUTE_LOGIN);
    }
  };

  return (
    <Box
      sx={
        md
          ? {
              paddingLeft: 4,
              paddingRight: 4,
            }
          : {
              paddingLeft: 0,
              paddingRight: 0,
            }
      }
      paddingTop={isOwner ? 7 : 0}
    >
      <Box
        sx={{
          p: 2,
          pt: 1,
          flexDirection: md ? 'row' : 'column',
          display: 'flex',
          flex: 1,
          alignItems: md ? 'flex-start' : 'center',
        }}
      >
        <Box sx={{ width: '55px', marginBottom: md ? 0 : 2 }}>
          <Avatar
            size={'x-large'}
            alt={service.name}
            image={getServiceLogo(service.logo)}
          />
        </Box>
        <Box
          ml={md ? 2 : 0}
          flex={1}
          sx={{ textAlign: md ? 'left' : 'center' }}
        >
          <ServiceInformation service={service} />
        </Box>

        {service.liquidated && (
          <Box sx={{ mt: -0.5 }}>
            <LiquidatedLabel />
          </Box>
        )}

        {!isInvested.isLoading && !service.liquidated && (
          <Box sx={{ mt: md ? -1.5 : 3 }}>
            {isInvested.thisAccount ? (
              <InvestedButton
                service={service}
                onClick={onClickEditInvestment}
              />
            ) : (
              <InvestButton service={service} onClick={onClickMakeInvestment} />
            )}

            {Object.keys(isInvested.accounts || {}).length > 1 && (
              <OtherAccountsButton service={service} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ServiceProfileContainer;