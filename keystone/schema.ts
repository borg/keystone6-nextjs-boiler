import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text,integer, timestamp,password,checkbox,relationship,json } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';
import {componentBlocks} from './component-blocks';

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
        isIndexed: 'unique',
      }),
      password: password(),
      tags: relationship({
        ref: "Tag.users",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
      isAdmin: checkbox(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
 
    },
  }),
  Page: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      content: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
        relationships: {      
          block: {
            listKey: 'Block',
            label: 'Block',
            selection: 'id name content {document (hydrateRelationships: true)}',
          },
        },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Block: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      content: document({
        ui: {
          views:'./keystone/component-blocks'
        },
        componentBlocks,
      }),
      
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Menu: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      links: json({
        ui: {
          views: './keystone/fields/related-links/components',
          createView: { fieldMode: 'edit' },
          listView: { fieldMode: 'hidden' },
          itemView: { fieldMode: 'edit' },
        },
      }),
    },
  }),
  Tag: list({
    access: allowAll,
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      users: relationship({ ref: "User.tags", many: true }),
    },
  }),
};