import * as React from 'react';

export interface Props {
  from: string;
}

export function Hello({ from }: Props) {
  return <h1>Hello from {from}!</h1>;
}
