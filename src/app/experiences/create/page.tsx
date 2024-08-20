'use client';

import {
  Autocomplete,
  Box,
  MenuItem,
  Select,
  TextField,
  Button,
} from '@mui/material';
import { Create, useAutocomplete } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_URL } from '@utility/constants';
import { axiosInstance } from '@utility/axios-instance';
import { useState } from 'react';
import Image from 'next/image';
import {
  useCreate,
  useCreateMany,
  useImport,
  useList,
  useOne,
} from '@refinedev/core';
import { useRouter } from 'next/navigation';

interface IExperience {
  experience_name: string;
  description: string;
  location_address: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function BlogPostCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});

  const router = useRouter();

  const [imagePreview, setImagePreview] = useState('');

  const { mutate } = useCreateMany();

  const [importProgress, setImportProgress] = useState({
    processed: 0,
    total: 0,
  });

  const { inputProps, isLoading } = useImport<IExperience>({
    resource: 'experiences',
    onProgress: (progress) => {
      setImportProgress({
        processed: progress.processedAmount,
        total: progress.totalAmount,
      });
    },
    onFinish: (result) => {
      result.succeeded.forEach((item) => {
        console.log('Success:', item);
      });
      result.errored.forEach((item) => {
        console.log('Error:', item);
      });
      mutate({
        resource: 'experiences',
        values: result.succeeded,
      });
      router.push('/experiences');
    },
  });

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/upload`,
        formData,
      );
      const uploadedFile = response.data[0];
      if (uploadedFile) {
        // Create a preview URL for the uploaded image
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setValue('img_obj', {
          url: uploadedFile.url,
          id: uploadedFile.id,
        });
      }

      // You can now use the uploadedFile object to link it to the experience
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component='form'
        sx={{ display: 'flex', flexDirection: 'column' }}
        autoComplete='off'
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          {isLoading ? (
            <p>
              {importProgress.processed} / {importProgress.total}
            </p>
          ) : (
            <p>Import experiences through CSV</p>
          )}
          <input name='csv' {...inputProps} />
        </label>
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
        />

        <Button
          component='label'
          role={undefined}
          variant='contained'
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type='file' onChange={handleFileUpload} />
        </Button>
        {imagePreview && (
          <Box mt={2}>
            <Image
              src={imagePreview}
              alt='Image Preview'
              width={100}
              height={100}
              style={{ maxWidth: '100%' }}
            />
          </Box>
        )}
      </Box>
    </Create>
  );
}
