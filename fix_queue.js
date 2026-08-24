import fs from 'fs';
let code = fs.readFileSync('src/app/evaluator/queue/page.tsx', 'utf8');
code = code.replace(
  '<Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" render={<Link href={`/evaluator/review/${sub.id}`} />}>',
  '<Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" asChild><Link href={`/evaluator/review/${sub.id}`}>'
);
code = code.replace(
  '                          </Button>\n                        </TableCell>',
  '</Link></Button>\n                        </TableCell>'
);
fs.writeFileSync('src/app/evaluator/queue/page.tsx', code);
