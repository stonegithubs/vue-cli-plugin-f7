module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    dependencies: {
      "dom7": "^2.1.3",
      "framework7": "^4.1.1",
      "framework7-vue": "^4.1.1",
      "framework7-icons": "^2.3.0",
      "template7": "^1.4.1",
    },
    devDependencies: {
      "css-loader": "^2.1.1", 
      "cpy-cli": "^2.0.0"
    }, 
    scripts: {
      "copy-fonts": "cpy node_modules/framework7-icons/fonts/*.* src/fonts",
      "postinstall": "npm run copy-fonts"
    }
  });

  if (options.addExampleApplication) {
    api.render('./template', {
      ...options,
    });
  }

  let f7LinesImport = `\n\nimport Framework7 from 'framework7/framework7.esm.bundle.js';\n\nimport Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js'\n`;

  let f7StyleImport = `// Import F7 Styles\nimport 'framework7/css/framework7.css';\n\n// Import Icons and App Custom Styles\nimport './css/icons.css';\nimport './css/app.css';\n`

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
    lines[lastImportIndex] += f7LinesImport + f7StyleImport+ f7LinesUse;

    // modify app
    contentMain = lines.reverse().join('\n');
    fs.writeFileSync(mainPath, contentMain, { encoding: 'utf-8' });
  });
};
