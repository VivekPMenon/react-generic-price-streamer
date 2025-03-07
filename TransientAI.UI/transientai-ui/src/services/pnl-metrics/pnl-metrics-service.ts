import {webApihandler} from "@/services/web-api-handler";
import {PnlMetric} from "@/services/pnl-metrics/model";

// const items = [
//     { title: 'Margin Excess', amount: '36,733.82' },
//     { title: 'PLGMVEPs', amount: '6.86' },
//     { title: 'PL', amount: '5,560' },
//     { title: 'LongPL', amount: '5,968' },
//     { title: 'ShortPL', amount: '408' },
//     { title: 'GMVUsage', amount: '10.65%' },
//     { title: 'PLIDIsAssetsBPs', amount: '8.24' },
//     { title: 'PLIBISTotalGM', amount: '0.91' },
//     { title: 'DeltaAdjGross', amount: '1,063,356' },
//     { title: 'DeltaAdjGrossPct', amount: '11%' },
//     { title: 'ExposureGross', amount: '1,063,356.49' },
//     { title: 'DeltaAdj', amount: '187,989' },
//     { title: 'Exposure', amount: '187,989' },
//     { title: 'Delta%', amount: '1.88' },
//     { title: 'LongDeltaAdj', amount: '437,084' },
//     { title: 'LongDeltaAdj%', amount: '4.38' },
//     { title: 'ShortDeltaAdj', amount: '-625,673' },
//     { title: 'ShortDeltaAdj%', amount: '6.27' },
//     { title: 'Exposure%', amount: '-1.88' }
// ];

class PnlMetricsService {
    async getMetrics(): Promise<Array<PnlMetric>>{
        try {
            const marginExcess = await this.getMarginExcess();
            return [ { title: 'Margin Excess', amount: marginExcess }];
        } catch (e) {
            return [];
        }
    }

    private async getMarginExcess(): Promise<number> {
        try {
            const result = await webApihandler.get('gs-margin-excess', {}, {
                serviceName: 'hurricane-api'
            });
            return result === null || result === undefined ? 'N/A' : result['GS_Margin_Excess'];
        } catch (e) {
            return Number.NaN;
        }
    }
}

export const pnlMetricsService = new PnlMetricsService();