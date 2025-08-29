/* eslint-disable */
import React, { useEffect, useState } from 'react';
import DynamicTable from './Table';
import FormSubmitSection from './commons/FormSubmitSection';
import dayjs from 'dayjs';

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Spin,
  Tabs,
  notification,
  Typography,
} from 'antd';
import moment from 'moment';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchData } from '../api';
import { useSelector } from 'react-redux';
import RefreshButton from './commons/RefreshButton';
const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const selectStyle = {
  width: '100%',
};
const disabledFieldsConfig = {
  SLURRY: {
    '8:00': false,
    '10:00': true,
    '12:00': false,
    '2:00': false,
    '4:00': false,
    '6:00': false,
  },
  LIQ: {
    '8:00': true,
    '10:00': true,
    '12:00': true,
    '2:00': true,
    '4:00': true,
    '6:00': true,
  },
  SMT: {
    '8:00': false,
    '10:00': false,
    '12:00': false,
    '2:00': false,
    '4:00': false,
    '6:00': false,
  },
  FST: {
    '8:00': false,
    '10:00': false,
    '12:00': false,
    '2:00': false,
    '4:00': false,
    '6:00': false,
  },
  CIP: {
    '8:00': true,
    '10:00': true,
    '12:00': true,
    '2:00': true,
    '4:00': true,
    '6:00': true,
  },
  ABS: {
    '8:00': true,
    '10:00': true,
    '12:00': false,
    '2:00': true,
    '4:00': true,
    '6:00': true,
  },
};

