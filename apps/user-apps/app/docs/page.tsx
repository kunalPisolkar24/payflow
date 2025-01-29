'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: true });

export default function ApiDocs() {

  return (
    <div>
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
