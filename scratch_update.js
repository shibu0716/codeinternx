import fs from 'fs';
let content = fs.readFileSync('/Users/pyaradox/.gemini/antigravity-ide/brain/95ea6222-c740-4238-999c-4959660ccde9/e2e_fail.md', 'utf8');
content += '\n\n![Task Page](/Users/pyaradox/.gemini/antigravity-ide/brain/95ea6222-c740-4238-999c-4959660ccde9/e2e_student_task_3.png)';
fs.writeFileSync('/Users/pyaradox/.gemini/antigravity-ide/brain/95ea6222-c740-4238-999c-4959660ccde9/e2e_fail.md', content);
