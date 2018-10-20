module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    dependencies: {
      "framework7": "^3.4.3",
      "framework7-vue": "^3.4.3",
    },
  });

  // if (options.addExample) {
  //   api.render('./template', {
  //     ...options,
  //   });
  // }

  let f7LinesImport = `\nimport Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js'\n`;

  let f7LinesUse = `\nFramework7.use(Framework7Vue)\n`;



  api.onCreateComplete(() => {
    // inject to main.js
    const fs = require('fs');
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js';
    const mainPath = api.resolve(`./src/main.${ext}`);

    // get content
    let contentMain = fs.readFileSync(mainPath, { encoding: 'utf-8' });
    const lines = contentMain.split(/\r?\n/g).reverse();

    // inject import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/));
    lines[lastImportIndex] += f7LinesImport + f7LinesUse;

    // modify app
    contentMain = lines.reverse().join('\n');
    fs.writeFileSync(mainPath, contentMain, { encoding: 'utf-8' });
  });
};
