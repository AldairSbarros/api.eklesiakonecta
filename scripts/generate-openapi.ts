import fs from 'fs';
import path from 'path';
import swaggerSpec from '../src/docs/swaggerConfig';

const outPath = path.join(process.cwd(), 'openapi.json');
fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2));
console.log('openapi.json gerado em', outPath);
