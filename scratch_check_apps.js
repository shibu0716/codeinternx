import fs from 'fs';
let content = fs.readFileSync('src/app/admin/applications/ApplicationsClient.tsx', 'utf8');
content = content.replace(
  'return (',
  'return (<pre>{JSON.stringify(apps, null, 2)}</pre> <div className="hidden">'
);
content = content.replace(
  '</div>\n  );\n}',
  '</div></div>\n  );\n}'
);
fs.writeFileSync('src/app/admin/applications/ApplicationsClient.tsx', content);
