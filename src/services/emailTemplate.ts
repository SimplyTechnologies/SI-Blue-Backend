import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loadEmailTemplate = (templateName: string, variables: any): string => {
  try {
    const templatePath = path.join(__dirname, '../templates', templateName);

    let template = fs.readFileSync(templatePath, 'utf-8');

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      template = template.replace(regex, variables[key]);
    });

    return template;
  } catch (err) {
    throw new Error('Failed to load email template');
  }
};

