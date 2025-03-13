'use client';
import { breakNewsDataService } from '@/services/break-news/break-news-data-service';
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store';
import React, { useCallback, useEffect, useState } from 'react';
import { IGroupList } from './models';


const WhatsAppGroupDropdown = () => {
 
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [groupList, setGroupList] = useState<IGroupList[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IGroupList>();
  const [isLoading, setIsLoading] = useState(false);
  const { setGroupId,selectedGroupId } = useBreakNewsDataStore();

  // Filter groups based on search text
  const filteredGroups = groupList.filter(group => 
    group.group_name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle group selection
  const selectGroup = (group: IGroupList) => {
    setSelectedGroup(group);
    setGroupId(group.group_id);
    setIsOpen(false);
  };

    const fetchGroups = useCallback(async () => {
    setIsLoading(true);
      try {
        const response = await breakNewsDataService.getGroupList()
        setGroupList(response as IGroupList[] || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
          setIsLoading(false);
      }
    },[]);

  useEffect(()=>{
    fetchGroups();
  },[fetchGroups]);

  useEffect(()=>{
    if(selectedGroupId){
        const set = groupList.find(x=> x.group_id == selectedGroupId);
        setSelectedGroup(set);
    }
  },[groupList, selectedGroupId])

  return (
    <div className="flex-grow">
      <div className="relative">
        {/* Selected Group Display */}
        <div 
          className="flex items-center bg-gray-800 text-white p-3 rounded-t-md cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="inline-block">
            {/* <span className="text-green-600 mr-2 text-xl">{selectedGroup.icon}</span> */}
            <span>{selectedGroup?.group_name}</span>
          </div>
          <span className="ml-auto">▼</span>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute w-full bg-gray-700 rounded-b-md shadow-lg z-10">
            {/* Search Bar */}
            <div className="p-2 border-b border-gray-600 flex items-center">
              <input
                type="text"
                placeholder="Search groups..."
                className="bg-gray-800 text-white w-full p-2 rounded-md outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Group List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <div
                    key={group.group_id}
                    className="flex items-center p-3 hover:bg-gray-600 cursor-pointer"
                    onClick={() => selectGroup(group)}
                  >
                    {/* <span className="text-xl mr-3">{group.icon}</span> */}
                    <span className="text-white">{group.group_name}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-center">No groups found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppGroupDropdown;