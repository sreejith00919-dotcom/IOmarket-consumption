import { DispatchRecord, PaperMailSubType } from '../types';

const SWISS_CLUBS = [
  'FC Zürich', 'Grasshopper Club Zürich', 'FC Basel 1893', 'BSC Young Boys',
  'FC St. Gallen 1879', 'FC Luzern', 'FC Lugano', 'Servette FC',
  'SC Bern (Hockey)', 'ZSC Lions', 'EV Zug', 'HC Fribourg-Gottéron',
  'STV Baden', 'TV Unterstrass', 'LC Zürich', 'BTV Aarau'
];

export const generateMockData = (fromDate: string, toDate: string): DispatchRecord[] => {
  const records: DispatchRecord[] = [];
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  SWISS_CLUBS.forEach(club => {
    // Generate 5-20 records per club
    const recordCount = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < recordCount; i++) {
        const isEbill = Math.random() > 0.4;
        const subType: PaperMailSubType | undefined = isEbill ? undefined : 
            (['DOMESTIC_A', 'DOMESTIC_B1', 'DOMESTIC_B2', 'EUROPE', 'REST_OF_WORLD', 'ADDITIONAL_PAPERS', 'RETURNS'] as const)[Math.floor(Math.random() * 7)];
        
        const recipientCount = Math.floor(Math.random() * 100) + 1;
        
        // Costs
        let ioMarketUnitCost = 0;
        let fairgateUnitPrice = 0;
        
        if (isEbill) {
            ioMarketUnitCost = 0.15; // CHF
            fairgateUnitPrice = 0.25;
        } else {
            // PaperMail costs vary by type
            switch(subType) {
                case 'DOMESTIC_A': 
                    ioMarketUnitCost = 1.10;
                    fairgateUnitPrice = 1.45;
                    break;
                case 'DOMESTIC_B1':
                    ioMarketUnitCost = 0.95;
                    fairgateUnitPrice = 1.25;
                    break;
                case 'DOMESTIC_B2':
                    ioMarketUnitCost = 0.90;
                    fairgateUnitPrice = 1.20;
                    break;
                case 'EUROPE':
                    ioMarketUnitCost = 1.80;
                    fairgateUnitPrice = 2.40;
                    break;
                case 'REST_OF_WORLD':
                    ioMarketUnitCost = 2.50;
                    fairgateUnitPrice = 3.20;
                    break;
                case 'ADDITIONAL_PAPERS':
                    ioMarketUnitCost = 0.40;
                    fairgateUnitPrice = 0.60;
                    break;
                case 'RETURNS':
                    ioMarketUnitCost = 0.80;
                    fairgateUnitPrice = 1.05;
                    break;
            }
        }

        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        records.push({
            id: crypto.randomUUID(),
            clubName: club,
            channel: isEbill ? 'EBILL' : 'PAPERMAIL',
            paperMailSubType: subType,
            recipientCount,
            ioMarketUnitCost,
            fairgateUnitPrice,
            status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILED',
            dispatchDate: date.toISOString().split('T')[0]
        });
    }
  });

  return records;
};
