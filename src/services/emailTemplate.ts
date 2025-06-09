import fs from 'fs';
import path from 'path';

export const loadEmailTemplate = (templateName: string, variables: any): string => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  
  let template = fs.readFileSync(templatePath, 'utf-8');
 
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    template = template.replace(regex, variables[key]);
    
  });
  
  return template;
};