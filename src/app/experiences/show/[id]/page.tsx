'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useOne, useShow } from '@refinedev/core';
import {
  DateField,
  MarkdownField,
  Show,
  TextFieldComponent as TextField,
} from '@refinedev/mui';
import { API_URL } from '@utility/constants';
import Image from 'next/image';

export default function BlogPostShow() {
  const { queryResult } = useShow({
    // meta: {
    //   populate: ["category"],
    // },
  });

  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant='body1' fontWeight='bold'>
          {'ID'}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant='body1' fontWeight='bold'>
          {'Name'}
        </Typography>
        <TextField value={record?.experience_name} />

        <Typography variant='body1' fontWeight='bold'>
          {'Location Address'}
        </Typography>
        <TextField value={record?.location_address} />

        <Typography variant='body1' fontWeight='bold'>
          {'Description'}
        </Typography>
        <MarkdownField value={record?.description} />

        <Typography variant='body1' fontWeight='bold'>
          {'CreatedAt'}
        </Typography>
        <DateField value={record?.createdAt} />

        <Typography variant='body1' fontWeight='bold'>
          {'Images'}
        </Typography>
        <Box mt={2}>
          <img
            src={`${API_URL}${record?.img_obj?.url}`}
            alt='Image Preview'
            width={200}
            height={200}
          />
        </Box>
      </Stack>
    </Show>
  );
}
