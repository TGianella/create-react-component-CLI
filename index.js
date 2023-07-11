#!/usr/bin/env node

//Module imports
const config = require('./config.json')
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

//Command line arguments parsing
const argv = yargs(hideBin(process.argv))
  .option('pr', {
    alias: 'props',
    array: true,
    describe: 'Any number of props you want included in the new component'
  })
  .option('pa', {
    alias: 'path',
    describe: 'Specifies the base path for creating the component if you want to override the default value (./src)'
  })
  .option('pg', {
    alias: 'page',
    boolean: true,
    default: false,
    describe: 'Tells if the component to be created is a page'
  })
  .default('parent', null)
  .option('prt', {
    alias: 'parent',
    describe: 'Specifies the parent component or page'
  })
  .check((argv) => {
    if (argv._.length === 0) {
      throw new Error("Please enter a name for the component")
    } else {
      return true
    }
  })
  .argv

const { page, props, parent, path, _ } = argv;
const [rawTitle] = _;
const title = rawTitle[0].toUpperCase() + rawTitle.slice(1);
const compType = page ? 'pages' : 'components'

//File paths
const basePath = path || config.path || 'src'
const dirPath = `${basePath}/${compType}`;
const compPath = dirPath + `/${title}`;
const parentPath = getParentPath(parent, basePath)

function getParentPath(parent, basePath) {
  const parentIsComponent = fs.existsSync(`${basePath}/components/${parent}/index.jsx`);

  if (parent) {
    if (parent === 'App') {
      return `${basePath}/App.jsx`;
    } else {
      return `${basePath}/${parentIsComponent ? 'components' : 'pages'}/${parent}/index.jsx`;
    }
  }
}

//File templates
const propsString = props ? `{ ${props.join(', ')} }` : ''
const JSXdata = `import './style.scss';

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
if (parent && !fs.existsSync(parentPath)) {
  throw new Error(`Parent component ${parent} not found at ${parentPath}`)
}

//Creating components/pages directory
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log(`Created ${compType} directory`)
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
  const componentImport = `import ${title} from './${title}';`
  const parentData = fs.readFileSync(parentPath).toString().split("\n");
  const newParentData = [componentImport, ...parentData].join("\n");
  fs.writeFileSync(parentPath, newParentData);
  console.log(`Imported component ${title} into parent component ${parent}.`);
}
