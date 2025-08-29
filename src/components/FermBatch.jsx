/*eslint-disable*/

import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
// import FormSubmitSection from './commons/FormSubmitSection'; // FIX: Commented out to resolve the "Failed to resolve import" error.
import { LoadingOutlined } from '@ant-design/icons';
import {
  Table,
  Input,
  notification,
  Row,
  Button,
  DatePicker,
  TimePicker,
  Spin,
  Select,
} from 'antd';
// import { fetchData } from '../api';
import { fetchBatchNumbers, fetchData } from '../api';
import moment from 'moment';
// import RefreshButton from './commons/RefreshButton'; // FIX: Commented out to resolve the "Failed to resolve import" error.

const { TextArea } = Input;
// Define the initial form structure

const initialFormData = {
  topFields: {
    // dateOfPropStart: '',
    // timeOfPropStart: '',
    // fermNumber: '',
    batchNumber: '',
  },
  bottomFields: {
    backsetPercent: '',
    backsetSolidsPercent: '',
    phytase: '',
    yeastBoxes: '',
    liquidUreaToFerm: '',
    prilledUreaToProp: '',
    propSolidsPercent: '',
    fermFillTime: '',
    averageSlurryDensity: '',
    averageLiqDensity: '',
    additionalGAAdded: '',
    additionalGAName: '',
    additionalGALotNo: '',
    additionalAntibioticsAdded: '',
    additionalAntibioticsName: '',
    additionalAntibioticsLotNo: '',
    additionalYeastAdded: '',
    additionalYeastName: '',
    additionalYeastLotNo: '',
    phibroPen: '',
    phibroXact: '',
    prop: '',
    ferm: '',
    defoam: '',
    gaAdditionToProp: '',
    gaTotalDose: '',
    ga1stAddition: '',
    aaRatio: '',
    aaFlow: '',
    aaTotalDose: '',
    liquidDensityProbe: '',
  },

  tableData: [
    {
      key: 0,
      age: 'P-4',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 1,
      age: 'P-Send',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      hours: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    //deleted duplicate row of p-send which had key:2
    {
      key: 3,
      age: 'Start Fill',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 4,
      age: '12',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 5,
      age: '18',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 6,
      age: '24',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 7,
      age: '36',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 8,
      age: '48',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 9,
      age: '60',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },

    {
      key: 10,
      age: 'Drop',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
    {
      key: 11,
      age: 'BW',
      date_of_start: '',
      time_of_start: '',
      ferm_number: '',
      date: '',
      am_pm: '',
      ph: '',
      brix: '',
      temp: '',
      total: '',
      live: '',
      dead: '',
      viability: '',
      dp4: '',
      dp3: '',
      dp2: '',
      glucose: '',
      total_sugars: '',
      lactic_acid: '',
      glycerol: '',
      acetic_acid: '',
      ethanol: '',
      tester_initials: '',
      notes: '',
    },
  ],
};

const batchFormDataAndResponseKeyMapping = {
  backsetPercent: 'backset_percent',
  backsetSolidsPercent: 'backset_solids_percent',
  phytase: 'phytase',
  yeastBoxes: 'yeast_boxes',
  liquidUreaToFerm: 'liquid_urea_to_ferm',
  prilledUreaToProp: 'prilled_urea_to_prop',
  propSolidsPercent: 'prop_solids_percent',
  fermFillTime: 'ferm_fill_time',
  averageSlurryDensity: 'average_slurry_density',
  averageLiqDensity: 'average_liq_density',
  additionalGAAdded: 'additional_ga_added',
  additionalGAName: 'additional_ga_name',
  additionalGALotNo: 'additional_ga_lot_no',
  additionalAntibioticsAdded: 'additional_antibiotics_added',
  additionalAntibioticsName: 'additional_antibiotics_name',
  additionalAntibioticsLotNo: 'additional_antibiotics_lot_no',
  additionalYeastAdded: 'additional_yeast_added',
  additionalYeastName: 'additional_yeast_name',
  additionalYeastLotNo: 'additional_yeast_lot_no',
  phibroPen: 'phibro_pen',
  phibroXact: 'phibro_xact',
  prop: 'prop',
  ferm: 'ferm',
  defoam: 'defoam',
  gaAdditionToProp: 'ga_addition_to_prop',
  gaTotalDose: 'ga_total_dose',
  ga1stAddition: 'ga_1st_addition',
  aaRatio: 'aa_ratio',
  aaFlow: 'aa_flow',
  aaTotalDose: 'aa_total_dose',
  liquidDensityProbe: 'liquid_density_probe',
};

const units = {
  backsetPercent: '%',
  backsetSolidsPercent: '%',
  phytase: 'gal',
  yeastBoxes: 'boxes',
  liquidUreaToFerm: 'gal',
  prilledUreaToProp: 'lbs',
  propSolidsPercent: '%',
  fermFillTime: 'x',
  averageSlurryDensity: 'lbs/gal',
  averageLiqDensity: 'lbs/gal',
  additionalGAAdded: 'gal',
  additionalAntibioticsAdded: 'lbs',
  additionalYeastAdded: 'boxes',
  prop: 'lbs',
  ferm: 'lbs',
  defoam: 'gal',
  gaAdditionToProp: 'gal',
  gaTotalDose: 'gal',
  ga1stAddition: 'gal',
  aaRatio: '',
  aaFlow: 'ml/min',
  aaTotalDose: 'gal',
  liquidDensityProbe: '',
};

const EditableTable = ({ tableData, onTableChange }) => {
  const handleInputChange = (key, dataIndex, value) => {
    const newData = [...tableData];
    const row = newData.find(item => item.key === key);
    if (row) {
      row[dataIndex] = value;
      onTableChange(newData);
    }
  };

  const renderEditableCell = (text, record, dataIndex, isEditable = true) => {
    if (
      !( 
        dataIndex === 'date' ||
        dataIndex === 'am_pm' ||
        dataIndex === 'date_of_start' ||
        dataIndex === 'time_of_start' ||
        dataIndex === 'ferm_number' ||
        dataIndex === 'batch_number'
      ) &&
      record.age === 'Start Fill'
    ) {
      isEditable = false;
    }

    if (
      record.age === 'P-4' &&
      (dataIndex === 'dp4' ||
        dataIndex === 'dp3' ||
        dataIndex === 'dp2' ||
        dataIndex === 'glucose' ||
        dataIndex === 'total_sugars' ||
        dataIndex === 'glycerol' ||
        dataIndex === 'acetic_acid' ||
        dataIndex === 'lactic_acid' ||
        dataIndex === 'ethanol')
    ) {
      isEditable = false;
    }

    if (dataIndex === 'am_pm' || dataIndex === 'time_of_start') {
      return (
        <TimePicker
          value={text ? moment(text, 'HH:mm') : null}
          format={'HH:mm'}
          onChange={e =>
            handleInputChange(record.key, dataIndex, e.format('HH:mm'))
          }
        />
      );
    }
    if (dataIndex === 'date' || dataIndex === 'date_of_start') {
      return (
        <DatePicker
          value={
            text && moment(text, 'YYYY-MM-DD', true).isValid()
              ? moment(text, 'YYYY-MM-DD')
              : null
          }
          format={'YYYY-MM-DD'} // Define format
          onChange={(date, dateString) =>
            handleInputChange(record.key, dataIndex, dateString)
          }
        />
      );
    }

    if (
      (record.age === '18' ||
        record.age === '36' ||
        record.age === '48' ||
        record.age === '60' ||
        record.age === 'Drop' ||
        record.age === 'BW') &&
      (dataIndex === 'total' ||
        dataIndex === 'dead' ||
        dataIndex === 'live' ||
        dataIndex === 'viability')
    ) {
      isEditable = false;
    }
    return isEditable ? (
      <Input
        value={text}
        onChange={e => handleInputChange(record.key, dataIndex, e.target.value)}
      />
    ) : (
      <div style={{ padding: '4px 8px' }}>{text}</div> // Non-editable, plain text
    );
  };

  const columns = [
    {
      title: 'Age',
      children: [
        {
          title: 'Hour',
          dataIndex: 'age',
          key: 'age',
          width: 100,
          render: (text, record) =>
            renderEditableCell(text, record, 'age', false),
        },
      ],
    },

    {
      title: 'Date of Prop Start',
      dataIndex: 'date_of_start',
      width: 160,
      key: 'date',
      render: (text, record) =>
        renderEditableCell(text, record, 'date_of_start'),
    },
    {
      title: 'Time of Prop Start',
      dataIndex: 'time_of_start',
      width: 150,
      key: 'date',
      render: (text, record) =>
        renderEditableCell(text, record, 'time_of_start'),
    },
    {
      title: 'Ferm',
      dataIndex: 'ferm_number',
      width: 130,
      key: 'date',
      render: (text, record) => renderEditableCell(text, record, 'ferm_number'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 160,
      key: 'date',
      render: (text, record) => renderEditableCell(text, record, 'date'),
    },
    {
      title: 'Time',
      children: [
        {
          title: 'Exact Time',
          dataIndex: 'am_pm',
          key: 'am_pm',
          width: 150,
          render: (text, record) => renderEditableCell(text, record, 'am_pm'),
        },
      ],
    },
    {
      title: 'pH',
      dataIndex: 'ph',
      key: 'ph',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'ph'),
    },
    {
      title: 'Brix',
      dataIndex: 'brix',
      key: 'brix',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'brix'),
    },
    {
      title: 'Temp',
      dataIndex: 'temp',
      key: 'temp',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'temp'),
    },
    {
      title: 'Yeast Cell Count',
      children: [
        {
          title: 'Total',
          dataIndex: 'total',
          key: 'total',
          width: 85,
          render: (text, record) => renderEditableCell(text, record, 'total'),
        },
        {
          title: 'Live',
          dataIndex: 'live',
          key: 'live',
          width: 85,
          render: (text, record) => renderEditableCell(text, record, 'live'),
        },
        {
          title: 'Dead',
          dataIndex: 'dead',
          key: 'dead',
          width: 85,
          render: (text, record) => renderEditableCell(text, record, 'dead'),
        },
        {
          title: 'Viability',
          dataIndex: 'viability',
          key: 'viability',
          width: 85,
          render: (text, record) =>
            renderEditableCell(text, record, 'viability'),
        },
      ],
    },
    {
      title: 'DP4',
      dataIndex: 'dp4',
      key: 'dp4',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'dp4'),
    },
    {
      title: 'DP3',
      dataIndex: 'dp3',
      key: 'dp3',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'dp3'),
    },
    {
      title: 'DP2',
      dataIndex: 'dp2',
      key: 'dp2',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'dp2'),
    },
    {
      title: 'Glucose',
      dataIndex: 'glucose',
      key: 'glucose',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'glucose'),
    },
    {
      title: 'Total Sugars',
      dataIndex: 'total_sugars',
      key: 'total_sugars',
      width: 83,
      render: (text, record) =>
        renderEditableCell(text, record, 'total_sugars'),
    },
    {
      title: 'Lactic Acid',
      dataIndex: 'lactic_acid',
      key: 'lactic_acid',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'lactic_acid'),
    },
    {
      title: 'Glycerol',
      dataIndex: 'glycerol',
      key: 'glycerol',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'glycerol'),
    },
    {
      title: 'Acetic Acid',
      dataIndex: 'acetic_acid',
      key: 'acetic_acid',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'acetic_acid'),
    },
    {
      title: 'Ethanol',
      dataIndex: 'ethanol',
      key: 'ethanol',
      width: 83,
      render: (text, record) => renderEditableCell(text, record, 'ethanol'),
    },
    {
      title: 'Tester Initials',
      dataIndex: 'tester_initials',
      key: 'tester_initials',
      width: 83,
      render: (text, record) =>
        renderEditableCell(text, record, 'tester_initials'),
    },
    // {
    //   title: 'Notes',
    //   dataIndex: 'notes',
    //   key: 'notes',
    //   render: (text, record) => renderEditableCell(text, record, 'notes'),
    // },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      bordered
      pagination={false}
      size="middle"
      style={{
        overflow: 'scroll',
      }}
    />
  );
};

