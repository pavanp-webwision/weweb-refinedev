'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useMany, useExport, useGetIdentity } from '@refinedev/core';
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useDataGrid,
  ExportButton,
} from '@refinedev/mui';
import React, { useEffect } from 'react';
import { CanAccess } from '@refinedev/core';

export default function BlogPostList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    // meta: {
    //   populate: ["category"],
    // },
  });
  const { triggerExport, isLoading: exportLoading } = useExport();

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany({
  //   resource: "categories",
  //   ids:
  //     dataGridProps?.rows
  //       ?.map((item: any) => item?.category?.id)
  //       .filter(Boolean) ?? [],
  //   queryOptions: {
  //     enabled: !!dataGridProps?.rows,
  //   },
  // });
  const { data: user } = useGetIdentity();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        minWidth: 50,
      },
      {
        field: 'experience_name',
        flex: 1,
        headerName: 'Name',
        minWidth: 200,
      },
      {
        field: 'description',
        flex: 1,
        headerName: 'Description',
        minWidth: 250,
        renderCell: function render({ value }) {
          if (!value) return '-';
          return <MarkdownField value={value?.slice(0, 80) + '...' || ''} />;
        },
      },
      user?.role?.type !== 'refine_editor' && {
        field: 'location_address',
        flex: 1,
        headerName: 'Location Address',
        minWidth: 300,
      },
      {
        field: 'createdAt',
        flex: 1,
        headerName: 'Created at',
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 80,
      },
    ],
    [],
  );

  return (
    <CanAccess resource='experiences' action='list'>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            <ExportButton onClick={triggerExport} loading={exportLoading} />
            {defaultButtons}
          </>
        )}
      >
        <DataGrid {...dataGridProps} columns={columns} autoHeight />
      </List>
    </CanAccess>
  );
}
