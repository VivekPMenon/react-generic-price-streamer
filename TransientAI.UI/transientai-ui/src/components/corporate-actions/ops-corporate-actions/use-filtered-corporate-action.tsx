import { ViewType } from "@/services/corporate-actions";
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
          const deadline = item.dates.deadline?.split("T")[0];
          
  
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
            // Handle potential invalid dates
            const validPayDate = payDate && !isNaN(new Date(payDate).getTime());
            const validDeadline = deadline && !isNaN(new Date(deadline).getTime());
                        
            // Check if the item is expired - both dates must be valid and in the past
            const isExpired = validPayDate && validDeadline && payDate < today && deadline < today;
            
            // For active items, at least one date should be in the future or equal to today
            const isActive = (validPayDate && payDate >= today) || (validDeadline && deadline >= today);
            
            if (isExpired) {
              item['viewType'] = ViewType.EXPIRED;
              acc.expired.push(item);
            } else if (isActive) {
              if (item.actionRequired) {
                item['viewType'] = ViewType.AC_REQUIRED;
                acc.acquired.push(item);
              } else {
                item['viewType'] = ViewType.NO_AC_REQUIRED;
                acc.no_action_acquired.push(item);
              }
            }
          }

          return acc;
        },
        { acquired: [], no_action_acquired: [], expired: [] }
      );
    }, [opsData, filterActions, today]);

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