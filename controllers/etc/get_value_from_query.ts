import { NextApiRequest } from 'next';

export default function getStringValueFromQuery({
  query,
  field,
}: {
  query: NextApiRequest['query'];
  field: string;
}) {
  const value = query[field];
  if (value) {
    return Array.isArray(value) ? value[0] : value;
  }
  return undefined;
}
