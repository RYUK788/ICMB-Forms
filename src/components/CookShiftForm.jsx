/* eslint-disable */

import React, { useEffect, useState } from 'react';
import FormSubmitSection from './commons/FormSubmitSection';
import DynamicTable from './Table';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Spin,
  Tabs,
  Typography,
  notification,
} from 'antd';
import moment from 'moment';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchData } from '../api';
import { useSelector } from 'react-redux';
import RefreshButton from './commons/RefreshButton';
const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;
import dayjs from 'dayjs';

const selectStyle = {
  width: '100%',
};
const disabledFieldsConfig = {
  SLURRY: {
    '8:30': false,
    '10:30': true,
    '12:30': false,
    '2:30': false,
    '4:30': false,
    '6:30': false,
  },
  LIQ: {
    '8:30': true,
    '10:30': true,
    '12:30': true,
    '2:30': true,
    '4:30': true,
    '6:30': true,
  },
  SMT: {
    '8:30': false,
    '10:30': false,
    '12:30': false,
    '2:30': false,
    '4:30': false,
    '6:30': false,
  },
  FST: {
    '8:30': false,
    '10:30': false,
    '12:30': false,
    '2:30': false,
    '4:30': false,
    '6:30': false,
  },
  CIP: {
    '8:30': true,
    '10:30': true,
    '12:30': true,
    '2:30': true,
    '4:30': true,
    '6:30': true,
  },
  ABS: {
    '8:30': true,
    '10:30': true,
    '12:30': false,
    '2:30': true,
    '4:30': true,
    '6:30': true,
  },
};

