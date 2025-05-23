import {Mode} from "@/services/menu-data";
import {breakNewsStore} from "@/services/break-news/break-news-data-store";
import {clientHoldingsStore} from "@/services/client-holding-data/client-holding-store";
import {useCorpActionsStore} from "@/services/corporate-actions";
import {useInvestorRelationsStore} from "@/services/investor-relations-data/investor-relations-store";
import {macroPanelDataStore} from "@/services/macro-panel-data/macro-panel-data-store";
import {pmsPnlDataStore} from "@/services/pms-pnl-data/pms-pnl-data-store";
import {productBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {useResearchReportsStore, useRiskReportsSlice} from "@/services/reports-data";
import {PollManager} from "@/lib/utility/PollManager";
import {useRiskDataStore} from "@/services/risk-data/risk-data-store";
import {chatbotStore} from "@/services/chatbot-data/chatbot-data-store";

export class ServiceInitializer {
    private isInitialized: boolean = false;

    constructor(private readonly mode: Mode) {
    }

    initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            if (!this.mode || this.mode === Mode.BUY) {
                this.initializeBuy();
                return;
            }
            this.initializeSell();
        } finally {
            this.isInitialized = true;
        }
    }

    private initializeBuy() {
        const breakingNews = breakNewsStore.getState();
        breakingNews.loadBreakNews().catch((err) => console.error(err));
        breakingNews.startPolling();

        const clientHoldings = clientHoldingsStore.getState();
        clientHoldings.loadClientHoldings().catch((err) => console.error(err));
        clientHoldings.loadBondTrades().catch((err) => console.error(err));

        const corpActions = useCorpActionsStore.getState();
        corpActions.startPolling();

        const investorRelations = useInvestorRelationsStore.getState();
        investorRelations.loadInquiries().catch((err) => console.error(err));
        investorRelations.loadAssignees().catch((err) => console.error(err));
        investorRelations.loadEmails().catch((err) => console.error(err));
        investorRelations.startPolling();

        const macroPanel = macroPanelDataStore.getState();
        macroPanel.loadMacroPanelData(true, true);
        macroPanel.startPolling();

        const pmsPnl = pmsPnlDataStore.getState();
        pmsPnl.getReport();

        new PollManager(
            pmsPnl.getReport,
            3600000,
            { hour: 9, minute: 0, seconds: 0 },
            { hour: 10, minute: 30, seconds: 0 },
            600000
        ).start(1000);

        const riskReports = useRiskDataStore.getState();
        riskReports.loadRiskMetrics().catch((err) => console.error(err));
        riskReports.startPolling();

        const riskReportSlice = useRiskReportsSlice.getState();
        riskReportSlice.loadRiskReports();
        riskReportSlice.startPolling();

        const researchReports = useResearchReportsStore.getState();
        researchReports.loadReports().catch((err) => console.error(err));
        researchReports.startPolling();
    }

    private initializeSell() {
        const productBrowser = productBrowserStore.getState();
        productBrowser.loadAxes().catch((err) => console.error(err));
        productBrowser.loadTraces().catch((err) => console.error(err));

        const loadUserThreads = chatbotStore.getState().loadUserThreads;
        loadUserThreads().catch((err) => console.error(err));
    }
}