import 'antd/dist/antd.min.css';

import Head from 'next/head';
import React from 'react';

interface Props {
  title?: string;
}

const YaHead: React.FC<Props> = ({ children, title = 'Ya-Live 2019' }) => (
  <Head>
    <title>{title}</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" href="./common.css" />
    {children}
  </Head>
);

export default YaHead;
