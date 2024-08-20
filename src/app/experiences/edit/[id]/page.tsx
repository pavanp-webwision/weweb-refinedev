'use client';

import {
  Autocomplete,
  Box,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Edit, useAutocomplete } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { API_URL } from '@utility/constants';

export default function BlogPostEdit() {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {},
  });

  const experiencesData = queryResult?.data?.data;

  const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete({
    resource: 'categories',
    defaultValue: experiencesData?.category?.id,
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component='form'
        sx={{ display: 'flex', flexDirection: 'column' }}
        autoComplete='off'
      >
        <TextField
          {...register('experience_name', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.experience_name}
          helperText={(errors as any)?.experience_name?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          type='text'
          label={'Experience Name'}
          name='experience_name'
        />
        <TextField
          {...register('location_address', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.location_address}
          helperText={(errors as any)?.location_address?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          type='text'
          label={'Location Address'}
          name='location_address'
        />
        <TextField
          {...register('description', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.description}
          helperText={(errors as any)?.description?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          label={'Description'}
          name='description'
          rows={4}
        />

        <Typography variant='body1' fontWeight='bold'>
          {'Images'}
        </Typography>
        <Box mt={2}>
          <img
            src={`${API_URL}${experiencesData?.img_obj?.url}`}
            alt='Image Preview'
            width={200}
            height={200}
          />
        </Box>
      </Box>
    </Edit>
  );
}
