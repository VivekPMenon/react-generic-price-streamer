// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import macro from 'styled-jsx/macro';
import axios from 'axios';

console.log('Detected Language:',i18n.language); // Check which language is detected

export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        target_language: targetLanguage, // 'ja' for Japanese
      }),
    });

    const data = await response.json();
    return data.translated_text; // Return the translated text
  } catch (error) {
    console.error('Translation Error:', error);
    return text; // If there's an error, return the original text
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: "ja", // Default language
    resources: {
      en: {
        translation: {
          macro_panel: 'Macro Panel',
          research_reports: 'Research Reports',
          risk_report_portal: 'Risk Report Portal',
          corporate_actions: 'Corporate Actions',
          investor_relations: 'Investor Relations',
          market_data: 'Market Data',
          breaking_news: 'Breaking News',
          margin: 'Margin',
          notifications: 'Notifications',
          all: 'All',
          research: 'Research',
          risk_report: 'Risk Report',
          pnl_and_financial_resource_metrics: 'PnL And Financial Resource Metrics',
          margin_excess: 'Margin Excess',
          ibis_all: 'IBIS ALL',
          all_reports: 'ALL REPORTS',
          no_email_content_found: 'No Email Content Found',
          search: 'Search',
          summary_type: 'Summary Type',
          original_email: 'Original Email',
          ai_summary: 'AI Summary',
          keywords: 'Keywords',
          executive_summary: 'Executive Summary',
          abstract: 'Abstract',
          search_ticker: 'Search Ticker/Company name or ask the AI Chatbot',
          select_whatsapp_group: 'Select WhatsApp Group',
          no_groups_found: 'No groups found',
          error_loading_groups: 'Error loading groups',
          todays_axes: "Today's Axes",
          trading_activity: "Trading Activity",
          client_data: "Client Data",
          pms: "PMS",
          Macro_Report_Generated: 'Macro Report Generated',
          Global_Equity_Index_Futures: 'Global Equity Index Futures',
          Rates_Yield: 'Rates Yield',
          FX: "FX",
          Crypto: "Crypto",
          Loading: "Loading...",
          Treasury_Yields: "Treasury Yields",
          Equity_Futures: "Equity Futures",
          find: "Find...",
          notification: {
         title: "Notifications",
         research: "Research",
         all: "All",
         macro: "Macro",
         'risk report': "Risk Report",
         'corp act': "Corp Act",
         'inquiries': "Inquiries",
         pms: "PMS",
            "expand": "Expand",
            "collapse": "Collapse",
            "date": "Date",
            "due": "Due",
            "assigned_to": "Assigned to",
            "inquiry_assignee": "Inquiry Assignee",
            "action_required": "Action Required: Deadline Approaching - Response Required",
            "announcement_id": "Announcement Id",
            "account": "Account",
            "holding_quantity": "Holding Quantity",
            "term_details": "Term Details",
            "pay_date": "Pay Date",
            "read_more": "Read More",
            "close": "Close"

        },
        full_view: "Full View",
        detailed: "Detailed",
        file_upload_wizard:{
          upload: "Upload File",
          submit: "Submit",
          drag_drop: "Drag and drop files here, or click to select files",
          or: "or",
          browse_file: "Browse Your File",
          review: "Review File",

        },
        corporate_actions_1: {
          action_type: 'Action Type',
          security_ticker: 'Security/Ticker',
          isin_cusip: 'ISIN/CUSIP',
          date_range: 'Date Range',
          corp_action_id: 'Corp Action ID',
          event_status: 'Event Status',
          event_type: 'Event Type',
          account: 'Account',
          sort_by_action_required: 'Sort by Action Required',
          reset: 'Reset',
          search_placeholder: 'Ask TransientAI anything about recent Corporate Actions. Include securities if you are looking for specific information',
        },
        "market_data_1": {
        "as_of": "As of",
        "quarterly_financials": "Quarterly Financials",
        "revenue": "Revenue",
        "high": "High",
        "open": "Open",
        "prev_close": "Prev Close",
        "low": "Low"
      },
      risk_metrics: {
        MANAGER: "Manager",
        ENTITY: "Entity",
        GS_MARGIN_EXCESS: "GS Margin Excess",
        // Add other translations for this section
      },
        "pms_1": {
          "pnl_dashboard": "P&L Dashboard for ",
        },
      "Date": "Date",
    "From": "From",
    "To": "To",
    "Subject": "Subject",
    "Inquiry/Request": "Inquiry/Request",
    "Status": "Status",
    "Flag": "Flag",
    "Due": "Due",
    "Date edited": "Date edited",
      Investor_Relations_Inquiries: "Investor Relations Inquiries",
        },
      },
      ja: {
        translation: {
          macro_panel: 'マクロパネル',
          research_reports: '調査レポート',
          risk_report_portal: 'リスクレポートポータル',
          corporate_actions: '企業活動',
          investor_relations: '投資家向け広報',
          market_data: 'マーケットデータ',
          breaking_news: '最新ニュース',
          margin: '証拠金',
          notifications: '通知',
          all: 'すべて',
          research: '調査',
          'risk report': 'リスクレポート',
          pnl_and_financial_resource_metrics: '損益および財務リソース指標',
          margin_excess: '証拠金超過額',
          ibis_all: 'IBIS ALL',
          chris_napoli: 'Chris Napoli',
          all_reports: 'すべてのレポート',
          no_email_content_found: 'メールコンテンツが見つかりません',
          search: '検索',
          summary_type: '要約タイプ',
          original_email: '元のメール',
          ai_summary: 'AI要約',
          keywords: 'キーワード',
          executive_summary: 'エグゼクティブサマリー',
          abstract: 'アブストラクト',
          search_ticker: 'ティッカー/会社名を検索するか、AIチャットボットに尋ねてください',
          select_whatsapp_group: "WhatsAppグループを選択",
          no_groups_found: "グループが見つかりません",
          error_loading_groups: "グループの読み込みエラー",
          todays_axes: "今日の軸",
          trading_activity: "取引活動",
          client_data: "クライアントデータ",
          pms: "PMS",
          find: "検索...",
          Macro_Report_Generated : 'マクロレポートが生成されました',
          Global_Equity_Index_Futures: 'グローバル株式指数先物',
          Rates_Yield: '金利利回り',
          FX: "外国為替",
          Crypto: "暗号通貨",
          Loading: "読み込み中...",
          Treasury_Yields: "国債利回り",
          Equity_Futures: "株式先物",
          Investor_Relations_Inquiries: "投資家向け広報お問い合わせ",
          notification: {
          title: "通知",
          research: "調査",
          macro: "マクロ",
          Risk_Report: "リスクレポート",
          'risk report': "リスクレポート", // Ensure both cases are handled
          'corp act': "企業活動",
          inquiries: "お問い合わせ",
          pms: "PMS",
          all: "すべて",
            "expand": "展開",
            "collapse": "折りたたむ",
            "date": "日付",
            "due": "期限",
            "assigned_to": "割り当て先",
            "inquiry_assignee": "調査担当者",
            "action_required": "アクションが必要です: 締め切りが迫っています - 返答が必要です",
            "announcement_id": "アナウンスメントID",
            "account": "アカウント",
            "holding_quantity": "保有数量",
            "term_details": "条件の詳細",
            "pay_date": "支払い日",
            "read_more": "続きを読む",
            "close": "閉じる"
    },
    file_upload_wizard:{
      upload: "ファイルをアップロード",
      submit: "提出",
      drag_drop: "ファイルをここにドラッグ＆ドロップするか、クリックしてファイルを選択してください",
      or: "または",
      browse_file: "ファイルを参照",
      review: "ファイルを確認",
    },
    corporate_actions_1: {
      action_type: 'アクションタイプ',
      security_ticker: '証券/ティッカー',
      isin_cusip: 'ISIN/CUSIP',
      date_range: '日付範囲',
      corp_action_id: '企業活動ID',
      event_status: 'イベントステータス',
      event_type: 'イベントタイプ',
      account: 'アカウント',
      sort_by_action_required: 'アクションが必要な順に並べ替え',
      reset: 'リセット',
      search_placeholder: '最近の企業活動についてTransientAIに何でも尋ねてください。特定の情報を探している場合は、証券を含めてください',
    },
    "market_data_1": {
      "as_of": "基準日時",
      "quarterly_financials": "四半期財務",
      "revenue": "収益",
      "high": "高値",
      "open": "始値",
      "prev_close": "前日終値",
      "low": "安値",
    },
    full_view: "フルビュー",
    detailed: "詳細",
    risk_metrics: {
      MANAGER: "マネージャー",
      ENTITY: "エンティティ",
      GS_MARGIN_EXCESS: "GS 証拠金超過額",
      // Add other translations for this section
    },
    "pms_1": {
      "pnl_dashboard": "損益ダッシュボード for  "
    },
    "Date": "日付",
    "From": "送信者",
    "To": "宛先",
    "Subject": "件名",
    "Inquiry/Request": "問い合わせ/リクエスト",
    "Status": "状態",
    "Flag": "フラグ",
    "Due": "期限",
    "Date edited": "編集日"
        },
      },
    },
  });

export default i18n;
