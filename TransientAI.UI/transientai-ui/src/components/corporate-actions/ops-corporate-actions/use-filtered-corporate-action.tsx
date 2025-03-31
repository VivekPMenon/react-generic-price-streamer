import { useMemo } from "react";

export interface SortedData {
    acquired: any[];
    no_action_acquired: any[];
    expired: any[];
}

export const useFilteredCorporateActions = (opsData: any, filterActions: any, sortByAction: boolean) => {

    const today = new Date().toISOString().split('T')[0];
    const filteredAndSortedData: SortedData = useMemo(() => {
      if (!opsData) return { acquired: [], no_action_acquired: [], expired: [] };

      return opsData.reduce(
        (acc: SortedData, item: any) => {  
          const payDate = item.dates.pay_date.split("T")[0];
  
          // Apply filters
          const meetsActionTypeFilter = !filterActions.actionType || 
            (filterActions.actionType === 'Action Required' && item.actionRequired) ||
            (filterActions.actionType === 'No Action Required' && !item.actionRequired);

          const meetsTickerFilter = !filterActions.securityTicker || 
            item.ticker === filterActions.securityTicker;

          const meetsIdentifierFilter = !filterActions.securityidentifier || 
            item.isin == filterActions.securityidentifier;

          const meetsDateRangeFilter = !filterActions.dateRange || 
            ((!filterActions.dateRange[0] || payDate >= filterActions.dateRange[0]) && 
             (!filterActions.dateRange[1] || payDate <= filterActions.dateRange[1]));

          const meetsCorpActionIdFilter = !filterActions.corpActionId || 
            item.eventId === filterActions.corpActionId;
  
          const meetsEventStatusFilter = !filterActions.eventStatus || 
            item.eventStatus === filterActions.eventStatus;
  
          const meetsEventTypeFilter = !filterActions.eventType || 
            item.eventType === filterActions.eventType;
  
          const meetsAccountFilter = !filterActions.account || 
            item.accounts.some((account: any) => 
              account.accountNumber === filterActions.account || 
              account.accountReference === filterActions.account
            );
  
          // Combine all filter conditions
          const passesAllFilters = 
            meetsActionTypeFilter && 
            meetsTickerFilter &&
            meetsIdentifierFilter && 
            meetsDateRangeFilter && 
            meetsCorpActionIdFilter && 
            meetsEventStatusFilter && 
            meetsEventTypeFilter && 
            meetsAccountFilter;
  
          // Categorize filtered items
          if (passesAllFilters) {
            if (payDate < today) {
              acc.expired.push(item);
            } else if (item.requirements.action_required) {
              acc.acquired.push(item);
            } else {
              acc.no_action_acquired.push(item);
            }
          }

          return acc;
        },
        { acquired: [], no_action_acquired: [], expired: [] }
      );
    }, [opsData, filterActions, today, sortByAction]);

    if (!sortByAction) {
      return { 
        acquired: [
          ...filteredAndSortedData.acquired, 
          ...filteredAndSortedData.no_action_acquired, 
          ...filteredAndSortedData.expired
        ], 
        no_action_acquired: [], 
        expired: [] 
      };
    }

    return filteredAndSortedData;
  };