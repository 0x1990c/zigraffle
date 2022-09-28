import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useReducedBalancesQuery, useLazyAllCoinsQuery } from './api';
import { AggregatedBalances, CoinBalance } from './types';
import { useActiveExchange } from '../auth/use';

export const useMyBalances = (): {
  isLoading: boolean;
  data?: AggregatedBalances;
} => {
  const currentExchange = useActiveExchange();
  const coins = useSelector((state: RootState) => state.myBalances.coins);
  const { isFetching: isLoadingReducedBalances, data: balances } =
    useReducedBalancesQuery(currentExchange?.internalId, {
      skip: !currentExchange,
    });
  // FIXME: make consistent
  const [, { isFetching: isLoadingAllCoins }] = useLazyAllCoinsQuery();
  const isLoading = isLoadingAllCoins || isLoadingReducedBalances;

  return {
    isLoading,
    data:
      balances &&
      !isLoading &&
      Object.entries(balances).reduce(
        (acc, [coin, balance]: [string, CoinBalance]) => {
          acc = {
            ...acc,
            [coin]: {
              ...balance,
              ...coins[coin],
            },
          };
          return acc;
        },
        {},
      ),
  };
};