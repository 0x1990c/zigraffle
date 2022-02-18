// Dependencies
import React, { useMemo } from 'react';
import { BigNumber, utils } from 'ethers';
import NumberFormat from 'react-number-format';

// Styles
import * as styled from './index.styles';

// Assets
import ZigCoinIcon from '@assets/images/zignaly-coin.svg';

// Components
import Typography from '@components/display/Typhography';

function ZigWalletIndicator({
  zigs = 0
}) {
  const renderZigsCoins = useMemo(() => (
    <NumberFormat
      value={utils.formatUnits(BigNumber.from(zigs === '' ? '0' : String(zigs)))}
      displayType={'text'}
      thousandSeparator={true}
      renderText={(value) => (
        <styled.Value>
          <Typography>{value}</Typography> <styled.Token>ZIG</styled.Token>
        </styled.Value>
      )}
    />
  ), [zigs]);

  const renderLevel = useMemo(() => (
    <styled.Level>
      <span>🐬</span>
      <Typography variant={'h6'}>Dolphin</Typography>
    </styled.Level>
  ), []);

  return (
    <styled.Layout>
      <styled.Icon src={ZigCoinIcon} />
      <styled.Data>
        {renderZigsCoins}
        {renderLevel}
      </styled.Data>
    </styled.Layout>
  );
}

export default ZigWalletIndicator;
