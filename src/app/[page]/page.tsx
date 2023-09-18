import React from 'react';
import { keystoneContext } from '../../../keystone/context';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';

const blocks = {};

const renderers: DocumentRendererProps['renderers'] = {
    inline: {
        relationship({ relationship, data }) {
          if (relationship === 'block') {
            if (!data || !blocks[data.id]) {
              return null;
            } else {
               // console.log({block:blocks[data.id]});
               // return <p>{JSON.stringify(blocks[data.id])}</p>
              return <div id={blocks[data.id].name}><DocumentRenderer document={blocks[data.id].content.document} /></div>;
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
      for(let p of pages){
        for(let node of p.content.document){
            if(node.type ==='layout'){
                for(let child of node.children){
                    for(let b of child.children){
                        for(let c of b.children){
                            if(c.relationship === 'block'){
                                let block = await keystoneContext.withSession(session).query.Block.findOne({
                                where:c.data,
                                query: 'id name content {document }'});
                                blocks[c.data.id] = block;
                                
                            }
                        }
                    }
                }

            }
         
        }
    }
      


      if(pages.length){
        return (<div>
            
            <DocumentRenderer document={pages[0].content.document} renderers={renderers} />

            </div>);
      }else{
        return (<div><p>Missing page</p></div>);
      }

    
}