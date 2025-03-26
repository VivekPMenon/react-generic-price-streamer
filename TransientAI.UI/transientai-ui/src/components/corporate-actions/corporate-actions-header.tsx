import { useState } from 'react';
import styles from './corporate-actions.module.scss';
import { RoleType, useUserContextStore } from '@/services/user-context';
import Toggle from 'react-toggle';

export const CorporateActionHeader = () => {
    const { userContext } = useUserContextStore();
      const [searchQuery, setSearchQuery] = useState<string>('');

    function onSearchQueryChange(event: any) {
        setSearchQuery(event.target.value);
    }

    return(
        <div>
            <section className='flex gap-4 items-center'>
                <div className={`${styles['search-bar']} flex-1 basis-1/2`}>
                    <input
                        type="text"
                        value={''}
                        onChange={event => onSearchQueryChange(event)}
                        placeholder="Ask TransientAI anything about recent Corporate Actions. Include securities if you are looking for specific information" />
                    {
                        userContext.roles?.includes(RoleType.Operations) && <>
                        {/* <Toggle
                            checked={isCompactViewEnabled}
                            onChange={(e) => setIsCompactViewEnabled(e.target.checked)}
                        /> */}
                        <span className="whitespace-nowrap">Compact View</span>
                        </>
                    }
                </div>

                <div className='flex-1 basis-1/2'>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <span>Sort by Ation Required</span>
                            <Toggle />
                        </div>

                        <button>Reset</button>
                    </div>
                </div>
            </section>

            {/* Show only for OPS view */}
            <section>
                filter
            </section>

        </div>
    )
}