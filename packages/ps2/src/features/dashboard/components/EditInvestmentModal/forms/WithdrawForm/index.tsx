import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { WithdrawActions } from '../../styles';
import {
  Button,
  InputAmountAdvanced,
  SliderInput,
  Toaster,
} from '@zignaly-open/ui';
import BigNumber from 'bignumber.js';
import {
  useCurrentBalance,
  useSelectedInvestment,
  useWithdrawInvestment,
} from '../../../../use';
import { EditInvestmentValidation } from './validations';
import { WithdrawFormData } from './types';
import { ChangeViewFn, EditInvestmentViews } from '../../types';
import { toast } from 'react-toastify';

const WithdrawForm: React.FC<{ setView: ChangeViewFn }> = ({ setView }) => {
  const coin = useCurrentBalance();
  const { isLoading, withdraw } = useWithdrawInvestment();
  const { serviceId } = useSelectedInvestment();
  const { t } = useTranslation('withdraw');
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm<WithdrawFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      amountTransfer: {
        value: 0,
        token: coin,
      },
    },
    resolver: yupResolver(EditInvestmentValidation),
  });

  const watchAmountTransfer = watch(
    'amountTransfer',
  ) as WithdrawFormData['amountTransfer'];

  const onSubmit = async (values: WithdrawFormData) => {
    await withdraw({
      amount: values.amountTransfer?.value,
      serviceId,
    });

    // TODO: error handling
    toast(
      <Toaster
        variant={'success'}
        caption={t('edit-investment:edit-investment.withdrawInvestmentSuccess')}
      />,
      {
        type: 'error',
        icon: false,
      },
    );
    setView(EditInvestmentViews.WithdrawSuccess);
  };
  const tokenBalance = new BigNumber(coin.balance);
  const amount = new BigNumber(watchAmountTransfer?.value);

  let sliderValue = +amount
    .multipliedBy(new BigNumber(100))
    .div(tokenBalance)
    .dp(2);
  if (isNaN(sliderValue)) sliderValue = 0;
  sliderValue = Math.min(sliderValue, 100);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <InputAmountAdvanced
            name={'amountTransfer'}
            control={control}
            label={t('withdraw.form.label')}
            labelBalance={t('withdraw.form.labelBalance')}
            showUnit={true}
            placeholder={'0.0'}
            tokens={[coin]}
            error={isDirty && t(errors?.amountTransfer?.value?.message)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box marginTop={5}>
            <SliderInput
              value={sliderValue}
              initialValue={0}
              onChange={(value: number) => {
                setValue('amountTransfer', {
                  ...watchAmountTransfer,
                  value: new BigNumber(coin.balance)
                    .multipliedBy(value)
                    .dividedBy(100),
                });
                trigger('amountTransfer');
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <WithdrawActions>
        <Button
          size={'xlarge'}
          disabled={!isValid}
          caption={t('withdraw.button')}
          loading={isLoading}
        />
      </WithdrawActions>
    </form>
  );
};

export default WithdrawForm;