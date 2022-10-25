import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  FunctionField,
  Title,
  NumberInput,
  SaveContextProvider,
  useGetOne,
  useUpdate,
  useRecordContext,
} from 'react-admin';

export const SettingList = () => (
  <List
    pagination={false}
    sx={{ maxWidth: '700px' }}
    actions={null}
    hasEdit={true}
  >
    <Datagrid bulkActionButtons={false}>
      <FunctionField
        label='Property'
        sortBy='key'
        render={(record) => `${record.key}`}
      />
      <TextField source='value' />
    </Datagrid>
  </List>
);

const CodeTitle = () => {
  const record = useRecordContext();
  return <span>Edit Code {record ? `"${record.code}"` : ''}</span>;
};

export const SettingEdit = () => (
  <Edit title={<CodeTitle />}>
    <SimpleForm>
      <TextInput source='value' required />
    </SimpleForm>
  </Edit>
);

export const SettingsPage = (p) => {
  const { data, isLoading, error } = useGetOne('Settings', { id: undefined });

  const [update, { isLoading: isSubmitting }] = useUpdate();
  const onSubmit = (data) => update('Settings', { data, id: undefined });

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Card>
      <Title title='Settings' />
      <CardContent>
        <SaveContextProvider
          value={{
            record: data,
            isLoading,
            save: onSubmit,
            saving: isSubmitting,
          }}
        >
          <SimpleForm record={data} sx={{ width: '400px' }}>
            <Typography variant='h6' gutterBottom>
              Default User Code Benefit
            </Typography>
            <NumberInput source='benefitDirect' fullWidth />
            <NumberInput source='benefitDepositFactor' fullWidth />
            <NumberInput source='maxTotalBenefits' fullWidth />
            <NumberInput
              source='reqMinimumDeposit'
              label='Min deposit required'
              fullWidth
            />
            <Typography variant='h6' gutterBottom>
              Default User Code Reward
            </Typography>
            <NumberInput source='rewardDirect' fullWidth />
            <NumberInput source='rewardDepositFactor' fullWidth />
            <NumberInput source='maxTotalRewards' fullWidth />
          </SimpleForm>
        </SaveContextProvider>
      </CardContent>
    </Card>
  );
};
