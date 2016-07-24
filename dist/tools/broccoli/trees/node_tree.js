'use strict';
var broccoli_dest_copy_1 = require('../broccoli-dest-copy');
var broccoli_typescript_1 = require('../broccoli-typescript');
var Funnel = require('broccoli-funnel');
var broccoli_merge_trees_1 = require('../broccoli-merge-trees');
var path = require('path');
var broccoli_lodash_1 = require('../broccoli-lodash');
var broccoli_replace_1 = require('../broccoli-replace');
var broccoli_generate_for_test_1 = require('../broccoli-generate-for-test');
var stew = require('broccoli-stew');
var writeFile = require('broccoli-file-creator');
var projectRootDir = path.normalize(path.join(__dirname, '..', '..', '..', '..'));
module.exports = function makeNodeTree(projects, destinationPath) {
    // list of npm packages that this build will create
    var outputPackages = ['angular2', 'benchpress'];
    var srcTree = new Funnel('modules', {
        include: ['angular2/**'],
        exclude: [
            '**/e2e_test/**',
            'angular2/test/**',
            'angular2/examples/**',
            'angular2/src/testing/**',
            'angular2/testing.ts',
            'angular2/testing_internal.ts',
            'angular2/src/upgrade/**',
            'angular2/upgrade.ts',
            'angular2/platform/testing/**',
            'angular2/manual_typings/**',
            'angular2/typings/**',
        ]
    });
    var externalTypings = [
        'angular2/typings/hammerjs/hammerjs.d.ts',
        'angular2/typings/node/node.d.ts',
        'angular2/manual_typings/globals.d.ts',
        'angular2/typings/es6-collections/es6-collections.d.ts',
        'angular2/typings/es6-promise/es6-promise.d.ts',
    ];
    var externalTypingsTree = new Funnel('modules', { files: externalTypings });
    var packageTypings = new Funnel('node_modules', { include: ['rxjs/**/*.d.ts', 'zone.js/**/*.d.ts'] });
    var compileSrcContext = broccoli_merge_trees_1.default([srcTree, externalTypingsTree, packageTypings]);
    // Compile the sources and generate the @internal .d.ts
    var compiledSrcTreeWithInternals = compileTree(compileSrcContext, true, []);
    var testTree = new Funnel('modules', {
        include: [
            'angular2/manual_typings/**',
            'angular2/typings/**',
            'angular2/test/**',
            'benchpress/**',
            '**/e2e_test/**',
            'angular2/examples/**/*_spec.ts',
            'angular2/src/testing/**',
            'angular2/testing.ts',
            'angular2/testing_internal.ts',
            'angular2/src/upgrade/**',
            'angular2/upgrade.ts',
            'angular2/platform/testing/**',
        ],
        exclude: [
            // the following code and tests are not compatible with CJS/node environment
            'angular2/test/animate/**',
            'angular2/test/core/zone/**',
            'angular2/test/testing/fake_async_spec.ts',
            'angular2/test/testing/testing_public_browser_spec.ts',
            'angular2/test/platform/xhr_impl_spec.ts',
            'angular2/test/platform/browser/**/*.ts',
            'angular2/test/common/forms/**',
            'angular2/manual_typings/**',
            'angular2/typings/**',
            // we call browser's bootstrap
            'angular2/test/router/route_config/route_config_spec.ts',
            'angular2/test/router/integration/bootstrap_spec.ts',
            // we check the public api by importing angular2/angular2
            'angular2/test/symbol_inspector/**/*.ts',
            'angular2/test/public_api_spec.ts',
            'angular2/test/web_workers/worker/renderer_integration_spec.ts',
            'angular2/test/upgrade/**/*.ts',
            'angular1_router/**',
            'payload_tests/**',
        ]
    });
    // Compile the tests against the src @internal .d.ts
    var srcPrivateDeclarations = new Funnel(compiledSrcTreeWithInternals, { srcDir: broccoli_typescript_1.INTERNAL_TYPINGS_PATH });
    var testAmbients = [
        'angular2/typings/jasmine/jasmine.d.ts',
        'angular2/typings/angular-protractor/angular-protractor.d.ts',
        'angular2/typings/selenium-webdriver/selenium-webdriver.d.ts'
    ];
    var testAmbientsTree = new Funnel('modules', { files: testAmbients });
    testTree = broccoli_merge_trees_1.default([testTree, srcPrivateDeclarations, testAmbientsTree, externalTypingsTree, packageTypings]);
    var compiledTestTree = compileTree(testTree, false, []);
    // Merge the compiled sources and tests
    var compiledSrcTree = new Funnel(compiledSrcTreeWithInternals, { exclude: [(broccoli_typescript_1.INTERNAL_TYPINGS_PATH + "/**")] });
    var compiledTree = broccoli_merge_trees_1.default([compiledSrcTree, compiledTestTree]);
    // Generate test files
    var generatedJsTestFiles = broccoli_generate_for_test_1.default(compiledTree, { files: ['*/test/**/*_codegen_untyped.js'] });
    var generatedTsTestFiles = stew.rename(broccoli_generate_for_test_1.default(compiledTree, { files: ['*/test/**/*_codegen_typed.js'] }), /.js$/, '.ts');
    // Compile generated test files against the src @internal .d.ts and the test files
    compiledTree = broccoli_merge_trees_1.default([
        compiledTree, generatedJsTestFiles,
        compileTree(new Funnel(broccoli_merge_trees_1.default([
            packageTypings,
            new Funnel('modules', { include: ['angular2/manual_typings/**', 'angular2/typings/**'] }),
            generatedTsTestFiles, srcPrivateDeclarations, compiledTestTree
        ]), { include: ['angular2/**', 'rxjs/**', 'zone.js/**'] }), false, [])
    ], { overwrite: true });
    // Down-level .d.ts files to be TS 1.8 compatible
    // TODO(alexeagle): this can be removed once we drop support for using Angular 2 with TS 1.8
    compiledTree = broccoli_replace_1.default(compiledTree, {
        files: ['**/*.d.ts'],
        patterns: [
            // all readonly keywords
            { match: /^(\s*(static\s+|private\s+)*)readonly\s+/mg, replacement: '$1' },
            // abstract properties (but not methods or classes)
            { match: /^(\s+)abstract\s+([^\(\n]*$)/mg, replacement: '$1$2' },
        ]
    });
    // Now we add the LICENSE file into all the folders that will become npm packages
    outputPackages.forEach(function (destDir) {
        var license = new Funnel('.', { files: ['LICENSE'], destDir: destDir });
        // merge the test tree
        compiledTree = broccoli_merge_trees_1.default([compiledTree, license]);
    });
    // Get all docs and related assets and prepare them for js build
    var srcDocs = extractDocs(srcTree);
    var testDocs = extractDocs(testTree);
    var BASE_PACKAGE_JSON = require(path.join(projectRootDir, 'package.json'));
    var srcPkgJsons = extractPkgJsons(srcTree, BASE_PACKAGE_JSON);
    var testPkgJsons = extractPkgJsons(testTree, BASE_PACKAGE_JSON);
    // Copy es6 typings so quickstart doesn't require typings install
    var typingsTree = broccoli_merge_trees_1.default([
        new Funnel('modules', {
            include: [
                'angular2/typings/es6-collections/es6-collections.d.ts',
                'angular2/typings/es6-promise/es6-promise.d.ts',
            ]
        }),
        writeFile('angular2/typings/browser.d.ts', '// Typings needed for compilation with --target=es5\n' +
            '///<reference path="./es6-collections/es6-collections.d.ts"/>\n' +
            '///<reference path="./es6-promise/es6-promise.d.ts"/>\n')
    ]);
    var nodeTree = broccoli_merge_trees_1.default([compiledTree, srcDocs, testDocs, srcPkgJsons, testPkgJsons, typingsTree]);
    // Transform all tests to make them runnable in node
    nodeTree = broccoli_replace_1.default(nodeTree, {
        files: ['**/test/**/*_spec.js'],
        patterns: [
            {
                match: /^/,
                replacement: function () {
                    return "var parse5Adapter = require('angular2/src/platform/server/parse5_adapter');\r\n" +
                        "parse5Adapter.Parse5DomAdapter.makeCurrent();";
                }
            },
            { match: /$/, replacement: function (_, relativePath) { return '\r\n main(); \r\n'; } }
        ]
    });
    // Prepend 'use strict' directive to all JS files.
    // See https://github.com/Microsoft/TypeScript/issues/3576
    nodeTree = broccoli_replace_1.default(nodeTree, { files: ['**/*.js'], patterns: [{ match: /^/, replacement: function () { return "'use strict';"; } }] });
    return broccoli_dest_copy_1.default(nodeTree, destinationPath);
};
function compileTree(tree, genInternalTypings, rootFilePaths) {
    if (rootFilePaths === void 0) { rootFilePaths = []; }
    return broccoli_typescript_1.default(tree, {
        // build pipeline options
        'rootFilePaths': rootFilePaths,
        'internalTypings': genInternalTypings,
        // tsc options
        'emitDecoratorMetadata': true,
        'experimentalDecorators': true,
        'declaration': true,
        'stripInternal': true,
        'module': 'commonjs',
        'moduleResolution': 'classic',
        'noEmitOnError': true,
        'rootDir': '.',
        'inlineSourceMap': true,
        'inlineSources': true,
        'target': 'es5'
    });
}
function extractDocs(tree) {
    var docs = new Funnel(tree, { include: ['**/*.md', '**/*.png'], exclude: ['**/*.dart.md'] });
    return stew.rename(docs, 'README.js.md', 'README.md');
}
function extractPkgJsons(tree, BASE_PACKAGE_JSON) {
    // Generate shared package.json info
    var COMMON_PACKAGE_JSON = {
        version: BASE_PACKAGE_JSON.version,
        homepage: BASE_PACKAGE_JSON.homepage,
        bugs: BASE_PACKAGE_JSON.bugs,
        license: BASE_PACKAGE_JSON.license,
        repository: BASE_PACKAGE_JSON.repository,
        contributors: BASE_PACKAGE_JSON.contributors,
        dependencies: BASE_PACKAGE_JSON.dependencies,
        devDependencies: BASE_PACKAGE_JSON.devDependencies,
        defaultDevDependencies: {}
    };
    var packageJsons = new Funnel(tree, { include: ['**/package.json'] });
    return broccoli_lodash_1.default(packageJsons, { context: { 'packageJson': COMMON_PACKAGE_JSON } });
}
//# sourceMappingURL=node_tree.js.map