export const CookShiftForm = () => {
  const [form] = Form.useForm();

  const generateTimeColumns = section => {
    const defaultTimeColumns = [
      {
        title: '8:30',
        dataIndex: '8:30',
        key: '8:30',
        editable: true,
        align: 'center',
        width: 95,
      },
      {
        title: '10:30',
        dataIndex: '10:30',
        key: '10:30',
        editable: true,
        align: 'center',

        width: 95,
      },
      {
        title: '12:30',
        dataIndex: '12:30',
        key: '12:30',
        editable: true,
        align: 'center',

        width: 95,
      },
      {
        title: '2:30',
        dataIndex: '2:30',
        key: '2:30',
        editable: true,
        align: 'center',

        width: 95,
      },
      {
        title: '4:30',
        dataIndex: '4:30',
        key: '4:30',
        editable: true,
        align: 'center',

        width: 95,
      },
      {
        title: '6:30',
        dataIndex: '6:30',
        key: '6:30',
        editable: true,
        align: 'center',

        width: 95,
      },
    ];

    return defaultTimeColumns.map(column => ({
      ...column,
      disabled: disabledFieldsConfig[section]?.[column.title] || false, // Check config
    }));
  };

  const defaultsections = [
    {
      title: 'SLURRY',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          align: 'start',
          width: 200,
        },
        {
          title: 'Target',
          dataIndex: 'target',
          key: 'target',
          width: 100,
          align: 'start',
        },
        ...generateTimeColumns('SLURRY'),
      ],
      data: [
        { key: '1', parameter: 'pH', target: '4.9' },
        { key: '2', parameter: 'Solids', target: '34+' },
        { key: '3', parameter: 'destiny loop flow', target: '4.8' },
        { key: '4', parameter: 'destiny loop flush', target: '4.8' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'ph' &&
          (column === '10:30' || column === '2:30' || column === '6:30')
        )
          return true; // Example: SLURRY - pH - 10:30 disabled
        if (
          parameter.toLowerCase() === 'density loop flush' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled
        return false;
      },
      removeInput: (parameter, column) => {
        return false;
      },
    },
    {
      title: 'LIQ',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
          align: 'start',
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('LIQ'),
      ],
      data: [
        { key: '1', parameter: 'pHIC-2402', target: '>35' },
        { key: '2', parameter: 'pH', target: '4.9' },
        { key: '3', parameter: 'Solids', target: '34+' },
        { key: '4', parameter: 'density loop flow', target: '4.8' },
        { key: '5', parameter: 'density loop flush', target: '4.8' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'phic-2402' &&
          (column === '10:30' || column === '2:30' || column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled
        // LIQ - pH - 2:30 disabled
        if (
          parameter.toLowerCase() === 'ph' &&
          (column === '10:30' || column === '2:30' || column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled
        if (
          parameter.toLowerCase() === 'density loop flush' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled

        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:30 disabled
        return false;
      },
    },
    {
      title: 'SMT',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('SMT'),
      ],
      data: [
        { key: '1', parameter: 'MZSA solids %', target: '' },
        { key: '2', parameter: 'MZSA flushed', target: '40' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'mzsa solids %' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled
        if (
          parameter.toLowerCase() === 'mzsa flushed' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // SLURRY - Solids - 12:30 disabled

        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:30 disabled
        return false;
      },
    },
    {
      title: 'FST',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('FST'),
      ],
      data: [
        {
          key: '', // Blank key
          parameter: 'no', // Blank parameter
          target: '', // Blank target
          '8:30': '1A-39%', // Time column data
          '10:30': '2B-48%',
          '12:30': '2A-56%',
          '2:30': '2B-34%',
          '4:30': '3A-67%',
          '6:30': '3B-76%',
        },
        { key: '1', parameter: 'paddlescreen solids', target: '>184.0' },
        { key: '2', parameter: 'paddlescreen flushes', target: '>184.0' },
        {
          key: '', // Blank key
          parameter: 'no2', // Blank parameter
          target: '', // Blank target
          '8:30': '1', // Time column data
          '10:30': '2',
          '12:30': '3',
          '2:30': '4',
          '4:30': '',
          '6:30': '',
        },
        { key: '3', parameter: 'Fiber press', target: '>185.5' },
        { key: '4', parameter: 'pass 4 vapor line drained', target: '>198.4' },
      ],
      disabledLogic: (parameter, column) => {
        return false;
      },
      removeInput: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'paddlescreen flushes' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '6:30' ||
            column === '4:30')
        )
          return true;
        if (
          parameter.toLowerCase() === 'fiber press' &&
          (column === '6:30' || column === '4:30')
        )
          return true;
        if (
          parameter.toLowerCase() === 'pass 4 vapor line drained' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '6:30' ||
            column === '4:30')
        )
          return true;

        if (parameter.toLowerCase() === 'no2') {
          return true;
        }
        // SLURRY - Solids - 12:30 disabled
        return false;
      },
    },
    {
      title: 'CIP',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('CIP'),
      ],
      data: [
        { key: '1', parameter: '% caustic', target: '>32' },
        { key: '2', parameter: 'pH', target: '<8' },
        { key: '3', parameter: 'appearance', target: '<8' },

        { key: '4', parameter: 'CIP screen cleaned', target: '<8' },
      ],
      disabledLogic: (parameter, column) => {
        return false;
      },
      removeInput: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'ph' &&
          (column === '4:30' || column === '2:30')
        )
          return true; // Example: SLURRY - pH - 10:30 disabled
        if (
          parameter.toLowerCase() === '% caustic' &&
          (column === '4:30' || column === '2:30')
        )
          return true; // Example: SLURRY - pH - 10:30 disabled
        if (
          parameter.toLowerCase() === 'appearance' &&
          (column === '4:30' || column === '2:30')
        )
          return true; // Example: SLURRY - pH - 10:30 disabled
        if (
          parameter.toLowerCase() === 'cip screened cleaned' &&
          (column === '4:30' || column === '2:30')
        )
          return true; // Example: SLURRY - pH - 10:30 disabled
        // SLURRY - Solids - 12:30 disabled
        return false;
      },
    },
    {
      title: 'ABS',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('ABS'),
      ],
      data: [
        { key: '1', parameter: 'Level / Flow', target: '<9.5' },
        { key: '2', parameter: 'SCALPER DUMPSTER CHECK', target: '' },
        { key: '2', parameter: 'Check & Clean J Tubes', target: '' },
        { key: '3', parameter: 'Slurry Strainer', target: '' },
        { key: '4', parameter: 'Sump Strainer', target: '' },
        { key: '4', parameter: 'Milling & Bucket Elevator ', target: '' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'scalper dumpster check' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // ABS - Level/Flow - 2:30 disabled
        // ABS - Level/Flow - 2:30 disabled
        return false;
      },
      removeInput: (parameter, column) => {
        if (
          parameter.toLowerCase() === 'level / flow' &&
          (column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true;
        if (
          parameter.toLowerCase() === 'check & clean J tubes' &&
          (column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // ABS - Level/Flow - 2:30 disabled
        if (
          parameter.toLowerCase() === 'slurry strainer' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // ABS - Level/Flow - 2:30 disabled
        if (
          parameter.toLowerCase() === 'sump strainer' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // ABS - Level/Flow - 2:30 disabled
        if (
          parameter.toLowerCase() === 'sump strainer' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true; // ABS - Level/Flow - 2:30 disabled
        if (
          parameter.toLowerCase() === 'milling & bucket elevator' &&
          (column === '10:30' ||
            column === '12:30' ||
            column === '2:30' ||
            column === '4:30' ||
            column === '6:30')
        )
          return true;
        return false;
      },
    },
  ];

  const currentUser = useSelector(state => state.user);
  const [sections, setSections] = useState(defaultsections);
  const [previousData, setPreviousData] = useState(defaultsections);
  const [operatorList, setOperatorList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [targetList, setTargetList] = useState([]);
  // Loading states
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // General columns for time-based inputs
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity
  const [modifiedFields, setModifiedFields] = useState({});
  // Comment in the submit section
  const [comment, setComment] = useState('');

  // for setting comments
  const handleCommentChange = e => {
    setComment(e.target.value);
    console.log(e.target.value);
  };

  const resetTableData = () => {
    setSections(defaultsections);
  };

  const validateForm = () => {
    const values = form.getFieldsValue();
    // Check if all three fields have values
    const isValid = values.date && values.shift && values.operator;
    setIsFormValid(isValid);
  };

  // Use Form's onValuesChange to validate fields in real time
  const handleFormChange = () => {
    validateForm();
  };

  const updateDefaultSections = apiData => {
    // Initialize defaultSections structure

    // Group API data by category
    const groupedData = apiData.reduce((acc, item) => {
      if (item.category) {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push({
          key: acc[item.category].length + 1, // Assign a unique key based on the count
          parameter: item.parameter,
          target: item.value,
        });
      }

      return acc;
    }, {});
    console.log('groupedData', groupedData);
    if (groupedData['FST']) {
      // Extract dynamic target values from the grouped data
      const getDynamicValue = parameter => {
        console.log('group data', groupedData);
        console.log('dynamic parameter', parameter);
        const match = groupedData['FST'].find(
          item => item.parameter === parameter,
        );
        return match ? match.target : '';
      };

      groupedData['FST'].unshift({
        key: '', // Blank key
        parameter: 'no', // Example placeholder parameter
        target: '', // Blank target
        '8:30': `1A-${getDynamicValue('1A')}`, // Use dynamic value for 1A
        '10:30': `2B-${getDynamicValue('2B')}`,
        '12:30': `2A-${getDynamicValue('2A')}`,
        '2:30': `2B-${getDynamicValue('2B')}`,
        '4:30': `3A-${getDynamicValue('3A')}`,
        '6:30': `3B-${getDynamicValue('3B')}`,
      });
      groupedData['FST'].splice(3, 0, {
        key: '', // Blank key
        parameter: 'no2', // Example placeholder parameter
        target: '', // Blank target
        '8:30': `${getDynamicValue('1')}`, // Use dynamic value for 1A
        '10:30': `${getDynamicValue('2')}`,
        '12:30': `${getDynamicValue('3')}`,
        '2:30': `${getDynamicValue('4')}`,
        '4:30': ``,
        '6:30': ``,
      });
      // const excludeParameters = ['1A', '1B', '2A', '2B', '3A', '3'];
      const excludeParameters = [
        '1A',
        '1B',
        '2A',
        '2B',
        '3A',
        '3B',
        '1',
        '2',
        '3',
        '4',
      ];
      groupedData['FST'] = groupedData['FST'].filter(
        item => !excludeParameters.includes(item.parameter),
      );
    }
    // Iterate through the grouped data and match category titles in defaultSections
    return sections.map(section => {
      const categoryData = groupedData[section.title];
      const newTitle = Object.keys(groupedData).find(
        key => key.toLowerCase() === section.title.toLowerCase(),
      );
      console.log('newTitle', newTitle);
      if (categoryData) {
        return {
          ...section,
          title: newTitle || section.title,
          data: categoryData,
        };
      }
      return section;
    });
  };

  const resetTimeColumnsInSections = () => {
    const timeColumnKeys = generateTimeColumns('FST').map(col => col.dataIndex);

    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        data: section.data.map(row => {
          const updatedRow = { ...row };
          timeColumnKeys.forEach(key => {
            if (updatedRow.hasOwnProperty(key)) {
              updatedRow[key] = ''; // Reset time column value to 0
            }
          });
          return updatedRow;
        }),
      })),
    );
  };
  // Function to update sectionData based on query data
  const updateSectionData = queryData => {
    const updatedSectionData = sections.map(section => {
      const matchingData = queryData.filter(
        data => data.category.toLowerCase() === section.title.toLowerCase(),
      );

      // Update the rows in the section based on the query data
      const updatedData = section.data.map(row => {
        // Loop over the matching data and directly set the hour: entered_value
        let updatedRow = { ...row };

        // Filter the matching data for the current row's parameter
        const matchedRows = matchingData.filter(
          data => data.parameter.toLowerCase() === row.parameter.toLowerCase(),
        );

        // Iterate over the matched rows to create hour: entered_value
        matchedRows.forEach(matchedRow => {
          updatedRow[matchedRow.hour] = matchedRow.entered_value;
        });

        return updatedRow;
      });

      return { ...section, data: updatedData };
    });
    setSections(updatedSectionData);
    setPreviousData(updatedSectionData);

    // setSectionData(updatedSectionData);
  };

  // Handle input changes
  // Handler function to update data
  const handleInputChange = (sectionTitle, rowKey, column, value) => {
    // Update the data within the specified section
    const updatedSections = sections.map(section => {
      if (section.title.toLowerCase() === sectionTitle.toLowerCase()) {
        const updatedData = section.data.map(item => {
          if (item.key === rowKey) {
            return { ...item, [column]: value }; // Update specific field
          }
          return item;
        });
        return { ...section, data: updatedData };
      }
      return section;
    });
    setSections(updatedSections); // Update the state with new data
  };

  const generateSQL = async (formData, currentData, previousData) => {
    const { date, shift, operator, walkThroughFirst, walkThroughLast } =
      formData;
    const formattedDate = moment(date).format('YYYY-MM-DD');

    for (const section of currentData) {
      const validTimeColumns = generateTimeColumns(section.title);

      // Find the corresponding previous data section
      const previousSection = previousData.find(
        prev => prev.title.toLowerCase() === section.title.toLowerCase(),
      );

      for (const row of section.data) {
        const { parameter, target, ...times } = row;

        // Find the corresponding row in previous data
        const previousRow = previousSection?.data.find(
          prevRow => prevRow.parameter === row.parameter,
        );

        for (let time in times) {
          const enteredValue = times[time];

          if (!validTimeColumns.some(col => col.key === time)) {
            continue; // Skip invalid time columns
          }

          const previousValue = previousRow ? previousRow[time] : undefined;

          if (
            (enteredValue && enteredValue.trim() !== '') ||
            previousValue === null
          ) {
            if (previousValue === undefined) {
              // New value: Generate INSERT query
              const insertQuery = `INSERT INTO cooks (datetime, date, shift, operator, hour, category, parameter, target, entered_value, user) 
                                                 VALUES (NOW(), '${formattedDate}', '${shift}', '${operator}', '${time}', '${section.title}', '${parameter}', '${target}', '${enteredValue}', '${currentUser.username}');`;

              try {
                const response = await fetchData(insertQuery);

                if (
                  response.error ||
                  response['Query Run Status']?.startsWith('Query run failed')
                ) {
                  notification.error({
                    message: `Data Saved  Failed`,
                    description: response.error || response['Query Run Status'],
                    placement: 'topRight',
                  });
                } else {
                  notification.success({
                    message: `Data Saved Successfully`,
                    description: `Data for ${parameter} at ${time} inserted successfully.`,
                    placement: 'topRight',
                  });

                  setPreviousData(currentData);
                }
              } catch (error) {
                notification.error({
                  message: `Insert Error`,
                  description: error.message,
                  placement: 'topRight',
                });
              }
            } else if (enteredValue !== previousValue && previousValue !== '') {
              // Changed value: Generate UPDATE query
              console.log('running update query', previousValue);
              const updateQuery = `UPDATE cooks SET entered_value = '${enteredValue}',user = '${currentUser.username}',datetime= NOW(),operator= '${operator}' WHERE date = '${formattedDate}' AND shift = '${shift}' AND hour = '${time}' AND category = '${section.title}' AND parameter = '${parameter}';`;

              try {
                const response = await fetchData(updateQuery);

                if (
                  response.error ||
                  response['Query Run Status']?.startsWith('Query run failed')
                ) {
                  notification.error({
                    message: `Data Update  Failed`,
                    description: response.error || response['Query Run Status'],
                    placement: 'topRight',
                  });
                } else {
                  notification.success({
                    message: ` Data Update Successfully`,
                    description: `Data for ${parameter} at ${time} updated successfully.`,
                    placement: 'topRight',
                  });
                  setSections(defaultsections);
                }
              } catch (error) {
                notification.error({
                  message: `Update Error`,
                  description: error.message,
                  placement: 'topRight',
                });
              }
            }
          }
        }
      }
    }
    resetTableData();
    handleWalkthroughSubmit();
    // if (walkThroughFirst && walkThroughFirst.length > 0) {
    //     await insertWalkthroughData(
    //         walkThroughFirst,
    //         formattedDate,
    //         shift,
    //         'Cook',
    //         currentUser,
    //         '07:15:00',
    //     );
    // }

    // // Handling walkThroughLast
    // if (walkThroughLast && walkThroughLast.length > 0) {
    //     await insertWalkthroughData(
    //         walkThroughLast,
    //         formattedDate,
    //         shift,
    //         'Cook',
    //         currentUser,
    //         '06:15:00',
    //     );
    // }
  };

  const handleWalkthroughSubmit = async () => {
    const selectedDate = form.getFieldValue('date');
    const selectedShift = form.getFieldValue('shift');

    if (!selectedDate || !selectedShift) {
      notification.error({
        message: 'Missing Data',
        description: 'Please select both date and shift before submitting.',
        placement: 'topRight',
      });
      return;
    }

    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    const walkThroughFirst = form.getFieldValue('walkThroughFirst') || [];
    const walkThroughLast = form.getFieldValue('walkThroughLast') || [];
    let anyApiFailure = false;

    try {
      // Fetch existing walkthrough data for the date and shift
      const existingQuery = `SELECT * FROM walkthroughs WHERE date = '${formattedDate}' AND shift = '${selectedShift}'`;
      const existingData = await fetchData(existingQuery);

      // Prepare walkthrough data to compare and insert/update
      const walkthroughData = [
        { hour: '07:15:00', data: walkThroughFirst },
        { hour: '06:15:00', data: walkThroughLast },
      ];

      for (const { hour, data } of walkthroughData) {
        const walkthroughColumns = {
          BUCKETS: data.includes('BUCKETS') ? 1 : 0,
          HOSES: data.includes('HOSES') ? 1 : 0,
          DOORS: data.includes('DOORS') ? 1 : 0,
          TRASH: data.includes('TRASH') ? 1 : 0,
          SAMPLE_PORTS: data.includes('SAMPLE PORTS') ? 1 : 0,
        };

        const allValuesZero = Object.values(walkthroughColumns).every(
          value => value === 0,
        );
        if (allValuesZero) {
          console.log(`Skipping hour ${hour} as all walkthrough values are 0.`);
          continue;
        }
        // Check if there's an existing entry for this hour
        const existingEntry = existingData.find(entry => entry.hour === hour);

        if (existingEntry) {
          // Compare current data with existing data
          const hasChanges =
            existingEntry.buckets !== walkthroughColumns.BUCKETS ||
            existingEntry.hoses !== walkthroughColumns.HOSES ||
            existingEntry.doors !== walkthroughColumns.DOORS ||
            existingEntry.trash !== walkthroughColumns.TRASH ||
            existingEntry.sample_ports !== walkthroughColumns.SAMPLE_PORTS;

          if (hasChanges) {
            // Update query
            const updateQuery = `UPDATE walkthroughs 
                                             SET buckets = ${walkthroughColumns.BUCKETS}, 
                                                 hoses = ${walkthroughColumns.HOSES}, 
                                                 doors = ${walkthroughColumns.DOORS}, 
                                                 trash = ${walkthroughColumns.TRASH}, 
                                                 sample_ports = ${walkthroughColumns.SAMPLE_PORTS}, 
                                                 user = '${currentUser.username}' 
                                             WHERE date = '${formattedDate}' 
                                             AND shift = '${selectedShift}' 
                                             AND hour = '${hour}';`;

            const response = await fetchData(updateQuery);

            if (
              response.error ||
              response['Query Run Status']?.startsWith('Query run failed')
            ) {
              notification.error({
                message: 'Data Update  Failed',
                description: response.error || response['Query Run Status'],
                placement: 'topRight',
              });
              anyApiFailure = true;
            } else {
              notification.success({
                message: 'Data Update Successfully',
                description: `Walkthrough data for ${hour} updated successfully.`,
                placement: 'topRight',
              });
              form.resetFields();
            }
          }
        } else {
          // Insert query for new data
          const insertQuery = `INSERT INTO walkthroughs 
                                         (datetime, date, shift, hour, buckets, hoses, doors, trash, sample_ports, form_type, user) 
                                         VALUES (NOW(), '${formattedDate}', '${selectedShift}', '${hour}', 
                                                 ${walkthroughColumns.BUCKETS}, 
                                                 ${walkthroughColumns.HOSES}, 
                                                 ${walkthroughColumns.DOORS}, 
                                                 ${walkthroughColumns.TRASH}, 
                                                 ${walkthroughColumns.SAMPLE_PORTS}, 
                                                 'Cook', '${currentUser.username}');`;

          const response = await fetchData(insertQuery);

          if (
            response.error ||
            response['Query Run Status']?.startsWith('Query run failed')
          ) {
            notification.error({
              message: 'Data Saved  Failed',
              description: response.error || response['Query Run Status'],
              placement: 'topRight',
            });
            anyApiFailure = true;
          } else {
            notification.success({
              message: 'Data Saved Successfully',
              description: `Walkthrough data for ${hour} inserted successfully.`,
              placement: 'topRight',
            });
            form.resetFields();
          }
        }
      }
    } catch (error) {
      notification.error({
        message: 'Error Handling Walkthrough Data',
        description: error.message || 'An unexpected error occurred.',
        placement: 'topRight',
      });
    } finally {
      if (!anyApiFailure) {
        form.resetFields();
      }
    }
  };

  const insertWalkthroughData = async (
    walkThroughData,
    formattedDate,
    shift,
    formType,
    currentUser,
    hour,
  ) => {
    const walkthroughColumns = {
      BUCKETS: walkThroughData.includes('BUCKETS') ? 1 : 0,
      HOSES: walkThroughData.includes('HOSES') ? 1 : 0,
      DOORS: walkThroughData.includes('DOORS') ? 1 : 0,
      TRASH: walkThroughData.includes('TRASH') ? 1 : 0,
      SAMPLE_PORTS: walkThroughData.includes('SAMPLE PORTS') ? 1 : 0,
    };

    const walkthroughQuery = `INSERT INTO walkthroughs (datetime, date, shift, hour, buckets, hoses, doors, trash, sample_ports, form_type, user)VALUES (NOW(), '${formattedDate}', '${shift}', '${hour}', ${walkthroughColumns.BUCKETS}, ${walkthroughColumns.HOSES}, ${walkthroughColumns.DOORS}, ${walkthroughColumns.TRASH}, ${walkthroughColumns.SAMPLE_PORTS}, '${formType}', '${currentUser.username}');`;

    try {
      const response = await fetchData(walkthroughQuery);

      if (
        response.error ||
        response['Query Run Status']?.startsWith('Query run failed')
      ) {
        notification.error({
          message: `${formType} Saved Failed`,
          description: response.error || response['Query Run Status'],
          placement: 'topRight',
        });
      } else {
        notification.success({
          message: ` walkthrough Saved Successfully`,
          description: `${formType} walkthrough data inserted successfully.`,
          placement: 'topRight',
        });
        form.resetFields();
      }
    } catch (error) {
      notification.error({
        message: `${formType} Insert Error`,
        description: error.message,
        placement: 'topRight',
      });
    }
  };

  // submitting comment
  const submitComment = async () => {
    form.validateFields().then(async () => {
      const { formattedDate, shift, operator, user } = getFiledValues();
      const insertQuery = `insert into cookshift_comments (cookshift_entry_date,user,date,shift,operator,comment) values (NOW(),'${user}','${formattedDate}','${shift}','${operator}','${comment}');`;

      try {
        const response = await fetchData(insertQuery);
        if (
          response.error ||
          response['Query Run Status']?.startsWith('Query run failed')
        ) {
          notification.error({
            message: 'Comment Save Failed',
            description: response.error || response['Query Run Status'],
            placement: 'topRight',
          });
        } else {
          notification.success({
            message: 'Comment Saved Successfully',
            description: `Data of '${formattedDate}' at ${shift} by '${operator}' inserted successfully.`,
            placement: 'topRight',
          });
          setComment('');
        }
      } catch (error) {
        notification.error({
          message: 'Comment Insert Error',
          description: error.message,
          placement: 'topRight',
        });
      }
    });
  };

  const handleSubmit = async () => {
    form.validateFields().then(async formData => {
      if (comment.trim() !== '') {
        submitComment();
      }
      const sqlQuery = generateSQL(formData, sections, previousData);
    });
  };

  const handleRefresh = async () => {
    form.validateFields(['date', 'shift']).then(async formData => {
      const selectedData = formData?.date;
      const formattedDate = moment(selectedData).format('YYYY-MM-DD');
      const shift = formData?.shift;
      fetchAndPopulateFieldData(formattedDate, shift);
    });
  };

  const handleShift = async e => {
    const selectedDate = form.getFieldValue('date');
    if (!selectedDate) {
      return; // If no date is selected, return early
    }

    // Format the selected date (moment handles it automatically)
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    // setIsLoadingOperators(true);
    // try {
    //   // console.log('lead operator name', shiftList[e - 1].lead_operator_name);
    //   // const name = shiftList[e - 1].lead_operator_name;
    //   const operatorResult = await fetchData(
    //     `select name,position from operators;`,
    //   );
    //   setOperatorList(operatorResult);
    // } catch (error) {
    //   notification.error({
    //     message: 'Error Fetching Operators',
    //     description: error.message,
    //   });
    // } finally {
    //   setIsLoadingOperators(false);
    // }
    // if (!date) {
    //   return; // If no date is selected, return early
    // }
    resetTimeColumnsInSections();
    setModifiedFields([]);
    fetchAndPopulateFieldData(formattedDate, e);
  };

  const fetchAndPopulateFieldData = async (formattedDate, e) => {
    try {
      const query = `SELECT * FROM cooks WHERE date = '${formattedDate}' and shift='${e}'`;
      setIsTableLoading(true);
      const data = await fetchData(query);
      // Assuming data contains the result of the query
      if (data && data.length > 0) {
        updateSectionData(data);
        // setCooksData(data);
      } else {
        notification.info({
          message: 'No Data Found',
          description: `No records found for the selected date: ${formattedDate}`,
          placement: 'topRight',
        });
        // setSections(defaultsections); //changed code
      }
    } catch (error) {
      notification.error({
        message: 'Error Fetching Data',
        description: error.message || 'An error occurred while fetching data.',
        placement: 'topRight',
      });
    } finally {
      setIsTableLoading(false);
    }
    try {
      // Fetch walkthrough data for the selected date and shift
      const walkthroughQuery = `SELECT * FROM walkthroughs WHERE date = '${formattedDate}' AND shift = '${e}'AND form_type='Cook';`;
      const walkthroughResult = await fetchData(walkthroughQuery);

      if (walkthroughResult && walkthroughResult.length > 0) {
        autoPopulateWalkthrough(walkthroughResult);
      } else {
      }
    } catch (error) {
      notification.error({
        message: 'Error Fetching Walkthrough Data',
        description:
          error.message || 'An error occurred while fetching walkthrough data.',
        placement: 'topRight',
      });
    }
  };

  const handleDateChange = () => {
    form.setFieldsValue({ shift: undefined, operator: undefined });
    return false;
  };

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        setIsLoadingShifts(true);
        const shiftResult = await fetchData('select * from shifts');
        console.log('shift data', shiftResult); // added line for display of results
        setShiftList(shiftResult);
        const targetResult = await fetchData('select * from targets');
        console.log('target result', targetResult);
        const updatedSections = updateDefaultSections(targetResult);
        console.log('updated sections', updatedSections);
        console.log('the previous data', sections);
        setSections(updatedSections);
        console.log('the updated data', sections);
        setPreviousData(updatedSections);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingShifts(false);
      }
    };
    validateForm(); // Initial validation
    fetchDataSequentially();
  }, []);

  const getOperatorList = async () => {
    setIsLoadingOperators(true);
    try {
      // console.log('lead operator name', shiftList[e - 1].lead_operator_name);
      // const name = shiftList[e - 1].lead_operator_name;
      const operatorResult = await fetchData(
        `select name,position from operators;`,
      );
      setOperatorList(operatorResult);
    } catch (error) {
      notification.error({
        message: 'Error Fetching Operators',
        description: error.message,
      });
    } finally {
      setIsLoadingOperators(false);
    }
    if (!date) {
      return; // If no date is selected, return early
    }
  };
  useEffect(() => {
    getOperatorList();
  }, []);
  const autoPopulateWalkthrough = walkthroughData => {
    // Map data into form fields for walkthroughs
    const walkThroughFirst = [];
    const walkThroughLast = [];

    walkthroughData.forEach(entry => {
      if (entry.hour === '07:15:00') {
        if (entry.buckets) walkThroughFirst.push('BUCKETS');
        if (entry.hoses) walkThroughFirst.push('HOSES');
        if (entry.doors) walkThroughFirst.push('DOORS');
        if (entry.trash) walkThroughFirst.push('TRASH');
        if (entry.sample_ports) walkThroughFirst.push('SAMPLE PORTS');
      } else if (entry.hour === '06:15:00') {
        if (entry.buckets) walkThroughLast.push('BUCKETS');
        if (entry.hoses) walkThroughLast.push('HOSES');
        if (entry.doors) walkThroughLast.push('DOORS');
        if (entry.trash) walkThroughLast.push('TRASH');
        if (entry.sample_ports) walkThroughLast.push('SAMPLE PORTS');
      }
    });

    // Set form values for walkthroughs
    form.setFieldsValue({
      walkThroughFirst,
      walkThroughLast,
    });
  };

  const getFiledValues = () => {
    const date = form.getFieldValue('date');
    const formattedDate = moment(date)?.format('YYYY-MM-DD');
    const shift = form.getFieldValue('shift');
    const operator = form.getFieldValue('operator');
    const user = currentUser?.username;
    return {
      formattedDate,
      shift,
      operator,
      user,
    };
  };

  const getSubjectAndBodyForEmail = () => {
    // const date = form.getFieldValue('date');
    // const formattedDate = moment(date)?.format('YYYY-MM-DD');
    // const shift = form.getFieldValue('shift');
    // const operator = form.getFieldValue('operator');
    const { formattedDate, shift, operator, user } = getFiledValues();
    return {
      emailSubject: `Comment from batch ${formattedDate}_${shift}_${operator}`,
      emailBody: `Date: ${formattedDate}\nShift: ${shift}\nOperator: ${operator}\n\nComment: ${comment.trim()}`,
    };
  };

  const { emailSubject, emailBody } = getSubjectAndBodyForEmail();

  const disableFutureDates = current => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        form={form}
        style={{
          display: 'flex',
          flexDirection: 'column',
          // overflow: 'scroll',
          alignItems: 'flex-start',
        }}
        onValuesChange={handleFormChange}
      >
        {/* DatePicker with label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '50px',
          }}
        >
          {/* <div> */}

          <Form.Item
            label=" Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              placeholder=""
              disabledDate={disableFutureDates}
            />
          </Form.Item>

          {/* </div> */}
          {/* Select 1 with label */}
          <Form.Item
            label="Lead Operator Name"
            name="shift"
            rules={[{ required: true, message: 'Please select a shift!' }]}
          >
            <Select
              showSearch
              // style={selectStyle}
              style={{ width: '160px' }}
              optionFilterProp="children"
              suffixIcon={<SearchOutlined />}
              onChange={e => handleShift(e)}
              loading={isLoadingShifts}
            >
              {shiftList.map(shift => (
                <Option
                  value={shift.lead_operator_name}
                  key={shift.lead_operator_name}
                >
                  {shift.lead_operator_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Select 2 with label */}
          <Form.Item
            label="Operator"
            name="operator"
            rules={[{ required: true, message: 'Please select an operator!' }]}
          >
            <Select
              showSearch
              style={{ width: '160px' }}
              optionFilterProp="children"
              suffixIcon={<SearchOutlined />}
              loading={isLoadingOperators}
            >
              {operatorList.map((operator, index) => (
                <Option value={operator.name} key={`${operator.name}`}>
                  {operator.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <RefreshButton handleRefresh={handleRefresh} />
        </div>
        <Divider />

        <div>
          <Tabs size="large" type="card">
            {sections.map(section => (
              <TabPane tab={section.title} key={section.title}>
                <Spin spinning={isTableLoading} indicator={<LoadingOutlined />}>
                  <div
                    className="form-table-title"
                    style={{
                      pointerEvents: isFormValid ? 'auto' : 'none', // Disable interaction if form is invalid
                    }}
                  >
                    <DynamicTable
                      columnsConfig={section.columns}
                      data={section.data}
                      highlightRows={false}
                      disabledLogic={section.disabledLogic}
                      removeInput={section.removeInput}
                      setModifiedFields={setModifiedFields}
                      modifiedFields={modifiedFields}
                      onInputChange={(rowKey, column, value) =>
                        handleInputChange(section.title, rowKey, column, value)
                      }
                    />
                    <br />
                  </div>
                </Spin>
              </TabPane>
            ))}
          </Tabs>
        </div>
        <div>
          <Title level={5}>Walkthrough</Title>
          <Tabs size="large" type="card" tabPosition="left">
            <TabPane tab={'7:15 AM'} key={'0'} className="walkthrough-tabs">
              <Form.Item label="" name="walkThroughFirst">
                <Checkbox.Group
                  options={[
                    'BUCKETS',
                    'HOSES',
                    'DOORS',
                    'TRASH',
                    'SAMPLE PORTS',
                  ]}
                  className="walkthrough-checkbox"
                />
              </Form.Item>
            </TabPane>
            <TabPane tab={'6:15 PM'} key={'1'} className="walkthrough-tabs">
              <Form.Item label="" name="walkThroughLast">
                <Checkbox.Group
                  options={[
                    'BUCKETS',
                    'HOSES',
                    'DOORS',
                    'TRASH',
                    'SAMPLE PORTS',
                  ]}
                  className="walkthrough-checkbox"
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        </div>
      </Form>

      <Row style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
        <FormSubmitSection
          form={form}
          comment={comment}
          isFormValid={isFormValid}
          handleCommentChange={handleCommentChange}
          handleSaveClick={handleSubmit}
          initialSubject={emailSubject}
          initialBody={emailBody}
          textBoxWidth="540px"
        />
        {/* <Button
          type="primary"
          size="large"
          disabled={!isFormValid}
          style={{ backgroundColor: '#1C2444', color: '#ffffff' }}
          className="button-style"
          onClick={() => handleSubmit()}
        >
          Save
        </Button> */}
      </Row>
    </div>
  );
};
