import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, timestamp,password,checkbox } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this example, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    fields: {
      name: text({ validation: { isRequired: true } }),
      about: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      email: text({
        validation: { isRequired: true },

        // by adding isIndexed: 'unique', we are saying that an author cannot have the same
        // email as another author - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),
      password: password(),
      isAdmin: checkbox(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
};