<p align="center"><img src="/docs/branding/wapplr/bundled.png?raw=true" alt="logo-text" width="25%"></p>
<p align="center"><img src="/docs/branding/wapplr/text.png?raw=true" alt="logo-text" width="25%"></p>
<h1></h1>

<a name="overview"></a>

### Overview

**w**eb-**app**lication-bui**l**de**r** 4 (`wapplr4`) is a curated [webpack 4](https://webpack.js.org/) starter intended for [React.js](https://reactjs.org/) web development.

<a name="quick-start"></a>

### Quick Start

1. Clone repo &mdash; `$ git clone https://github.com/cgabriel5/wapplr4.git "my-app"`
2. Install dependencies... &mdash; `$ yarn install`
   - Then start webpack with a script using `yarn` or `npm`:
     - Development: `$ yarn run dev`.
     - Production: `$ yarn run prod`.
     - See [scripts](#scripts) for more info.
3. Start developing!

<a name="features"></a>

### Features

- Boilerplate provides project structure to start developing a React.js project.
  - [Babel](https://babeljs.io/) ready.
  - Image optimization.
  - Favicon generator utility.
    - Generates favicon and auto injects favicon markup into `index.html`.
- Conveniently includes following front-end libraries:
  - [`sanitize.css`](https://csstools.github.io/sanitize.css/)
  - [`font-awesome`](http://fontawesome.io/)
  - [`modernizr.js`](https://modernizr.com/)
  - [`fastclick.js`](https://labs.ft.com/fastclick/)

<a name="scripts"></a>

### Scripts

<a name="core-scripts"></a>

#### Core scripts:

```shell
# Runs webpack-dev-server.
$ yarn run devserver

# Generates split JS project bundle to help improve performance.
$ yarn run dll

# Build development version of app.
$ yarn run dev
# Runs webpack's watch mode with '--mode=development'.
$ yarn run watch

# Build production version of app.
$ yarn run prod
```

<a name="utility-scripts"></a>

#### Utility scripts:

```shell

# CLI prettier watcher formats files when file is modified.
$ yarn run pretty

# Lints ./src/*.js files using ESLint.
$ yarn run lint

# Generate project favicons.
$ yarn run favicon
```

<a name="contributing"></a>

### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](/CONTRIBUTING.md).

<a name="license"></a>

### License

This project uses the [MIT License](/LICENSE.txt).
