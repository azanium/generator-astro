module.exports = (api) => {
  const env = api.env();

  const includeCoverage = process.env.BABEL_COVERAGE === 'true';

  const envOpts = {
    loose: true,
    modules: false,
    exclude: ['transform-typeof-symbol'],
  };

  let convertESM = true;

  switch (env) {
    // Configs used during bundling builds.
    case 'babel-parser':
      convertESM = false;
      break;
    case 'standalone':
      convertESM = false;
      break;
    case 'production':
      // Config during builds before publish.
      envOpts.targets = {
        node: '8.0',
      };
      break;
    case 'test':
      envOpts.targets = {
        node: 'current',
      };
      break;
    case 'development':
    default:
      envOpts.debug = true;
      envOpts.targets = {
        node: 'current',
      };
      break;
  }

  const config = {
    // Our dependencies are all standard CommonJS, along with all sorts of
    // other random files in Babel's codebase, so we use script as the default,
    // and then mark actual modules as modules farther down.
    sourceType: 'module',
    comments: false,
    ignore: [
      // These may not be strictly necessary with the newly-limited scope of
      // babelrc searching, but including them for now because we had them
      // in our .babelignore before.
      'src/**/fixtures',
    ].filter(Boolean),
    presets: [['@babel/env', envOpts], '@babel/preset-react'],
    plugins: [
      // TODO: Use @babel/preset-flow when
      // https://github.com/babel/babel/issues/7233 is fixed
      '@babel/plugin-transform-flow-strip-types',
      ['@babel/proposal-class-properties', { loose: true }],
      '@babel/proposal-export-namespace-from',
      '@babel/proposal-numeric-separator',
      [
        '@babel/proposal-object-rest-spread',
        { useBuiltIns: true, loose: true },
      ],

      // Explicitly use the lazy version of CommonJS modules.
      convertESM ? ['@babel/transform-modules-commonjs', { lazy: true }] : null,
    ].filter(Boolean),
  };

  // we need to do this as long as we do not test everything from source
  if (includeCoverage) {
    config.auxiliaryCommentBefore = 'istanbul ignore next';
    config.plugins.push('babel-plugin-istanbul');
  }

  return config;
};
