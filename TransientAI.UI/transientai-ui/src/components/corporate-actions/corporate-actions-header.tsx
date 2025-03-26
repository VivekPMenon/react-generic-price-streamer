import { useMemo, useState } from 'react';
import styles from './corporate-actions.module.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Toggle from 'react-toggle';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { FilterDropDown } from './filter-dropdown';
import { useCorpActionsStore } from '@/services/corporate-actions';

export const CorporateActionHeader = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { userContext } = useUserContextStore();
    const { corpActions } = useCorpActionsStore();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    function onSearchQueryChange(event: any) {
        setSearchQuery(event.target.value);
    }

    const uniqueFilters = useMemo(() => {
        const eventTypeSet = new Set<string>();
        const eventStatusSet = new Set<string>();
        const accountSet = new Set<string>();
        const securitySet = new Set<string>();
        const corpActionId = new Set<string>();

        corpActions.forEach((item) => {
            if (item.eventType) eventTypeSet.add(item.eventType);
            if (item.eventStatus) eventStatusSet.add(item.eventStatus);
            if (item.eventId) corpActionId.add(item.eventId)
            if (item.accounts) {
                item.accounts.forEach((acc) => {
                    if (acc.accountNumber) accountSet.add(acc.accountNumber);
                });
            }
            const securityTicker = item.security?.identifiers?.ticker || item.security?.name;
            if (securityTicker) securitySet.add(securityTicker);
        });

        return {
            eventTypeOptions: Array.from(eventTypeSet).map((value) => ({ label: value, value })),
            eventStatusOptions: Array.from(eventStatusSet).map((value) => ({ label: value, value })),
            corpActionIdOptions: Array.from(corpActionId).map((value) => ({ label: value, value })),
            accountOptions: Array.from(accountSet).map((value) => ({ label: value, value })),
            securityOptions: Array.from(securitySet).map((value) => ({ label: value, value })),
        }
    }, [corpActions])

    const filterConfig = [
        {
          key: "actionType",
          label: "Action Type",
          type: "dropdown",
          options: [
            { value: "true", label: "Action Required" },
            { value: "false", label: "No Action Required" },
          ]
        },
        {
          key: "securityTicker",
          label: "Security/Ticker",
          type: "dropdown",
          options: uniqueFilters.securityOptions,
          isSearchable: true
        },
        {
          key: "isinCusip",
          label: "ISIN/CUSIP",
          type: "dropdown",
          options: [
            { value: "cusip", label: "CUSIP" },
            { value: "isin", label: "ISIN" },
          ],
        },
        {
          key: "dateRange",
          label: "Date Range",
          type: "date",
        },
        {
          key: "corpActionId",
          label: "Corp Action ID",
          type: "dropdown",
          options: uniqueFilters.corpActionIdOptions,
          isSearchable: true
        },
        {
          key: "eventStatus",
          label: "Event Status",
          type: "dropdown",
          options: uniqueFilters.eventStatusOptions,
          isSearchable: true
        },
        {
          key: "eventType",
          label: "Event Type",
          type: "dropdown",
          options: uniqueFilters.eventTypeOptions,
          isSearchable: true
        },
        {
          key: "account",
          label: "Account",
          type: "dropdown",
          options: uniqueFilters.accountOptions,
          isSearchable: true
        },
      ];

    return(
        <div>
            <section className='flex gap-[30px] items-center mb-3'>
                <div className={`${styles['search-bar']} flex-1 basis-1/2`}>
                    <input
                        type="text"
                        value={''}
                        onChange={event => onSearchQueryChange(event)}
                        placeholder="Ask TransientAI anything about recent Corporate Actions. Include securities if you are looking for specific information" />
                    {
                        // userContext.roles?.includes(RoleType.Operations) && <>
                        // {/* <Toggle
                        //     checked={isCompactViewEnabled}
                        //     onChange={(e) => setIsCompactViewEnabled(e.target.checked)}
                        // /> */}
                        // <span className="whitespace-nowrap">Compact View</span>
                        // </>
                    }
                </div>

                <div className='flex-1 basis-1/2'>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='sort-action'>Sort by Action Required</label>
                            <Toggle
                            id='sort-action'
                            defaultChecked={true}
                            onChange={() => null} 
                            className={styles['custom-toggle']}
                            />
                        </div>

                        <button className='button !py-1 !px-2'>Reset</button>
                    </div>
                </div>
            </section>

            {/* Show only for OPS view filter */}
            <section>
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
                            value={null}
                            options={filter.options || []}
                            onChange={(value) => null}
                            
                        />
                        )}

                        {filter.type === "date" && (
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={() => null}
                            isClearable={true}
                            className="w-full"
                            wrapperClassName="w-full"
                        />
                        )}
                    </div>
                    ))}
                </div>
            </section>

        </div>
    )
}