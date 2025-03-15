'use client';
import { breakNewsDataService } from '@/services/break-news/break-news-data-service';
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store';
import React, { useCallback, useEffect, useState } from 'react';
import { IGroupList } from './models';
import Select from 'react-select';

const WhatsAppGroupDropdown = () => {
  const [groupList, setGroupList] = useState<IGroupList[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IGroupList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setGroupId, selectedGroupId } = useBreakNewsDataStore();

  // Convert group list to format required by react-select
  const groupOptions = groupList.map(group => ({
    value: group.group_id,
    label: group.group_name,
    group: group
  }));

  // Handle group selection
  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedGroup(selectedOption.group);
      setGroupId(selectedOption.value);
    }
  };

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await breakNewsDataService.getGroupList();
      const groupData = response as IGroupList[] || [];
      setGroupList(response as IGroupList[] || []);
       // Set the first group as the default selection
       if (groupData.length > 0) {
        setSelectedGroup(groupData[0]);
        setGroupId(groupData[0].group_id);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroupId && groupList.length > 0) {
      const foundGroup = groupList.find(x => x.group_id === selectedGroupId);
      setSelectedGroup(foundGroup || null);
    }
  }, [groupList, selectedGroupId]);

  // Custom styles for react-select to match your dark theme
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937', // bg-gray-800
      borderColor: '#374151', // border-gray-700
      color: 'white',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#4B5563' // border-gray-600 on hover
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937', // bg-gray-800
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#4B5563' // bg-gray-600 for selected
        : state.isFocused 
          ? '#374151' // bg-gray-700 for focused
          : '#1f2937', // bg-gray-800 for default
      color: 'white',
      '&:hover': {
        backgroundColor: '#374151', // bg-gray-700 on hover
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9CA3AF' // text-gray-400
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#9CA3AF', // text-gray-400
      '&:hover': {
        color: 'white'
      }
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: '#4B5563' // bg-gray-600
    }),
  };

  return (
    <div className="flex-grow">
      <Select
        isLoading={isLoading}
        options={groupOptions}
        styles={customStyles}
        placeholder="Select WhatsApp Group"
        value={selectedGroup ? {
          value: selectedGroup.group_id,
          label: selectedGroup.group_name,
          group: selectedGroup
        } : null}
        onChange={handleSelectChange}
        className="text-base"
        classNamePrefix="select"
        isSearchable={true}
        noOptionsMessage={() => "No groups found"}
      />
    </div>
  );
};

export default WhatsAppGroupDropdown;