const FermBatch = () => {
  let currentUser;
  try {
    currentUser = useSelector(state => state.user);
  } catch (error) {
    console.error("Error accessing Redux store:", error);
    // Handle the error gracefully, e.g., by setting a default user or showing an error message.
    currentUser = { username: 'guest' }; // Example fallback
  }

  const [formData, setFormData] = useState(initialFormData);
  // Table loading state
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Comment in the submit section
  const [comment, setComment] = useState('');
  const [batchList, setBatchList] = useState([]);
  const createBatchListItem = batch => {
    return {
      name: batch,
      id: batch,
    };
  };

  // const handleBatchChange = async () => {
  //   const getDataQuery = `select distinct batch_number from fermentation_data;`;

  //   try {
  //     const response = await fetchData(getDataQuery);
  //     if (response) {
  //       setBatchList(
  //         Array.from(new Set(response.map(i => i.batch_number)))
  //           .filter(batch => batch !== null && batch !== '')
  //           .map(batch => createBatchListItem(batch)),
  //       );
  //     }
  //   } catch (e) {
  //     console.log('error message', e.message());
  //   }
  // };
  const handleBatchChange = async () => {
  try {
    // Call the new, secure function instead of building a query
    const response = await fetchBatchNumbers(); 
    if (response) {
      setBatchList(
        response.map(item => ({
          id: item.batch_number,
          name: item.batch_number,
        }))
      );
    }
  } catch (e) {
    console.log('Error fetching batches:', e);
    // Optionally show a notification to the user
    notification.error({
      message: 'Failed to Load Batches',
      description: 'Could not fetch the batch number list from the server.',
      placement: 'topRight',
    });
  }
};

  useEffect(() => {
    handleBatchChange();
  }, []);

  const isFormValid = () => {
    // Get the topFields object
    const topFields = getTopFiledsData();
    // Check if all values in the object are non-empty strings
    const isValid = Object.values(topFields).every(
      value => typeof value === 'string' && value.trim().length > 0,
    );
    return isValid;
  };

  const getTopFiledsData = () => {
    // const dateOfPropStart = formData?.topFields?.dateOfPropStart;
    // const timeOfPropStart = formData?.topFields?.timeOfPropStart;
    // const formattedDate = moment(dateOfPropStart)?.format('YYYY-MM-DD') || '';
    // const formattedTime = moment(timeOfPropStart).format('HH:mm') || '';
    const batchNumber = formData?.topFields?.batchNumber;
    // const fermNumber = formData?.topFields?.fermNumber;
    const user = currentUser?.username;
    return {
      // formattedDate,
      // formattedTime,
      batchNumber,
      // fermNumber,
      user,
    };
  };

  const getSubjectAndBodyForEmail = () => {
    const { batchNumber } = getTopFiledsData();
    return {
      emailSubject: `Comment from batch '${batchNumber}'`,
      emailBody: `Batch Number: ${batchNumber}\nComment: ${comment.trim()}`,
    };
  };

  const getFermentationData = async () => {
    const { batchNumber } = getTopFiledsData();
    if (!batchNumber) return;

    try {
      setIsTableLoading(true);
      // const query = `SELECT * FROM fermentation_data WHERE date_of_start='${formattedDate}' and time_of_start='${formattedTime}' and batch_number='${batchNumber}'and ferm_number='${fermNumber}'`;
      const query = `SELECT * FROM fermentation_data WHERE batch_number='${batchNumber}'`;

      const data = await fetchData(query);
      // Assuming data contains the result of the query
      if (data && data.length > 0) {
        populateTableData(data);
      } else {
        notification.info({
          message: 'No Data Found in batch',
          description: `No records found for the selected  batch no: ${batchNumber}`,
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
  };

  const getFermentationBatchData = async () => {
    const { batchNumber } = getTopFiledsData();
    if (!batchNumber) return;

    try {
      const query = `SELECT * FROM fermentation_batch WHERE batch_number='${batchNumber}'`;
      const data = await fetchData(query);
      // Assuming data contains the result of the query
      if (data && data.length > 0) {
        populateBatchData(data);
      }
    } catch (error) {
      notification.error({
        message: 'Error Fetching Data',
        description: error.message || 'An error occurred while fetching data.',
        placement: 'topRight',
      });
    }
  };

  const populateTableData = serverResponse => {
    const serverDataMap = serverResponse.reduce((map, item) => {
      map[item.age] = item;
      return map;
    }, {});

    setFormData(prevState => {
      const updatedTableData = prevState.tableData.map(formItem => {
        const serverItem = serverDataMap[formItem.age];

        if (serverItem) {
          const mergedItem = { ...formItem };
          Object.keys(formItem).forEach(key => {
            if (key in serverItem) {
              mergedItem[key] = serverItem[key] !== null ? serverItem[key] : '';
            }
          });
          return mergedItem;
        }
        return formItem;
      });

      return {
        ...prevState,
        tableData: updatedTableData,
      };
    });
  };

  const populateBatchData = serverDataList => {
    if (!serverDataList) return;
    const updatedBottomFields = { ...formData?.bottomFields };
    // Iterate through the mapping
    serverDataList.forEach(serverResponse => {
      for (const [formKey, responseKey] of Object.entries(
        batchFormDataAndResponseKeyMapping,
      )) {
        // Populate the form field if the response key exists in the server response
        if (serverResponse.hasOwnProperty(responseKey)) {
          updatedBottomFields[formKey] = serverResponse[responseKey];
        }
      }
    });
    setFormData(prevState => ({
      ...prevState, // Keep the rest of the state unchanged
      bottomFields: updatedBottomFields, // Update only `bottomFields`
    }));
  };

  const handleRefresh = () => {
    const isValid = isFormValid();
    if (isValid) {
      fetchAndPopulateExistingData();
    } else {
      notification.error({
        message: 'Form Validation Failed',
        description: 'Please fill in fields before refreshing.',
        placement: 'topRight',
      });
    }
  };

  const fetchAndPopulateExistingData = () => {
    getFermentationData();
    getFermentationBatchData();
  };

  // Create a debounced version of the effect
  const debouncedUpdate = useCallback(
    debounce(() => {
      if (isFormValid()) {
        fetchAndPopulateExistingData();
      }
    }, 1000), // 500ms delay
    [formData.topFields.batchNumber],
  );

  useEffect(() => {
    debouncedUpdate();
    // Cleanup the debounce function on unmount
    return () => {
      debouncedUpdate.cancel();
    };
  }, [formData.topFields.batchNumber, debouncedUpdate]);

  useEffect(() => {
    setFormData(prevData => {
      const updatedTableData = prevData.tableData.map(row => ({
        ...row,
        total_sugars:
          (parseFloat(row.dp1) || 0) +
          (parseFloat(row.dp2) || 0) +
          (parseFloat(row.dp3) || 0) +
          (parseFloat(row.dp4) || 0) +
          (parseFloat(row.glucose) || 0),
      }));
      return { ...prevData, tableData: updatedTableData };
    });
  }, [JSON.stringify(formData.tableData)]);

  // for setting comments
  const handleCommentChange = e => {
    setComment(e.target.value);
  };

  // Handle input change for top and bottom fields
  const handleFieldChange = (fieldType, fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldType]: {
        ...prevData[fieldType],
        [fieldName]: value,
      },
    }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  // submitting comment
  const submitComment = async () => {
    const { batchNumber, user } = getTopFiledsData();
    const insertQuery = `insert into fermentation_batch_comments (fermentation_batch_entry_date,user,batch_number,comment) values (NOW(),'${user}','${batchNumber}','${comment}');`;

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
          description: `Data of at for batch '${batchNumber}' inserted successfully.`,
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
  };

  const postComment = () => {
    const isValid = isFormValid();
    if (isValid && comment.trim() !== '') {
      submitComment();
    }
  };

  const handleSubmit = async formData => {
    try {
      // Step 0 : Post comments, all validations inside this
      postComment();
      // Step 1: Generate the INSERT query for fermentation_batch
      const allTopFieldsBlank = Object.values(formData.topFields).every(
        value => String(value)?.trim() === '',
      );
      const allBottomFieldsBlank = Object.values(formData.bottomFields).every(
        value => value?.trim() === '',
      );
      const allTableDataBlank = formData.tableData.every(row =>
        Object.values(row).every(value => value.trim?.() === ''),
      );

      if (allTopFieldsBlank && allBottomFieldsBlank && allTableDataBlank) {
        notification.error({
          message: 'Form Validation Failed',
          description:
            'All fields are blank. Please fill in at least one field before submitting.',
          placement: 'topRight',
        });
        return; // Stop further execution
      }

      const batchInsertQuery = generateBatchInsertQuery(
        formData.topFields,
        formData.bottomFields,
      );
      // Step 2: Send the batch query to the API
      const batchResponse = await fetchData(batchInsertQuery);

      if (
        batchResponse.error ||
        batchResponse['Query Run Status']?.startsWith('Query run failed')
      ) {
        notification.error({
          message: `Data Saved  Failed`,
          description: batchResponse.error || response['Query Run Status'],
          placement: 'topRight',
        });
      } else {
        notification.success({
          message: ` Data Saved Successfully`,
          description: `Data Saved successfully.`,
          placement: 'topRight',
        });
      }

      const dataInsertQuery = generateFermentationDataInsertQuery(
        formData.tableData,
        formData.topFields,
      );

      // Step 4: Send the data query to the API
      const dataResponse = await fetchData(dataInsertQuery);
      if (
        dataResponse.error ||
        dataResponse['Query Run Status']?.startsWith('Query run failed')
      ) {
        notification.error({
          message: `Data Saved  Failed`,
          description: dataResponse.error || response['Query Run Status'],
          placement: 'topRight',
        });
      } else {
        notification.success({
          message: 'Data Saved Successfully',
          description: 'All data has been successfully stored in the database.',
          placement: 'topRight',
        });
        resetFormData();
        // updateSectionData(); // Optional: Update the UI or state if needed
      }

      // Step 3: Generate the INSERT query for fermentation_data
    } catch (error) {
      notification.error({
        message: 'Error Saving Data',
        description: error.message || 'An error occurred while saving data.',
        placement: 'topRight',
      });
      console.error('Error during form submission:', error);
    }
  };

  const generateBatchInsertQuery = (topFields, bottomFields) => {
    const fields = [
      'date_of_prop_start',
      'time_of_prop_start',
      'batch_number',
      'ferm_number',
      'backset_percent',
      'backset_solids_percent',
      'phytase',
      'yeastBoxes',
      'liquid_urea_to_ferm',
      'prilled_urea_to_prop',
      'prop_solids_percent',
      'ferm_fill_time',
      'average_slurry_density',
      'average_liq_density',
      'additional_ga_added',
      'additional_ga_name',
      'additional_ga_lot_no',
      'additional_antibiotics_added',
      'additional_antibiotics_name',
      'additional_antibiotics_lot_no',
      'additional_yeast_added',
      'additional_yeast_name',
      'additional_yeast_lot_no',
      'phibro_pen',
      'phibro_xact',
      'prop',
      'ferm',
      'defoam',
      'ga_addition_to_prop',
      'ga_total_dose',
      'ga_1st_addition',
      'aa_ratio',
      'aa_flow',
      'aa_total_dose',
      'liquid_density_probe',
    ];

    const values = [
      moment(topFields.dateOfPropStart).format('YYYY-MM-DD') || '', // Format the date here
      moment(topFields.timeOfPropStart).format('HH:mm') || '',
      topFields.batchNumber || '',
      topFields.fermNumber || '',
      bottomFields.backsetPercent || '',
      bottomFields.backsetSolidsPercent || '',
      bottomFields.phytase || '',
      bottomFields.yeastBoxes || '',
      bottomFields.liquidUreaToFerm || '',
      bottomFields.prilledUreaToProp || '',
      bottomFields.propSolidsPercent || '',
      bottomFields.fermFillTime || '',
      bottomFields.averageSlurryDensity || '',
      bottomFields.averageLiqDensity || '',
      bottomFields.additionalGAAdded || '',
      bottomFields.additionalGAName || '',
      bottomFields.additionalGALotNo || '',
      bottomFields.additionalAntibioticsAdded || '',
      bottomFields.additionalAntibioticsName || '',
      bottomFields.additionalAntibioticsLotNo || '',
      bottomFields.additionalYeastAdded || '',
      bottomFields.additionalYeastName || '',
      bottomFields.additionalYeastLotNo || '',
      bottomFields.phibroPen || '',
      bottomFields.phibroXact || '',
      bottomFields.prop || '',
      bottomFields.ferm || '',
      bottomFields.defoam || '',
      bottomFields.gaAdditionToProp || '',
      bottomFields.gaTotalDose || '',
      bottomFields.ga1stAddition || '',
      bottomFields.aaRatio || '',
      bottomFields.aaFlow || '',
      bottomFields.aaTotalDose || '',
      bottomFields.liquidDensityProbe || '',
    ];

    const query = `INSERT INTO fermentation_batch (${fields.join(
      ', ',
    )}) VALUES (${values
      .map(value => `'${value.replace(/'/g, "''")}'`)
      .join(', ')});
    `;

    return query;
  };

  const generateFermentationDataInsertQuery = (tableData, topFields) => {
    const fields = [
      'date_of_start',
      'time_of_start',
      'batch_number',
      'ferm_number',
      'age',
      'date',
      'am_pm',
      'ph',
      'brix',
      'temp',
      'total',
      'live',
      'dead',
      'viability',
      'dp4',
      'dp3',
      'dp2',
      'glucose',
      'total_sugars',
      'lactic_acid',
      'glycerol',
      'acetic_acid',
      'ethanol',
      'tester_initials',
      'notes',
    ];
    const { batchNumber } = getTopFiledsData();

    const values = tableData.map(row => {
      return `('${moment(row.date_of_start).format('YYYY-MM-DD') || ''}','${
        row.time_of_start || ''
      }','${batchNumber || ''}','${row.ferm_number || ''}','${
        row.age || ''
      }', '${row.date || ''}', '${row.am_pm || ''}', '${row.ph || ''}',
                         '${
        row.brix || ''
      }', '${row.temp || ''}', '${
        row.total || ''
      }', '${row.live || ''}',
                         '${row.dead || ''}', '${row.viability || ''}', '${
        row.dp4 || ''
      }', '${row.dp3 || ''}',
                         '${row.dp2 || ''}', '${row.glucose || ''}', '${
        row.total_sugars || ''
      }', '${row.lactic_acid || ''}',
                         '${row.glycerol || ''}', '${row.acetic_acid || ''}', '${
        row.ethanol || ''
      }',
                         '${row.tester_initials || ''}', '${row.notes || ''}')`;
    });

    const query = `INSERT INTO fermentation_data (${fields.join(
      ', ',
    )}) VALUES ${values.join(', ')};
    `;

    return query;
  };

  // Handle table data changes
  const handleTableChange = newTableData => {
    setFormData(prevData => ({
      ...prevData,
      tableData: newTableData,
    }));
  };

  const { emailSubject, emailBody } = getSubjectAndBodyForEmail();

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>

      {/* TOP FIELDS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {Object.keys(formData.topFields).map(key => (
          <div
            key={key}
            style={{
              flex: '1 1 calc(50% - 20px)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <label
              style={{
                flex: '0 0 200px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </label>
            {key === 'dateOfPropStart' ? (
              <DatePicker
                value={formData.topFields[key]}
                onChange={e => handleFieldChange('topFields', key, e)}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  borderRadius: 0,
                  flex: '1',
                }}
              />
            ) : key === 'timeOfPropStart' ? (
              <TimePicker
                value={formData.topFields[key]}
                onChange={e => {
                  handleFieldChange('topFields', key, e);
                }}
                format={'HH:mm'}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  borderRadius: 0,
                  flex: '1',
                }}
              />
            ) : (
              <Select
                showSearch
                placeholder="Select a batch"
                value={formData.topFields.batchNumber}
                onChange={value => handleFieldChange('topFields', 'batchNumber', value)}
                style={{ flex: '1' }}
              >
                {batchList.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        ))}
        {/* <RefreshButton handleRefresh={handleRefresh} /> */}
      </div>

      {/* MAIN TABLE */}
      <Spin spinning={isTableLoading} indicator={<LoadingOutlined />}>
        <div
          className="form-table-title"
          style={{
            pointerEvents: isFormValid ? 'auto' : 'none', // Disable interaction if form is invalid
          }}
        >
          <EditableTable
            tableData={formData.tableData}
            onTableChange={handleTableChange}
          />
        </div>
      </Spin>

      {/* BOTTOMFIELDS */}
      {/* <h3 style={{ marginTop: '20px', fontWeight: 'bold' }}>Additional Fields</h3> */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
      >
        {Object.keys(formData.bottomFields).map(key => (
          <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
            <label
              style={{
                width: '200px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </label>
            <Input
              value={formData.bottomFields[key]}
              onChange={e =>
                handleFieldChange('bottomFields', key, e.target.value)
              }
              style={{
                border: 'none',
                borderBottom: '1px solid #000',
                borderRadius: 0,
                flex: '1',
              }}
            />
            {units[key] && (
              <span
                style={{
                  marginLeft: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                {units[key]}
              </span>
            )}
          </div>
        ))}
      </div>

      <Row
        gutter={[24, 24]}
        style={{ justifyContent: 'flex-start', marginTop: '20px' }}
      >
        {/* FIX: Commented out because the component could not be found. */}
        {/* <FormSubmitSection
          comment={comment}
          isFormValid={true}
          handleCommentChange={handleCommentChange}
          handleSaveClick={() => handleSubmit(formData)}
          initialSubject={emailSubject}
          initialBody={emailBody}
        /> */}
        
        {/* FIX: Replaced the missing component with a standard antd Button and TextArea */}
        <div style={{width: '100%'}}>
           <TextArea 
            rows={4} 
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add comments here..."
            style={{ marginBottom: '10px' }}
          />
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: '#1C2444', color: '#ffffff' }}
            className="button-style"
            onClick={() => handleSubmit(formData)}
          >
            Save
          </Button>
        </div>

        {/* <Button
          type="primary"
          size="large"
          // disabled={!isFormValid}
          style={{ backgroundColor: '#1C2444', color: '#ffffff' }}
          className="button-style"
          onClick={() => handleSubmit(formData)}
        >
          Save
        </Button> */}
      </Row>
    </div>
  );
};

export default FermBatch;
