/*eslint-disable*/

import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
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
import { fetchData } from '../api'; // Only fetchData is needed for this approach
import moment from 'moment';

const { TextArea } = Input;

// Define the initial form structure
const initialFormData = {
  topFields: {
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
    { key: 0, age: 'P-4', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 1, age: 'P-Send', date_of_start: '', time_of_start: '', ferm_number: '', hours: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 3, age: 'Start Fill', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 4, age: '12', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 5, age: '18', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 6, age: '24', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 7, age: '36', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 8, age: '48', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 9, age: '60', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 10, age: 'Drop', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
    { key: 11, age: 'BW', date_of_start: '', time_of_start: '', ferm_number: '', date: '', am_pm: '', ph: '', brix: '', temp: '', total: '', live: '', dead: '', viability: '', dp4: '', dp3: '', dp2: '', glucose: '', total_sugars: '', lactic_acid: '', glycerol: '', acetic_acid: '', ethanol: '', tester_initials: '', notes: '' },
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
    // This entire component is self-contained and correct. No changes needed.
    // ... (Your existing EditableTable code)
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
    currentUser = { username: 'guest' };
  }

  const [formData, setFormData] = useState(initialFormData);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [batchList, setBatchList] = useState([]);

  const getBatchNumbers = async () => {
    // Using the generic fetchData function as requested
    const getBatchesQuery = 'SELECT DISTINCT batch_number FROM fermentation_data WHERE batch_number IS NOT NULL AND batch_number != ""';
    try {
      const response = await fetchData(getBatchesQuery);
      if (response) {
        const formattedBatches = response.map(item => ({
          id: item.batch_number,
          name: item.batch_number,
        }));
        setBatchList(formattedBatches);
      }
    } catch (e) {
      console.error('Error fetching batches:', e);
      notification.error({
        message: 'Failed to Load Batches',
        description: 'Could not fetch the batch number list from the server.',
        placement: 'topRight',
      });
    }
  };

  useEffect(() => {
    getBatchNumbers();
  }, []);

  const getTopFiledsData = () => {
    const batchNumber = formData?.topFields?.batchNumber;
    return { batchNumber };
  };

  const getFermentationData = async () => {
    const { batchNumber } = getTopFiledsData();
    if (!batchNumber) return;

    try {
      setIsTableLoading(true);
      const query = `SELECT * FROM fermentation_data WHERE batch_number='${batchNumber}'`;
      const data = await fetchData(query);
      if (data && data.length > 0) {
        populateTableData(data);
      } else {
        setFormData(prevState => ({ ...prevState, tableData: initialFormData.tableData }));
        notification.info({
          message: 'No Data Found',
          description: `No records found for batch: ${batchNumber}`,
          placement: 'topRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error Fetching Data',
        description: error.message || 'An error occurred.',
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
      const query = `SELECT * FROM fermentation_data WHERE batch_number='${batchNumber}'`;
      const data = await fetchData(query);
      populateBatchData(data);
    } catch (error) {
      notification.error({
        message: 'Error Fetching Data',
        description: error.message || 'An error occurred.',
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
      const updatedTableData = initialFormData.tableData.map(formItem => {
        const serverItem = serverDataMap[formItem.age];
        if (serverItem) {
          const mergedItem = { ...formItem };
          Object.keys(formItem).forEach(key => {
            if (key in serverItem) {
              mergedItem[key] = serverItem[key] ?? '';
            }
          });
          return mergedItem;
        }
        return { ...formItem };
      });
      return {
        ...prevState,
        tableData: updatedTableData,
      };
    });
  };
  
  const populateBatchData = serverDataList => {
    const updatedBottomFields = { ...initialFormData.bottomFields };
    if (serverDataList && serverDataList.length > 0) {
      const serverResponse = serverDataList[0];
      for (const [formKey, responseKey] of Object.entries(
        batchFormDataAndResponseKeyMapping,
      )) {
        if (serverResponse.hasOwnProperty(responseKey)) {
          updatedBottomFields[formKey] = serverResponse[responseKey] ?? '';
        }
      }
    }
    setFormData(prevState => ({
      ...prevState,
      bottomFields: updatedBottomFields,
    }));
  };

  const fetchAndPopulateExistingData = () => {
    getFermentationData();
    getFermentationBatchData();
  };

  const debouncedUpdate = useCallback(
    debounce(() => {
      const { batchNumber } = getTopFiledsData();
      if (batchNumber) {
        fetchAndPopulateExistingData();
      } else {
        setFormData(prevState => ({
            ...prevState,
            bottomFields: initialFormData.bottomFields,
            tableData: initialFormData.tableData
        }));
      }
    }, 500),
    [formData.topFields.batchNumber],
  );

  useEffect(() => {
    debouncedUpdate();
    return () => {
      debouncedUpdate.cancel();
    };
  }, [formData.topFields.batchNumber, debouncedUpdate]);

  const handleFieldChange = (fieldType, fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldType]: {
        ...prevData[fieldType],
        [fieldName]: value,
      },
    }));
  };
  
  const handleSubmit = async () => { /* ... your existing save/submit logic ... */ };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            flex: '1 1 100%',
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
            Batch Number:
          </label>
          <Select
            showSearch
            allowClear
            placeholder="Select a batch"
            value={formData.topFields.batchNumber || null}
            onChange={value => handleFieldChange('topFields', 'batchNumber', value || '')}
            style={{ flex: '1' }}
          >
            {batchList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <Spin spinning={isTableLoading} indicator={<LoadingOutlined />}>
        <div className="form-table-title">
          <EditableTable
            tableData={formData.tableData}
            onTableChange={(newTableData) => setFormData(p => ({...p, tableData: newTableData}))}
          />
        </div>
      </Spin>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '20px',
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
        <div style={{width: '100%'}}>
           <TextArea 
             rows={4} 
             value={comment}
             onChange={e => setComment(e.target.value)}
             placeholder="Add comments here..."
             style={{ marginBottom: '10px' }}
           />
           <Button
             type="primary"
             size="large"
             style={{ backgroundColor: '#1C2444', color: '#ffffff' }}
             className="button-style"
             onClick={handleSubmit}
           >
             Save
           </Button>
         </div>
      </Row>
    </div>
  );
};

export default FermBatch;