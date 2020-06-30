class FileListPlugin {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const cssRegex = /\.css$/;
      const jsRegex = /\.js$/;

      const files = {
        js: [],
        css: [],
        dependencies: this.dependencies,
      };

      for (const entryPoint of compilation.entrypoints.keys()) {
        for (const file of compilation.entrypoints.get(entryPoint).getFiles()) {
          if (cssRegex.test(file)) {
            files.css.push(file);
          } else if (jsRegex.test(file)) {
            files.js.push(file);
          }
        }
      }

      const filelist = JSON.stringify(files, null, 2);
      // Insert this list into the webpack build as a new file asset:
      compilation.assets['filelist.json'] = {
        source() {
          return filelist;
        },
        size() {
          return filelist.length;
        },
      };

      callback();
    });
  }
}

module.exports = FileListPlugin;
