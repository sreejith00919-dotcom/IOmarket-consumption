export type DispatchChannel = 'EBILL' | 'PAPERMAIL';
export type PaperMailSubType = 'DOMESTIC_A' | 'DOMESTIC_B1' | 'DOMESTIC_B2' | 'EUROPE' | 'REST_OF_WORLD' | 'ADDITIONAL_PAPERS' | 'RETURNS';

export interface DispatchRecord {
  id: string;
  clubName: string;
  channel: DispatchChannel;
  paperMailSubType?: PaperMailSubType;
  recipientCount: number;
  ioMarketUnitCost: number;
  fairgateUnitPrice: number;
  status: 'SUCCESS' | 'FAILED';
  dispatchDate: string;
}

export interface ClubSummary {
  clubName: string;
  eBillCount: number;
  paperMailDomesticACount: number;
  paperMailDomesticB1Count: number;
  paperMailDomesticB2Count: number;
  paperMailEuropeCount: number;
  paperMailRestOfWorldCount: number;
  paperMailAdditionalPapersCount: number;
  paperMailReturnsCount: number;
  totalCount: number;
  ioMarketTotalCost: number;
  fairgateTotalPrice: number;
  fairgateTotalProfit: number;
  failureCount: number;
}
