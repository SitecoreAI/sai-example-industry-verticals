import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guidePath = path.join(root, 'src/pages/demo.tsx');
const pdfPath = path.join(root, 'public/demo/westfield-demo-cheat-sheet.pdf');
const manifestPath = path.join(root, 'scripts/demo-cheat-sheet.manifest.json');
const source = ts.createSourceFile(guidePath, readFileSync(guidePath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declarations = new Map();
for (const statement of source.statements) {
  if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        declarations.set(declaration.name.text, declaration.initializer);
      }
    }
  }
}

// Read literal guide data without importing the page or executing application code.
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node) && declarations.has(node.text)) return literal(declarations.get(node.text));
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) throw new Error('Unsupported guide property.');
      return [property.name.text, literal(property.initializer)];
    }));
  }
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => String(literal(span.expression)) + span.literal.text).join('');
  }
  throw new Error(`The PDF exporter needs support for guide expression: ${ts.SyntaxKind[node.kind]}`);
}

const copyLabels = new Set([
  'Casey email and password', 'Jordan email and password', 'Article page name', 'Article title',
  'Image alt text', 'First Section heading', 'New Section name', 'Second Section heading', 'Article body search',
]);
const rawFlows = literal(declarations.get('flows'));
const flows = rawFlows.map((flow) => ({
  code: flow.code,
  title: flow.title,
  time: flow.time,
  steps: flow.blocks.filter((block) => block.kind === 'do').map(({ id, title }) => ({ id, title })),
  copy: Object.fromEntries(flow.blocks.filter((block) => block.kind === 'copy' && copyLabels.has(block.label)).map((block) => [block.label, block.value])),
}));
const data = { flows };
const generatorSource = readFileSync(path.join(root, 'scripts/generate-demo-cheat-sheet.py'));
const sourceHash = createHash('sha256').update(JSON.stringify(rawFlows)).update(generatorSource).update(readFileSync(fileURLToPath(import.meta.url))).digest('hex');

if (process.argv[2] === 'export') {
  process.stdout.write(JSON.stringify({ ...data, sourceHash }));
} else if (process.argv[2] === 'check') {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const pdf = readFileSync(pdfPath);
    const pdfHash = createHash('sha256').update(pdf).digest('hex');
    if (manifest.sourceHash !== sourceHash || manifest.pdfHash !== pdfHash || manifest.pages !== 3 || pdf.subarray(0, 5).toString() !== '%PDF-') {
      throw new Error('The presenter PDF is out of date.');
    }
    process.stdout.write('Kindle cheat sheet matches the presenter guide (3 pages).\n');
  } catch (cause) {
    process.stderr.write(`${cause.message}\nRun npm run demo:pdf, then commit the updated PDF and manifest.\n`);
    process.exitCode = 1;
  }
} else {
  throw new Error('Use export or check.');
}
