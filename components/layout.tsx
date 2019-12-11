import Head from 'next/head';
import React from 'react';

interface Props {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'This is the default title',
}) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>
    {children}
  </div>
);

export default Layout;
