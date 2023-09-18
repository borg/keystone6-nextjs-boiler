import React,{ReactNode} from 'react';
import '../styles/globals.css';
import {Menu} from './Menu';
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <title>Keystone + Next.js</title>
        <meta
          name="description"
          content="Example to use Keystone APIs in a Next.js server environment."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="container mx-auto px-4">
            <Link href='/'>Home</Link>
            <Menu name='main'/>
            <main>{children}</main>

        </div>
      </body>
    </html>
  );
}