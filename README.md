# create-react-component-CLI

<p>
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=white&style=for-the-badge" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" />
  <img alt="npm" src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white&style=for-the-badge" />
</p>

Ever dreamt of creating your react components on the command line ? That dream is coming true thanks to this incredible new package.

Right now it is a VERY opinionated tool as it was first created for a group project, accustomed to our own specific filepath conventions, but I'm working on making it more universal and customizable.

Feel free to open an issue if you're interested with contributing to this project ! 

## Installation

Now officially published to NPM ! :tada:

Install with `pnpm add @tgianella/create-react-component-cli`, `npm add @tgianella/create-react-component-cli` or `yarn add @tgianella/create-react-component-cli`.

## Getting started

Run `npx newcomp` to see help.

Exemple : `npx newcomp component_name --props prop1 prop2 --path ./src/pages --page --parent parent_component`

This creates a component_name component at src/pages with props prop1 and prop2 and already imported into parent_component.

You can edit the base file path used for creating components in config.json.

## Common issues

- This package checks that react is properly installed by reading package.json. Using it outside of a react project is going to throw an error.
- Your project needs to have a 'src' directory at the root if you dont specify a path with `--path`.

## TODO

- Testing
- Heavy refactoring, splitting up code into functions and modules.
- Continue implementing options on the command line to unopinionate this package
