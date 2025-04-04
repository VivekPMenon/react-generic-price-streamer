import { useMemo, useState } from 'react';
import styles from './corporate-actions.module.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Toggle from 'react-toggle';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { FilterDropDown } from './filter-dropdown';
import { useCorpActionsStore } from '@/services/corporate-actions';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

interface FilterActions {
  actionType: boolean;
  securityTicker: string | null;
  securityidentifier: string | null;
  dateRange: string | null;
  corpActionId: string | null;
  eventStatus: string | null;
  eventType: string | null;
  account: string | null;
}

interface FilterConfigItem {
  key: keyof FilterActions; 
  label?: string;
  type?: any;
  options?: { value: string; label: string }[];
  isSearchable?: boolean;
}

export const CorporateActionHeader = () => {
  const { t } = useTranslation();  // Initialize translation hook
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { userContext } = useUserContextStore();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const {
    corpActions,
    filterActions,
    sortByAction,
    reset,
    setFilterActions,
    setSortByAction,
  } = useCorpActionsStore();

  function onSearchQueryChange(event: any) {
    setSearchQuery(event.target.value);
  }

  const uniqueFilters = useMemo(() => {
    const eventTypeSet = new Set<string>();
    const eventStatusSet = new Set<string>();
    const accountSet = new Set<string>();
    const securitySet = new Set<string>();
    const corpActionId = new Set<string>();
    const isinSet = new Set<string>();

    corpActions.forEach((item) => {
      if (item.eventType) eventTypeSet.add(item.eventType);
      if (item.eventStatus) eventStatusSet.add(item.eventStatus);
      if (item.eventId) corpActionId.add(item.eventId);
      if (item.isin) isinSet.add(item.isin);
      if (item.accounts) {
        item.accounts.forEach((acc) => {
          if (acc.accountNumber) accountSet.add(acc.accountNumber);
        });
      }
      const securityTicker = item.ticker || item.security?.name;
      if (securityTicker) securitySet.add(securityTicker);
    });

    return {
      eventTypeOptions: Array.from(eventTypeSet).map((value) => ({ label: value, value })),
      eventStatusOptions: Array.from(eventStatusSet).map((value) => ({ label: value, value })),
      corpActionIdOptions: Array.from(corpActionId).map((value) => ({ label: value, value })),
      accountOptions: Array.from(accountSet).map((value) => ({ label: value, value })),
      securityOptions: Array.from(securitySet).map((value) => ({ label: value, value })),
      isinOptions: Array.from(isinSet).map((value) => ({ label: value, value }))
    }
  }, [corpActions])

  const filterConfig: FilterConfigItem[] = [
    {
      key: "actionType",
      label: t('corporate_actions_1.action_type'),  // Use translation for label
      type: "dropdown",
      options: [
        { value: "Action Required", label: t('corporate_actions_1.action_required') },  // Translated values
        { value: "No Action Required", label: t('corporate_actions_1.no_action_required') },  // Translated values
      ]
    },
    {
      key: "securityTicker",
      label: t('corporate_actions_1.security_ticker'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.securityOptions,
      isSearchable: true
    },
    {
      key: "securityidentifier",
      label: t('corporate_actions_1.isin_cusip'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.isinOptions
    },
    {
      key: "dateRange",
      label: t('corporate_actions_1.date_range'),  // Translated label
      type: "date",
    },
    {
      key: "corpActionId",
      label: t('corporate_actions_1.corp_action_id'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.corpActionIdOptions,
      isSearchable: true
    },
    {
      key: "eventStatus",
      label: t('corporate_actions_1.event_status'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.eventStatusOptions,
      isSearchable: true
    },
    {
      key: "eventType",
      label: t('corporate_actions_1.event_type'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.eventTypeOptions,
      isSearchable: true
    },
    {
      key: "account",
      label: t('corporate_actions_1.account'),  // Translated label
      type: "dropdown",
      options: uniqueFilters.accountOptions,
      isSearchable: true
    },
  ];

  const handleFilterChange = (key: string, value: any) => {
    let setValue = value ? value.value : null;
    if (key !== "dateRange") {
      setFilterActions(key, setValue);
    }
  };

  const handleDateFilter = (key: string, value: any) => {
    const formattedDates = value.map((date: any) =>
      date ? new Date(date).toISOString().split("T")[0] : null
    );
    setDateRange(value);
    if (formattedDates.length > 1) {
      setFilterActions(key, formattedDates);
    }
  };

  const handleReset = () => {
    reset();
    setDateRange([null, null]);
  };

  return (
    <div>
      <section className='flex gap-[30px] items-center mb-3'>
        <div className={`${styles['search-bar']} flex-1 basis-1/2`}>
          <input
            type="text"
            value={searchQuery}
            onChange={event => onSearchQueryChange(event)}
            placeholder={t('corporate_actions_1.search_placeholder')}  // Translated placeholder text
          />
        </div>

        <div className='flex-1 basis-1/2'>
          <div className='flex gap-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='sort-action'>{t('corporate_actions_1.sort_by_action_required')}</label>  {/* Translated label */}
              <Toggle
                id='sort-action'
                defaultChecked={sortByAction}
                checked={sortByAction}
                onChange={() => setSortByAction(!sortByAction)} 
                className={styles['custom-toggle']}
              />
            </div>

            <button className='button !py-1 !px-2'
              onClick={handleReset}
            >
              {t('corporate_actions_1.reset')}  {/* Translated Reset button */}
            </button>
          </div>
        </div>
      </section>

      {/* Show only for OPS view filter */}
      {!(userContext.role === RoleType.PM) && <section>
        <div className={`${styles['corporate-filter-cont']} mb-3 grid lg:grid-cols-8 md:grid-cols-2 gap-4`}>
          {filterConfig.map((filter) => (
            <div key={filter.key} className={`${styles['search-filter-input']} `}>
              <label className="block mb-1">{filter.label}</label>

              {filter.type === "input" && (
                <input
                  className="w-full"
                  type='text'
                  onChange={(e) => null}
                />
              )}

              {filter.type === "dropdown" && (
                <FilterDropDown
                  isSearchable={filter.isSearchable ? filter.isSearchable : false}
                  value={
                    filterActions[filter.key]
                      ? { value: filterActions[filter.key], label: filterActions[filter.key] }
                      : null
                  }
                  options={filter.options || []}
                  onChange={(value) => handleFilterChange(filter.key!, value)} 
                />
              )}

              {filter.type === "date" && (
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update: any) => handleDateFilter(filter.key!, update)}
                  isClearable={true}
                  className="w-full"
                  wrapperClassName="w-full"
                />
              )}
            </div>
          ))}
        </div>
      </section>
      }
    </div>
  );
};
