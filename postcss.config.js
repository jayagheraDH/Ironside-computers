module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-nesting',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        'postcss-import': {},
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ],
}
