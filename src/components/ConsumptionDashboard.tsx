import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Panel } from './ui/Panel';
import { MetricCard } from './ui/MetricCard';
import { generateMockData } from '../services/mockDataService';
import { ClubSummary, DispatchRecord } from '../types';

export const ConsumptionDashboard: React.FC = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [records, setRecords] = useState<DispatchRecord[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    const handleFetch = () => {
        if (!fromDate || !toDate) {
            alert('Please select both From and To dates.');
            return;
        }
        setIsFetching(true);
        // Simulate network delay
        setTimeout(() => {
            const data = generateMockData(fromDate, toDate);
            setRecords(data);
            setIsFetching(false);
            setHasFetched(true);
        }, 800);
    };

    const handleExport = () => {
        if (summaries.length === 0) return;

        const data = summaries.map(s => ({
            'Club Name': s.clubName,
            'eBill': s.eBillCount,
            'PaperMail Dom.-A': s.paperMailDomesticACount,
            'PaperMail Dom.-B1': s.paperMailDomesticB1Count,
            'PaperMail Dom.-B2': s.paperMailDomesticB2Count,
            'PaperMail Europe': s.paperMailEuropeCount,
            'PaperMail ROW': s.paperMailRestOfWorldCount,
            'PaperMail Add.': s.paperMailAdditionalPapersCount,
            'PaperMail Returns': s.paperMailReturnsCount,
            'Total': s.totalCount,
            'Total Cost (CHF)': Number(s.ioMarketTotalCost.toFixed(2)),
            'FG Profit (CHF)': Number(s.fairgateTotalProfit.toFixed(2))
        }));

        // Add Totals row
        data.push({
            'Club Name': 'TOTALS',
            'eBill': globalTotals.eBill,
            'PaperMail Dom.-A': globalTotals.domesticA,
            'PaperMail Dom.-B1': globalTotals.domesticB1,
            'PaperMail Dom.-B2': globalTotals.domesticB2,
            'PaperMail Europe': globalTotals.europe,
            'PaperMail ROW': globalTotals.row,
            'PaperMail Add.': globalTotals.additional,
            'PaperMail Returns': globalTotals.returns,
            'Total': globalTotals.total,
            'Total Cost (CHF)': Number(globalTotals.cost.toFixed(2)),
            'FG Profit (CHF)': Number(globalTotals.profit.toFixed(2))
        } as any);

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Consumption");
        
        const fileName = `ebILl_papermailing consumption_${fromDate}_to_${toDate}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const summaries = useMemo(() => {
        const map = new Map<string, ClubSummary>();
        
        records.forEach(r => {
            if (!map.has(r.clubName)) {
                map.set(r.clubName, {
                    clubName: r.clubName,
                    eBillCount: 0,
                    paperMailDomesticACount: 0,
                    paperMailDomesticB1Count: 0,
                    paperMailDomesticB2Count: 0,
                    paperMailEuropeCount: 0,
                    paperMailRestOfWorldCount: 0,
                    paperMailAdditionalPapersCount: 0,
                    paperMailReturnsCount: 0,
                    totalCount: 0,
                    ioMarketTotalCost: 0,
                    fairgateTotalPrice: 0,
                    fairgateTotalProfit: 0,
                    failureCount: 0
                });
            }
            
            const s = map.get(r.clubName)!;
            const success = r.status === 'SUCCESS';
            
            if (success) {
                if (r.channel === 'EBILL') {
                    s.eBillCount += r.recipientCount;
                } else if (r.channel === 'PAPERMAIL') {
                    if (r.paperMailSubType === 'DOMESTIC_A') s.paperMailDomesticACount += r.recipientCount;
                    else if (r.paperMailSubType === 'DOMESTIC_B1') s.paperMailDomesticB1Count += r.recipientCount;
                    else if (r.paperMailSubType === 'DOMESTIC_B2') s.paperMailDomesticB2Count += r.recipientCount;
                    else if (r.paperMailSubType === 'EUROPE') s.paperMailEuropeCount += r.recipientCount;
                    else if (r.paperMailSubType === 'REST_OF_WORLD') s.paperMailRestOfWorldCount += r.recipientCount;
                    else if (r.paperMailSubType === 'ADDITIONAL_PAPERS') s.paperMailAdditionalPapersCount += r.recipientCount;
                    else if (r.paperMailSubType === 'RETURNS') s.paperMailReturnsCount += r.recipientCount;
                }
                s.totalCount += r.recipientCount;
                s.ioMarketTotalCost += (r.recipientCount * r.ioMarketUnitCost);
                s.fairgateTotalPrice += (r.recipientCount * r.fairgateUnitPrice);
                s.fairgateTotalProfit += (r.recipientCount * (r.fairgateUnitPrice - r.ioMarketUnitCost));
            } else {
                s.failureCount += r.recipientCount;
            }
        });
        
        return Array.from(map.values()).sort((a, b) => a.clubName.localeCompare(b.clubName));
    }, [records]);

    const globalTotals = useMemo(() => {
        return summaries.reduce((acc, curr) => ({
            eBill: acc.eBill + curr.eBillCount,
            domesticA: acc.domesticA + curr.paperMailDomesticACount,
            domesticB1: acc.domesticB1 + curr.paperMailDomesticB1Count,
            domesticB2: acc.domesticB2 + curr.paperMailDomesticB2Count,
            europe: acc.europe + curr.paperMailEuropeCount,
            row: acc.row + curr.paperMailRestOfWorldCount,
            additional: acc.additional + curr.paperMailAdditionalPapersCount,
            returns: acc.returns + curr.paperMailReturnsCount,
            total: acc.total + curr.totalCount,
            cost: acc.cost + curr.ioMarketTotalCost,
            price: acc.price + curr.fairgateTotalPrice,
            profit: acc.profit + curr.fairgateTotalProfit,
            failure: acc.failure + curr.failureCount
        }), { eBill: 0, domesticA: 0, domesticB1: 0, domesticB2: 0, europe: 0, row: 0, additional: 0, returns: 0, total: 0, cost: 0, price: 0, profit: 0, failure: 0 });
    }, [summaries]);

    return (
        <div className="flex flex-col gap-3">
            {/* Filter Section */}
            <Panel title="Filters" headerColor="#5b9bd5">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1 w-40">
                        <label htmlFor="fromDate">From Period</label>
                        <input 
                            type="date" 
                            id="fromDate" 
                            value={fromDate} 
                            onChange={(e) => setFromDate(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-40">
                        <label htmlFor="toDate">To Period</label>
                        <input 
                            type="date" 
                            id="toDate" 
                            value={toDate} 
                            onChange={(e) => setToDate(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-48">
                        <label>Channel Type</label>
                        <select defaultValue="all">
                            <option value="all">All Channels</option>
                            <option value="ebill">eBill Only</option>
                            <option value="paper">PaperMail Only</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            className="btn btn-primary" 
                            onClick={handleFetch}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Fetching...' : 'Fetch Data'}
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => { setRecords([]); setHasFetched(false); setFromDate(''); setToDate(''); }}
                        >
                            Reset
                        </button>
                        {hasFetched && (
                            <button className="btn btn-success" onClick={handleExport}>
                                EXPORT XLSX
                            </button>
                        )}
                    </div>
                </div>
            </Panel>

            {hasFetched && (
                <>
                    {/* Summary Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <MetricCard 
                            label="Total Dispatches" 
                            value={globalTotals.total.toLocaleString()} 
                            accentColor="#5b9bd5" 
                            subLabel="Successful units"
                        />
                        <MetricCard 
                            label="Total Cost" 
                            value={`CHF ${globalTotals.cost.toFixed(2).toLocaleString()}`} 
                            accentColor="#6c5bb5" 
                            subLabel="Total internal cost"
                        />
                         <MetricCard 
                            label="FG Revenue" 
                            value={`CHF ${globalTotals.price.toFixed(2).toLocaleString()}`} 
                            accentColor="#3dbdaf" 
                            subLabel="Total billed to clubs"
                        />
                        <MetricCard 
                            label="FG Net Profit" 
                            value={`CHF ${globalTotals.profit.toFixed(2).toLocaleString()}`} 
                            accentColor="#5ba65b" 
                            subLabel={`${((globalTotals.profit / globalTotals.price) * 100 || 0).toFixed(1)}% Profit Margin`}
                        />
                        <MetricCard 
                            label="Failure Rate" 
                            value={`${((globalTotals.failure / (globalTotals.total + globalTotals.failure)) * 100 || 0).toFixed(2)}%`} 
                            accentColor="#d08030" 
                            subLabel={`${globalTotals.failure} total failed records`}
                        />
                    </div>

                    {/* Breakdown Section */}
                    <Panel title="Consumption Details by Club" headerColor="#5ba65b">
                        <div className="table-container max-h-[400px]">
                            <table id="consumption-table">
                                <thead>
                                    <tr>
                                        <th rowSpan={2}>Club Name</th>
                                        <th rowSpan={2} className="text-center">eBill</th>
                                        <th colSpan={7} className="text-center">PaperMail Breakdown</th>
                                        <th rowSpan={2} className="text-center">Total</th>
                                        <th rowSpan={2} className="text-right">Total Cost</th>
                                        <th rowSpan={2} className="text-right">FG Profit</th>
                                    </tr>
                                    <tr>
                                        <th className="text-center text-[10px] font-normal uppercase">Dom.-A</th>
                                        <th className="text-center text-[10px] font-normal uppercase">Dom.-B1</th>
                                        <th className="text-center text-[10px] font-normal uppercase">Dom.-B2</th>
                                        <th className="text-center text-[10px] font-normal uppercase">Europe</th>
                                        <th className="text-center text-[10px] font-normal uppercase">ROW</th>
                                        <th className="text-center text-[10px] font-normal uppercase">Add.</th>
                                        <th className="text-center text-[10px] font-normal uppercase">Ret.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaries.map(s => (
                                        <tr key={s.clubName}>
                                            <td className="font-bold underline text-fg-blue cursor-pointer">{s.clubName}</td>
                                            <td className="text-center">{s.eBillCount || '-'}</td>
                                            <td className="text-center">{s.paperMailDomesticACount || '-'}</td>
                                            <td className="text-center">{s.paperMailDomesticB1Count || '-'}</td>
                                            <td className="text-center">{s.paperMailDomesticB2Count || '-'}</td>
                                            <td className="text-center">{s.paperMailEuropeCount || '-'}</td>
                                            <td className="text-center">{s.paperMailRestOfWorldCount || '-'}</td>
                                            <td className="text-center">{s.paperMailAdditionalPapersCount || '-'}</td>
                                            <td className="text-center">{s.paperMailReturnsCount || '-'}</td>
                                            <td className="text-center font-bold">{s.totalCount.toLocaleString()}</td>
                                            <td className="text-right font-mono">{s.ioMarketTotalCost.toFixed(2)}</td>
                                            <td className="text-right font-bold font-mono">{s.fairgateTotalProfit.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="footer-row">
                                        <td className="uppercase text-[11px]">TOTALS (Selected Period)</td>
                                        <td className="text-center">{globalTotals.eBill.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.domesticA.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.domesticB1.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.domesticB2.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.europe.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.row.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.additional.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.returns.toLocaleString()}</td>
                                        <td className="text-center">{globalTotals.total.toLocaleString()}</td>
                                        <td className="text-right">CHF {globalTotals.cost.toFixed(2)}</td>
                                        <td className="text-right">CHF {globalTotals.profit.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Panel>
                </>
            )}

            {!hasFetched && !isFetching && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-white border border-dashed border-[#ccc] rounded-[2px] text-[#888]">
                    <span className="text-2xl mb-4 text-[#ccc] font-bold">fairgate</span>
                    <p className="text-[14px]">Select a period and click "Fetch Data" to populate recon report.</p>
                </div>
            )}
        </div>
    );
};
