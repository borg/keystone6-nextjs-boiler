import React from 'react';
import { keystoneContext } from '../../keystone/context';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import Link from "next/link";

const renderers: DocumentRendererProps['renderers'] = {
    inline: {
        relationship({ relationship, data }) {
          if (relationship === 'mention') {
            if (!data || !data.data) {
              return null;
            } else {
              return <li className='capitalize'><Link href={`/${data.data.name.toLowerCase()}`}>{data.data.name}</Link></li>;
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


export async function Menu({name}) {
  // WARNING: this does nothing for now
  //   you will probably use getServerSession from 'next/auth'
  //   https://next-auth.js.org/configuration/nextjs#in-app-directory
  const session = {};
  const menus = await keystoneContext.withSession(session).query.Menu.findMany({
    where: { name: {equals:name} },
    query: 'id name links ',
  });

  if(!menus.length){
    return <p>Menu {name} missing</p>
  }

  return (
    <section>
      <ul>
        {menus[0].links.map((m, i)=>{
           return <li key={i} className='capitalize'><Link href={`/${m.href}`} target={m.target?m.target:'_self'}>{m.label}</Link></li>
        })
           
           
        }
      </ul>
    </section>
  );
}