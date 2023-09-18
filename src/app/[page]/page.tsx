import React from 'react';
import { keystoneContext } from '../../../keystone/context';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import lodash from 'lodash';
import deepdash from 'deepdash';
const _ = deepdash(lodash);


const blocks = {};

const renderers: DocumentRendererProps['renderers'] = {
    inline: {
        relationship({ relationship, data }) {
          if (relationship === 'block') {
            if (!data || !blocks[data.id]) {
              return null;
            } else {
              return <div id={blocks[data.id]?.name}><DocumentRenderer document={blocks[data.id]?.content?.document} /></div>;
            }
          }
          return null;
        },
      },
      block: {
        paragraph: ({ children, textAlign }) => {
          return <>{children}</>;//this removes an outer p wrapper from li children
        },
      },
    };


export default async function Page({params}:{params:{page:string}}) {

    const session = {}; 

    const pages = (await keystoneContext.withSession(session).query.Page.findMany({
        where: { name: {equals:params!.page as string} },
        query: 'id name content {document}',
      }));


      //for some reason I cannot run hydrateRelationships without invoking server admin component
      _.eachDeep(pages, async(value, key, parent, context) => {
        if(key === 'relationship' && value ==='block'){
            let block = await keystoneContext.withSession(session).query.Block.findOne({
                where:parent.data,
                query: 'id name content {document }'});
                blocks[parent.data.id] = block
        }
      });


      if(pages.length){
        return (<div>
            
            <DocumentRenderer document={pages[0].content.document} renderers={renderers} />

            </div>);
      }else{
        return (<div><p>Missing page</p></div>);
      }

    
}