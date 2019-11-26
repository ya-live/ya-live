import Head from 'next/head';
import React from 'react';

import 'antd/dist/antd.min.css';

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
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </div>
);

export default Layout;
