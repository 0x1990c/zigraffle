import { MarketplaceService } from '../../../../apis/marketplace/types';
import { AxisFormat } from '@zignaly-open/ui/lib/components/display/Charts/types';

export type MarketplaceTableDataType = {
  service: MarketplaceService;
  actionService: MarketplaceService;
  '30d': {
    pnl30d: string;
    data: AxisFormat[] | number[];
  };
  '90d': {
    roi: string;
    createdAt: string;
  };

  assets: {
    invested: string;
    investors: number;
  };
};