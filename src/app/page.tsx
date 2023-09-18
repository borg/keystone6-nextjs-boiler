import React from 'react';
import { keystoneContext } from '../../keystone/context';
import { DocumentRender } from './DocumentRender';

export default async function HomePage() {

  const session = {};
  const users = await keystoneContext.withSession(session).query.User.findMany({
    query: 'id name about { document } tags {name}',
  });
  return (
    <section>
      <h1 className='text-3xl font-bold underline text-pink-500'>Keystone 🤝 Next.js</h1>
      <ul>
        <li>Below you can see the names of users in the database.</li>
      </ul>

      <div>
        <p>
          <strong>Users fetched from the server</strong>
        </p>
        <ol>
          {
           users.map(u => {
            return (
              <li key={u.id}>
                <span className='text-xl' >{u.name} </span>
                {
                  u.tags.map((t,i)=>{
                    return <span className='text-xs' key={i}>{t.name}</span>
                  })
                }
                {u.about && (
                  <>
                    <hr />
                    <DocumentRender document={u.about?.document} />
                  </>
                )}
              </li>
            );
          }) }
        </ol>
      </div>

    </section>
  );
}