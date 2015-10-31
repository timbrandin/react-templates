ReactTemplate = class {
  constructor(source) {
    this._source = source;
  }
  static compile(className, markup) {
    markup = ReactTemplate.appendEventMap(className, markup);

    ReactRegex.forEach(function (obj) {
      markup = markup.replace(obj.regex, obj.replace);
    });

    return markup;
  }
  static appendEventMap(className, markup) {
    // if (GLOBAL.eventMaps[className]) {
    //
    // }
    return markup;
  }
  parse(source) {
    let jsx = source;

    BlazeRegex.forEach(function (obj) {
      jsx = jsx.replace(obj.regex, obj.replace);
    });

    return jsx;
  }
  toString() {
    return this.parse(this._source);
  }
}

ReactTemplateCompiler = class ReactTemplateCompiler {
  processFilesForTarget(inputFiles) {
    inputFiles.forEach(function (inputFile) {
      let original = inputFile.getContentsAsString();
      var inputFilePath = inputFile.getPathInPackage();
      var outputFilePath = inputFile.getPathInPackage();
      var fileOptions = inputFile.getFileOptions();
      var toBeAdded = {
        sourcePath: outputFilePath,
        path: outputFilePath.replace('.jsx.html', '.jsx.js'),
        data: source,
        hash: inputFile.getSourceHash(),
        sourceMap: null,
        bare: !! fileOptions.bare
      };

      source = "" + new ReactTemplate(original);
      const result = ReactTemplateCompiler.transpile(source, inputFile);
      toBeAdded.data = result.code;
      toBeAdded.hash = result.hash;
      toBeAdded.sourceMap = result.map;

      inputFile.addJavaScript(toBeAdded);
    });
  }

  setDiskCacheDirectory(cacheDir) {
    Babel.setCacheDir(cacheDir);
  }

  static transpile(source, inputFile) {
    var self = {extraFeatures: {react: true}};
    var excludedFileExtensionPattern = /\.es5\.js$/i;
    var inputFilePath = inputFile.getPathInPackage();
    var outputFilePath = inputFile.getPathInPackage();
    var fileOptions = inputFile.getFileOptions();

    // If you need to exclude a specific file within a package from Babel
    // compilation, pass the { transpile: false } options to api.addFiles
    // when you add that file.
    if (fileOptions.transpile !== false &&
        // If you need to exclude a specific file within an app from Babel
        // compilation, give it the following file extension: .es5.js
        ! excludedFileExtensionPattern.test(inputFilePath)) {

      var targetCouldBeInternetExplorer8 =
        inputFile.getArch() === "web.browser";

      self.extraFeatures = self.extraFeatures || {};
      if (! self.extraFeatures.hasOwnProperty("jscript")) {
        // Perform some additional transformations to improve
        // compatibility in older browsers (e.g. wrapping named function
        // expressions, per http://kiro.me/blog/nfe_dilemma.html).
        self.extraFeatures.jscript = targetCouldBeInternetExplorer8;
      }

      var babelOptions = Babel.getDefaultOptions(self.extraFeatures);

      babelOptions.sourceMap = true;
      babelOptions.filename = inputFilePath;
      babelOptions.sourceFileName = "/" + inputFilePath;
      babelOptions.sourceMapName = "/" + outputFilePath + ".map";

      // Capture jsx failures in compiling.
      try {
        var result = Babel.compile(source, babelOptions);
      } catch (e) {
        if (e.loc) {
          // Babel error
          inputFile.error({
            message: e.message,
            sourcePath: inputFile.getPathInPackage(),
            line: e.loc.line,
            column: e.loc.column
          });

          console.log('\n\n\n');
          console.log(inputFile.getPathInPackage());
          console.log('=====================');
          console.log(inputFile.getContentsAsString());
          const lines = ("" + jsx).split(/\n/g);
          _.each(lines, (line, i) => console.log((i+1) + '  ', line));

          return;
        } else {
          throw e;
        }
      }

      return result;
    }
  }
};

Plugin.registerCompiler({
  extensions: ['html']
}, () => new ReactTemplateCompiler()
);