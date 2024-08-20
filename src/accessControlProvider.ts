'use client';
import { authProvider } from '@providers/auth-provider/auth-provider';
import { AccessControlProvider } from '@refinedev/core';

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const data: any = await authProvider.getIdentity?.();

    const role = data?.role?.type;

    // Define your custom access control logic here
    const accessRules: any = {
      refine_admin: {
        experiences: ['list', 'edit', 'delete', 'create', 'show'],
      },
      refine_editor: {
        experiences: ['list', 'edit', 'show', 'create'],
      },
    };

    const canAccess =
      accessRules[role]?.[resource || '']?.includes(action) ?? false;

    return Promise.resolve({
      can: canAccess,
    });
  },
};
