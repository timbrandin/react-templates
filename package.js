Package.describe({
  name: 'timbrandin:react-templates',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'React Templates for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timbrandin/react-templates',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'react-templates',
  use: [
    'babel-compiler@5.8.24_1',
    'ecmascript@0.1.6',
    'underscore@1.0.4',
    'reactive-var',
    'tracker'
  ],
  sources: [
    'blaze-regex.js',
    'react-regex.js',
    'react-events.js',
    'plugin/plugin.js'
  ],
  npmDependencies: {
    'cheerio': '0.7.0'
  }
});

Npm.depends({
  "classnames": "2.1.3"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'isobuild:compiler-plugin@1.0.0',
  ]);
  api.imply([
    'babel-runtime@0.1.4',
    'react-runtime@0.14.1_1',
    'kadira:dochead'
  ]);

  api.use(['cosmos:browserify@0.7.4'], 'client');

  api.addFiles([
    'exports-server.js',
    'exports.js',
  ], 'server');

  api.addFiles([
    'client.browserify.js',
    'exports.js'
  ], 'client');

  api.export(['RT', 'ReactTemplate']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('timbrandin:react-templates');
});