export const DEForm = () => {
  const [form] = Form.useForm();

  const generateTimeColumns = section => {
    const defaultTimeColumns = [
      {
        title: '8:00',
        dataIndex: '8:00',
        key: '8:00',
        editable: true,
        align: 'center',
        width: 75,
      },
      {
        title: '10:00',
        dataIndex: '10:00',
        key: '10:00',
        editable: true,
        align: 'center',
        width: 75,
      },
      {
        title: '12:00',
        dataIndex: '12:00',
        key: '12:00',
        editable: true,
        align: 'center',

        width: 75,
      },
      {
        title: '2:00',
        dataIndex: '2:00',
        key: '2:00',
        editable: true,
        align: 'center',

        width: 75,
      },
      {
        title: '4:00',
        dataIndex: '4:00',
        key: '4:00',
        editable: true,
        align: 'center',

        width: 75,
      },
      {
        title: '6:00',
        dataIndex: '6:00',
        key: '6:00',
        editable: true,
        align: 'center',
        width: 75,
      },
    ];

    return defaultTimeColumns.map(column => ({
      ...column,
      disabled: disabledFieldsConfig[section]?.[column.title] || false, // Check config
    }));
  };

  // doing tweaking the time column code for display data in cent form
  const generateCentColumns = section => {
    const defaultTimeColumns = [
      {
        title: '#2',
        dataIndex: '#2',
        key: '#2',
        editable: true,
        align: 'center',
        width: 75,
      },
      {
        title: '#3',
        dataIndex: '#3',
        key: '#3',
        editable: true,
        align: 'center',
        width: 75,
      },
      {
        title: '#4',
        dataIndex: '#4',
        key: '#4',
        editable: true,
        align: 'center',

        width: 75,
      },
    ];

    return defaultTimeColumns.map(column => ({
      ...column,
      // disabled: disabledFieldsConfig[section]?.[column.title] || false, // Check config
    }));
  };

  const defaultsections = [
    {
      title: 'EVAP',
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
        ...generateTimeColumns('EVAP'),
      ],
      data: [
        { key: '1', parameter: 'Draw Pump', target: '4.9' },
        { key: '2', parameter: 'Tricantor Solids', target: '34+' },
        { key: '3', parameter: 'Tricantor PH', target: '4.8' },
      ],
      disabledLogic: (parameter, column) => {
        console.log('prama', parameter, column);
        if (
          parameter.toLowerCase() === 'draw pump' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // Example: SLURRY - pH - 10:00 disabled

        if (
          parameter.toLowerCase() === 'tricantor ph' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:00 disabled
        return false;
      },
    },
    {
      title: 'DISTILLATION',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('DISTILLATION'),
      ],
      data: [
        { key: '1', parameter: '190 Deck Proof', target: '>184.0' },
        { key: '2', parameter: '190 Filter Proof', target: '>184.0' },
        { key: '3', parameter: 'Reflux Proof', target: '>185.5' },
        { key: '4', parameter: '200 Proof', target: '>198.4' },
        { key: '5', parameter: '200 Proof KF', target: '>198.4' },
        { key: '6', parameter: 'Fusel Proof', target: '>198.4' },
        { key: '7', parameter: '% Fusels', target: '>198.4' },
        // { key: '8', parameter: 'Baseless and pH', target: '>198.4' },
        { key: '8', parameter: 'BC Loss', target: '>198.4' },
        { key: '9', parameter: 'SS Data', target: '>198.4' },
        { key: '10', parameter: 'pH', target: '>198.4' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          parameter.toLowerCase() === '190 deck proof' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        // LIQ - pH - 2:00 disabled
        if (
          parameter.toLowerCase() === 'reflux proof' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true;
        if (
          parameter.toLowerCase() === '190 filter proof' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        if (
          parameter.toLowerCase() === 'reflux proof' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        if (
          parameter.toLowerCase() === '200 proof' &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        if (
          parameter.toLowerCase() === 'fusel proof' &&
          (column === '8:00' ||
            column === '10:00' ||
            column === '2:00' ||
            column === '6:00' ||
            column === '4:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        if (
          parameter.toLowerCase() === '% fusels' &&
          (column === '8:00' ||
            column === '10:00' ||
            column === '2:00' ||
            column === '6:00' ||
            column === '4:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled
        if (
          parameter.toLowerCase() === 'baseloss and ph' &&
          (column === '8:00' || column === '12:00' || column === '4:00')
        )
          return true; // SLURRY - Solids - 12:00 disabled

        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:00 disabled
        return false;
      },
    },
    {
      title: 'CENT.',
      // columns: [
      //   {
      //     title: <div className="table-title-column">Parameter</div>,
      //     dataIndex: 'parameter',
      //     key: 'parameter',
      //     width: 200,
      //   },
      //   { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
      //   // ...generateTimeColumns('CENT.'),
      //   ...generateCentColumns('CENT.'),
      // ],
      // data: [
      //   { key: '1', parameter: 'Hood Flush', target: '' },
      //   { key: '2', parameter: 'Decanter Solids', target: '40' },
      //   { key: '3', parameter: 'Centrate Solids', target: '40' },
      //   { key: '4', parameter: 'Centrate HPLC', target: '40' },
      // ],
      // disabledLogic: (parameter, column) => {
      //   return false;
      // },
      // removeInput: (parameter, column) => {
      //   if (
      //     parameter.toLowerCase() === 'centrate solids' &&
      //     (column === '#3' || column === '#4')
      //   ) {
      //     return true;
      //   }
      //   if (
      //     parameter.toLowerCase() === 'centrate hplc' &&
      //     (column === '#3' || column === '#4')
      //   ) {
      //     return true;
      //   }
      //   return false;
      // },
      tabs: [
        {
          title: 'CENT2',
          columns: [
            {
              title: <div className="table-title-column">Parameter</div>,
              dataIndex: 'parameter',
              key: 'parameter',
              width: 200,
            },
            { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
            // ...generateTimeColumns('CENT.'),
            ...generateCentColumns('CENT.'),
          ],
          data: [
            { key: '1', parameter: 'Hood Flush', target: '' },
            { key: '2', parameter: 'Decanter Solids', target: '40' },
            { key: '3', parameter: 'Centrate Solids', target: '40' },
            { key: '4', parameter: 'Centrate HPLC', target: '40' },
          ],
          disabledLogic: (parameter, column) => {
            return false;
          },
          removeInput: (parameter, column) => {
            if (
              parameter.toLowerCase() === 'centrate solids' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            if (
              parameter.toLowerCase() === 'centrate hplc' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            return false;
          },
        },
        {
          title: 'CENT3',
          columns: [
            {
              title: <div className="table-title-column">Parameter</div>,
              dataIndex: 'parameter',
              key: 'parameter',
              width: 200,
            },
            { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
            // ...generateTimeColumns('CENT.'),
            ...generateCentColumns('CENT.'),
          ],
          data: [
            { key: '1', parameter: 'Hood Flush', target: '' },
            { key: '2', parameter: 'Decanter Solids', target: '40' },
            { key: '3', parameter: 'Centrate Solids', target: '40' },
            { key: '4', parameter: 'Centrate HPLC', target: '40' },
          ],
          disabledLogic: (parameter, column) => {
            return false;
          },
          removeInput: (parameter, column) => {
            if (
              parameter.toLowerCase() === 'centrate solids' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            if (
              parameter.toLowerCase() === 'centrate hplc' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            return false;
          },
        },
        {
          title: 'CENT4',
          columns: [
            {
              title: <div className="table-title-column">Parameter</div>,
              dataIndex: 'parameter',
              key: 'parameter',
              width: 200,
            },
            { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
            // ...generateTimeColumns('CENT.'),
            ...generateCentColumns('CENT.'),
          ],
          data: [
            { key: '1', parameter: 'Hood Flush', target: '' },
            { key: '2', parameter: 'Decanter Solids', target: '40' },
            { key: '3', parameter: 'Centrate Solids', target: '40' },
            { key: '4', parameter: 'Centrate HPLC', target: '40' },
          ],
          disabledLogic: (parameter, column) => {
            return false;
          },
          removeInput: (parameter, column) => {
            if (
              parameter.toLowerCase() === 'centrate solids' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            if (
              parameter.toLowerCase() === 'centrate hplc' &&
              (column === '#3' || column === '#4')
            ) {
              return true;
            }
            return false;
          },
        },
      ],
    },
    {
      title: 'Tricantor',
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
        { key: '1', parameter: 'Additive Rate', target: '' },
        { key: '2', parameter: 'Impeller Position', target: '' },
        { key: '3', parameter: 'Torque', target: '' },
        { key: '4', parameter: 'Feed Spin-ML', target: '' },
        { key: '5', parameter: 'Oil Clarity', target: '' },
        { key: '6', parameter: 'Oil Solids', target: '' },
        { key: '7', parameter: 'Return Oil', target: '' },

        { key: '8', parameter: 'GPM 3 Hour Trend', target: '' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          (parameter.toLowerCase() === 'additive rate' ||
            parameter.toLowerCase() === 'impeller position' ||
            parameter.toLowerCase() === 'torque' ||
            parameter.toLowerCase() === 'oil clarity' ||
            parameter.toLowerCase() === 'oil solids' ||
            parameter.toLowerCase() === 'return oil' ||
            parameter.toLowerCase() === 'gpm 3 hour trend') &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true;

        if (
          parameter.toLowerCase() === 'feed spin-ml' &&
          (column === '10:00' || column === '12:00' || column === '2:00')
        )
          return true;
        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:00 disabled
        return false;
      },
    },
    {
      title: 'FEED',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('FEED'),
      ],
      data: [
        { key: '1', parameter: 'DDG Moisture', target: '>32' },
        { key: '2', parameter: 'Gas Dryer Cyclones', target: '<8' },
        { key: '3', parameter: 'Steam Tube Drop Box', target: '>32' },
        { key: '4', parameter: 'Steam Tube Feed', target: '<8' },
        { key: '5', parameter: 'Steam Dryer Cyclone', target: '>32' },
        { key: '5', parameter: 'Wet Cake Moisture', target: '<8' },
      ],
      disabledLogic: (parameter, column) => {
        if (
          (parameter.toLowerCase() === 'gas dryer cyclones' ||
            parameter.toLowerCase() === 'steam tube drop box' ||
            parameter.toLowerCase() === 'steam tube feed' ||
            parameter.toLowerCase() === 'steam dryer cyclone') &&
          (column === '10:00' || column === '2:00' || column === '6:00')
        )
          return true;
        if (
          parameter.toLowerCase() === 'wet cake moisture' &&
          (column === '10:00' ||
            column === '12:00' ||
            column === '2:00' ||
            column === '6:00')
        )
          return true;
        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:00 disabled
        return false;
      },
    },
    {
      title: 'STORAGE',
      columns: [
        {
          title: <div className="table-title-column">Parameter</div>,
          dataIndex: 'parameter',
          key: 'parameter',
          width: 200,
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100 },
        ...generateTimeColumns('STORAGE'),
      ],
      data: [
        { key: '1', parameter: '200 Proof Tank', target: '<9.5' },
        { key: '2', parameter: 'KF - 200 Proof Tank', target: '' },
        { key: '3', parameter: 'CoA - 200 Proof Tank', target: '' },
        { key: '4', parameter: 'CoA KF - 200 Proof Tank', target: '' },
        { key: '5', parameter: 'Acidity - 200 Proof Tank', target: '' },
        { key: '6', parameter: '190 Proof Tank', target: '40' },
      ],
      disabledLogic: (parameter, column) => {
        // if (parameter.toLowerCase() === '200 proof tank' && column === '12:00')
        //   return true; // ABS - Level/Flow - 2:00 disabled
        if (
          (parameter.toLowerCase() === '190 proof tank' ||
            parameter.toLowerCase() === '200 proof tank' ||
            parameter.toLowerCase() === 'kf - 200 proof tank') &&
          (column === '10:00' ||
            column === '12:00' ||
            column === '2:00' ||
            column === '4:00' ||
            column === '6:00')
        )
          return true;

        if (
          (parameter.toLowerCase() === 'coa - 200 proof tank' ||
            parameter.toLowerCase() === 'coa kf - 200 proof tank' ||
            parameter.toLowerCase() === 'acidity - 200 proof tank') &&
          column !== '2:00'
        ) {
          return true;
        }
        return false;
      },
      removeInput: (parameter, column) => {
        // SLURRY - Solids - 12:00 disabled
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
  // General columns for time-based inputs
  // Loading states
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [modifiedFields, setModifiedFields] = useState({});
  // State to track form validity

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
        console.log('The parameter of table', item.parameter.toLowerCase());
      }
      return acc;
    }, {});
    console.log('groupedData', groupedData);
    // Iterate through the grouped data and match category titles in defaultSections
    return sections.map(section => {
      const categoryData = groupedData[section.title];
      const newTitle = Object.keys(groupedData).find(
        key => key.toLowerCase() === section.title.toLowerCase(),
      );
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
    console.log('Update Section called');
    let updatedSectionData = sections.map(section => {
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

    // updatedSectionData = updatedSectionData.map(section => {
    //   console.log('section in update section');
    //   let updatedData = {};
    //   if (section.title === 'CENT.') {
    //     for (const obj of section.tabs) {
    //       const matchedData = queryData.filter(
    //         item => item.category.toLowerCase() === obj.title.toLowerCase(),
    //       );
    //       console.log('matchedData', matchedData);
    //       updatedData = obj.data.map(row => {
    //         let updatedRow = { ...row };
    //         const matchedRows = matchedData.filter(
    //           data =>
    //             data.parameter.toLowerCase() === row.parameter.toLowerCase(),
    //         );
    //         console.log('matched rows', matchedRows);
    //         matchedRows.forEach(matchedRow => {
    //           updatedRow[matchedRow.hour] = matchedRow.entered_value;
    //           console.log('matched hour', matchedRow.hour);
    //           console.log('matched hour', matchedRow.entered_value);
    //         });
    //         console.log('updated row', updatedRow);
    //         return updatedRow;
    //       });
    //       console.log('updated data', updatedData);

    //       console.log('return data', {
    //         ...section,
    //         tabs: section.tabs.map(i => {
    //           console.log('HI1');
    //           if (obj.title.toLowerCase() === i.title.toLowerCase()) {
    //             console.log('Hi');
    //             console.log('Hi I', { ...i, data: updatedData });
    //             return { ...i, data: updatedData };
    //           }
    //           console.log('The other data', i);
    //           return i;
    //         }),
    //       });
    //       return {
    //         ...section,
    //         tabs: section.tabs.map(i => {
    //           console.log('HI1');
    //           if (obj.title.toLowerCase() === i.title.toLowerCase()) {
    //             console.log('Hi');
    //             console.log('Hi I', { ...i, data: updatedData });
    //             return { ...i, data: updatedData };
    //           }
    //           console.log('The other data', i);
    //           return i;
    //         }),
    //       };
    //     }
    //   }
    //   return section;
    // });

    updatedSectionData = updatedSectionData.map(section => {
      if (section.title === 'CENT.' && section.tabs) {
        return {
          ...section,
          tabs: section.tabs.map(obj => {
            const matchedData = queryData.filter(
              item => item.category.toLowerCase() === obj.title.toLowerCase(),
            );

            const updatedData = obj.data.map(row => {
              let updatedRow = { ...row };
              const matchedRows = matchedData.filter(
                data =>
                  data.parameter.toLowerCase() === row.parameter.toLowerCase(),
              );

              matchedRows.forEach(matchedRow => {
                updatedRow[matchedRow.hour] = matchedRow.entered_value;
              });

              return updatedRow;
            });

            return { ...obj, data: updatedData }; // Correctly updating each tab
          }),
        };
      }
      return section;
    });

    setSections(updatedSectionData);
    setPreviousData(updatedSectionData);
    console.log(' update', updatedSectionData);
    // setSectionData(updatedSectionData);
  };

  // Handle input changes
  // Handler function to update data
  const handleInputChange = (sectionTitle, rowKey, column, value) => {
    console.log(
      'sectionTitle,rowKey,column,value',
      sectionTitle,
      rowKey,
      column,
      value,
    );
    let updatedSections = defaultsections;
    if (
      sectionTitle === 'CENT2' ||
      sectionTitle === 'CENT3' ||
      sectionTitle === 'CENT4'
    ) {
      updatedSections = sections.map(section => {
        if (section.title === 'CENT.') {
          for (const obj of section.tabs) {
            console.log('title of tabs', obj.title);
            if (obj.title.toLowerCase() === sectionTitle.toLowerCase()) {
              const updatedData = obj.data.map(item => {
                if (item.key === rowKey) {
                  console.log('code inside the loop', {
                    ...item,
                    [column]: value,
                  });
                  return { ...item, [column]: value };
                }
                return item;
              });
              return {
                ...section,
                tabs: section.tabs.map(i => {
                  console.log('HI1');
                  if (sectionTitle.toLowerCase() === i.title.toLowerCase()) {
                    console.log('Hi');
                    console.log('Hi I', { ...i, data: updatedData });
                    return { ...i, data: updatedData };
                  }
                  console.log('The other data', i);
                  return i;
                }),
              };
            }
          }
        }
        return section;
      });
    } else {
      // Update the data within the specified section
      updatedSections = sections.map(section => {
        if (section.title === sectionTitle) {
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
    }

    console.log('updated sections', updatedSections);
    setSections(updatedSections); // Update the state with new data
  };

  //custom query generation for cent table

  const generateQueryForCentTable = async (tabs, data, formData) => {
    console.log('tabs data', tabs);
    const { date, shift, operator } = formData;
    const formattedDate = moment(date).format('YYYY-MM-DD');
    // Find the corresponding previous data section
    for (const tab of tabs) {
      console.log('step1 -  title', tab.title);

      const previousSection = previousData.find(
        prev => prev.title.toLowerCase() === 'cent.',
      );

      const previousCentTableTab = previousSection.tabs.find(
        p => p.title.toLowerCase() === tab.title.toLowerCase(),
      );

      for (const obj of tab.data) {
        console.log('step2  - data inside tabs', tab.data);
        const { key, parameter, target, ...columns } = obj; //the column containes the column #2,#3,#4
        const previousRow = previousCentTableTab?.data.find(
          prevRow => prevRow.parameter === parameter,
        );

        for (const col in columns) {
          console.log('step3 - columns', col);
          console.log('column in cent data', col);
          const previousValue = previousRow ? previousRow[col] : undefined;

          const enteredValue = obj[col];

          console.log('step4 - enteredValue');
          console.log('Entered values in cent form', obj[col]);
          console.log('Previous values in cent form', previousRow[col]);

          console.log('step 4 - formattedDate', formattedDate);
          console.log('step 4 - shift', shift);
          console.log('step 4 - operator', operator);
          console.log('step 4 - col', col);
          console.log('step 4 - tab.title', tab.title);
          console.log('step 4 - parameter', parameter);
          console.log('step 4 - target', target);
          console.log('step 4 - enteredValue', enteredValue);
          console.log('step 4 - currentUser.username', currentUser.username);
          if (enteredValue && enteredValue.trim !== '') {
            if (previousValue === undefined) {
              const insertQuery = `INSERT INTO DE(datetime, date, shift, operator, hour, category, parameter, target, entered_value, user) 
        VALUES (NOW(), '${formattedDate}', '${shift}', '${operator}', '${col}', '${tab.title}', '${parameter}', '${target}', '${enteredValue}', '${currentUser.username}');`;
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
                    // description: `Data for ${parameter} at ${time} inserted successfully.`,
                    description: `Data for ${parameter} data inserted successfully.`,
                    placement: 'topRight',
                  });
                  setPreviousData(data);
                  //newly added
                  setSections(defaultsections);
                  // form.resetFields();
                }
              } catch (error) {
                notification.error({
                  message: `Insert Error`,
                  description: error.message,
                  placement: 'topRight',
                });
              }
            } else if (enteredValue !== previousValue) {
              // Changed value: Generate UPDATE query
              const updateQuery = `UPDATE DE SET entered_value = '${enteredValue}',user = '${currentUser.username}',datetime= NOW(),operator= '${operator}' WHERE date = '${formattedDate}' AND shift = '${shift}' AND hour = '${col}' AND category = '${tab.title}' AND parameter = '${parameter}';`;

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
                    description: `Data for ${parameter} updated successfully.`,
                    placement: 'topRight',
                  });
                  // form.resetFields();
                  //newly added
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
  };

  const generateSQL = async (formData, currentData, previousData) => {
    const { date, shift, operator, walkThroughFirst, walkThroughLast } =
      formData;
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('current form data', currentData);

    for (const section of currentData) {
      const validTimeColumns = generateTimeColumns(section.title);

      // added by shree at 10-2-2025
      if (section.title === 'CENT.') {
        console.log('title of cent', section.title);
        generateQueryForCentTable(section.tabs, section.data, formData);
        continue;
      }

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

          if (enteredValue && enteredValue.trim() !== '') {
            if (previousValue === undefined) {
              // New value: Generate INSERT query
              // const insertQuery = `INSERT INTO DE (datetime, date, shift, operator, hour, category, parameter, target, entered_value, user)
              //                                    VALUES (NOW(), '${formattedDate}', '${shift}', '${operator}', '${time}', '${section.title}', '${parameter}', '${target}', '${enteredValue}', '${currentUser.username}');`;
              const insertQuery = `INSERT INTO DE (datetime, date, shift, operator, hour, category, parameter, target, entered_value, user) 
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
                    // description: `Data for ${parameter} at ${time} inserted successfully.`,
                    description: `Data for ${parameter} at ${time} inserted successfully.`,
                    placement: 'topRight',
                  });
                  setPreviousData(currentData);
                  // form.resetFields();
                }
              } catch (error) {
                notification.error({
                  message: `Insert Error`,
                  description: error.message,
                  placement: 'topRight',
                });
              }
            } else if (enteredValue !== previousValue) {
              // Changed value: Generate UPDATE query
              const updateQuery = `UPDATE DE SET entered_value = '${enteredValue}',user = '${currentUser.username}',datetime= NOW(),operator= '${operator}' WHERE date = '${formattedDate}' AND shift = '${shift}' AND hour = '${time}' AND category = '${section.title}' AND parameter = '${parameter}';`;

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
                  // form.resetFields();
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
    handleWalkthroughSubmit();
    // if (walkThroughFirst && walkThroughFirst.length > 0) {
    //   await insertWalkthroughData(
    //     walkThroughFirst,
    //     formattedDate,
    //     shift,
    //     'DE ',
    //     currentUser,
    //     '07:15:00',
    //   );
    // }

    // // Handling walkThroughLast
    // if (walkThroughLast && walkThroughLast.length > 0) {
    //   await insertWalkthroughData(
    //     walkThroughLast,
    //     formattedDate,
    //     shift,
    //     'DE ',
    //     currentUser,
    //     '06:15:00',
    //   );
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
                                                 'DE', '${currentUser.username}');`;

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
      anyApiFailure = true;
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
          message: `${formType} Insert Failed`,
          description: response.error || response['Query Run Status'],
          placement: 'topRight',
        });
      } else {
        notification.success({
          message: `${formType} Insert Success`,
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
      const insertQuery = `insert into de_comments (de_entry_date,user,date,shift,operator,comment) values (NOW(),'${user}','${formattedDate}','${shift}','${operator}','${comment}');`;

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
    //   const operatorResult = await fetchData(
    //     // `select name,position from operators where active_flag='1' and shift='${e}';`,
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
      const query = `SELECT * FROM DE  WHERE date = '${formattedDate}' and shift='${e}'`;

      setIsTableLoading(true);

      const data = await fetchData(query);
      // Assuming data contains the result of the query
      if (data && data.length > 0) {
        //make changes here for CENT tab , addition of tabs in frontend sections from backend section
        //tabs are differently stored in database havs to set them as data in default section
        // 12-2-2025
        console.log('Hello');

        console.log('data received from backend', data);

        updateSectionData(data);

        // setCooksData(data);
      } else {
        notification.info({
          message: 'No Data Found',
          description: `No records found for the selected date: ${formattedDate}`,
          placement: 'topRight',
        });
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
      const walkthroughQuery = `SELECT * FROM walkthroughs WHERE date = '${formattedDate}' AND shift = '${e}' AND form_type='DE';`;
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

        // const shiftResult = await fetchData('select * from shifts');// created new shifts table with lead operator name
        const shiftResult = await fetchData('select * from shifts');
        setShiftList(shiftResult);
        // const targetResult = await fetchData('select * from DE_targets'); //created new shofts table with lead operator name
        const targetResult = await fetchData('select * from DE_targets');
        const updatedSections = updateDefaultSections(targetResult);
        console.log('updatedSections', updatedSections);
        setSections(updatedSections);
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
      const operatorResult = await fetchData(
        // `select name,position from operators where active_flag='1' and shift='${e}';`,
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
  const disableFutureDates = current => {
    return current && current > dayjs().endOf('day');
  };

  const { emailSubject, emailBody } = getSubjectAndBodyForEmail();

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
        onError={e => console.log('error info', e)}
      >
        {/* DatePicker with label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '50px',
          }}
        >
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

          {/* Select 1 with label */}
          <Form.Item
            label="Lead Operator Name"
            name="shift"
            rules={[{ required: true, message: 'Please select a shift!' }]}
          >
            <Select
              showSearch
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
                    {section.title === 'CENT.' ? (
                      <Tabs type="card">
                        {section.tabs.map(sec => (
                          <TabPane tab={sec.title} key={sec.title}>
                            <DynamicTable
                              columnsConfig={sec.columns}
                              data={sec.data}
                              highlightRows={false}
                              disabledLogic={sec.disabledLogic}
                              removeInput={sec.removeInput}
                              setModifiedFields={setModifiedFields}
                              modifiedFields={modifiedFields}
                              onInputChange={(rowKey, column, value) => {
                                console.log(
                                  'rowkey,column,value',
                                  rowKey,
                                  column,
                                  value,
                                );
                                handleInputChange(
                                  sec.title,
                                  rowKey,
                                  column,
                                  value,
                                );
                              }}
                            />
                          </TabPane>
                        ))}
                      </Tabs>
                    ) : (
                      <DynamicTable
                        columnsConfig={section.columns}
                        data={section.data}
                        highlightRows={false}
                        disabledLogic={section.disabledLogic}
                        removeInput={section.removeInput}
                        setModifiedFields={setModifiedFields}
                        modifiedFields={modifiedFields}
                        onInputChange={(rowKey, column, value) =>
                          handleInputChange(
                            section.title,
                            rowKey,
                            column,
                            value,
                          )
                        }
                      />
                    )}
                    {/* <DynamicTable
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
                    /> */}
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
