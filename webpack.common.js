const path = require('path');

module.exports = {
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/app.js',
  },
};

https://docbox.etsi.org/Workshop/2023/11_UCAAT/TUTORIALS/Tutorial_Sharma_automation%20using%20karate.pdf