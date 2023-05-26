//Module imports
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

//Command line arguments parsing
const argv = yargs(hideBin(process.argv))
  .array('props')
  .boolean('page')
  .default('page', false)
  .default('parent', null)
  .argv

// Arguments : component title, parent=null, --props, --page

const { page, props, parent, _ } = argv;
const [rawTitle] = _;
const title = rawTitle[0].toUpperCase() + rawTitle.slice(1);
const compType = page ? 'pages' : 'components'

//File paths
const dirPath = `src/${compType}`;
const compPath = dirPath + `/${title}`;
const parentCompPath = `src/components/${parent}/index.jsx`

//File templates
const propsString = props ? `{ ${props} }` : ''
const JSXdata = `import React from 'react';
import './style.scss';

function ${title}(${propsString}) {

  return (
    <div className="${rawTitle}">${title}</div>
  )
}

export default ${title};
`
const SCSSdata = `.${rawTitle} {
  outline: solid red;
}`


console.log(argv);
console.log("parent:", parent);

if (!title) {
  throw new Error("Please enter a name for the component.")
}

//Checking the current directory to make sure it is a properly setup react project
process.stdout.write('Checking package.json... ');
if (!fs.existsSync('package.json')) {
  throw new Error('package.json not found on the current working directory. You need to be in the root directory of your react project.');
} else {
  const pkges = JSON.parse(fs.readFileSync('package.json')).dependencies;
  if (pkges.react === undefined) {
    throw new Error('Did not find react in the dependencies of your project. Are you sure react is properly set up ?');
  }
} 
console.log('OK');

//Checking file tree
process.stdout.write('Checking directories... ');
if (fs.existsSync(compPath)) {
  throw new Error('This component already exists !');
}
console.log('OK');

//Checking if parent component exists
if (!fs.existsSync(parentPath)) {
  throw new Error(`Parent component ${parent} not found at ${parentPath}`)
}

//Creating components/pages directory
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  process.stdout.write(`Created ${compType} directory`)
}

//Creating component directory
fs.mkdirSync(compPath);
console.log('Created component directory');

//Creating jsx file
fs.writeFileSync(`${compPath}/index.jsx`, JSXdata);
console.log('Created index.jsx');

//Creating SCSS file
fs.writeFileSync(`${compPath}/style.scss`, SCSSdata);
console.log('Created style.scss');

// Creating import into parent component
if (parent) {
  let parentPath
  if (parent === 'App') {
    parentPath = 'src/App.jsx';
  } else {
    parentPath =  `src/${fs.existsSync(parentCompPath) ? 'components' : 'pages'}/${parent}/index.jsx`;
  }

  const componentImport = `import ${title} from './${title}';`
  const parentData = fs.readFileSync(parentPath).toString().split("\n");
  const reactImport = parentData.shift();
  const newParentData = [reactImport, componentImport, ...parentData].join("\n");
  fs.writeFileSync(parentPath, newParentData);
  console.log(`Imported component ${title} into parent component ${parent}.`);
}
