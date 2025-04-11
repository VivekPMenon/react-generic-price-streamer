import {
  CorporateAction,
  IFilterActions,
} from "@/services/corporate-actions/model";
import { useMemo } from "react";

interface SortedData {
  "Action Required": CorporateAction[];
  "No Action Required": CorporateAction[];
  Expired: CorporateAction[];
}

interface PmData {
  [key: string]: CorporateAction[];
}

export const useFilterPmCorporateActions = (
  pmData: PmData,
  filterActions: IFilterActions,
  sortByAction: boolean
): SortedData => {
  const applyFilters = (items: CorporateAction[] = []): CorporateAction[] => {
    return items.filter((item) => {
      const payDate = item.dates?.pay_date?.split("T")[0] || "";

      const meetsActionTypeFilter =
        !filterActions.actionType ||
        (filterActions.actionType === "Action Required" &&
          item.actionRequired) ||
        (filterActions.actionType === "No Action Required" &&
          !item.actionRequired);

      const meetsTickerFilter =
        !filterActions.securityTicker ||
        item?.ticker === filterActions.securityTicker;

      const meetsIdentifierFilter =
        !filterActions.securityidentifier ||
        item?.isin === filterActions.securityidentifier;

      const meetsDateRangeFilter =
        !filterActions.dateRange ||
        ((!filterActions.dateRange[0] ||
          payDate >= filterActions.dateRange[0]) &&
          (!filterActions.dateRange[1] ||
            payDate <= filterActions.dateRange[1]));

      const meetsCorpActionIdFilter =
        !filterActions.corpActionId ||
        item.eventId === filterActions.corpActionId;

      const meetsEventStatusFilter =
        !filterActions.eventStatus ||
        item.eventStatus === filterActions.eventStatus;

      const meetsAccountFilter =
        !filterActions.account ||
        item.accounts?.some(
          (acc) => acc.accountNumber === filterActions.account
        );

      const meetsEventTypeFilter =
        !filterActions.eventType || item.eventType === filterActions.eventType;

      return (
        meetsActionTypeFilter &&
        meetsTickerFilter &&
        meetsIdentifierFilter &&
        meetsDateRangeFilter &&
        meetsCorpActionIdFilter &&
        meetsEventStatusFilter &&
        meetsAccountFilter &&
        meetsEventTypeFilter
      );
    });
  };

  const filteredAndSortedData = useMemo(() => {
    if (!pmData) {
      return {
        "Action Required": [],
        "No Action Required": [],
        Expired: [],
      };
    }

    return {
      "Action Required": applyFilters(pmData["Action Required"]),
      "No Action Required": applyFilters(pmData["No Action Required"]),
      Expired: applyFilters(pmData["Expired"]),
    };
  }, [pmData, filterActions]);

  if (!sortByAction) {
    return {
      "Action Required": [
        ...filteredAndSortedData["Action Required"],
        ...filteredAndSortedData["No Action Required"],
        ...filteredAndSortedData["Expired"],
      ],
      "No Action Required": [],
      Expired: [],
    };
  }

  return filteredAndSortedData;
};
