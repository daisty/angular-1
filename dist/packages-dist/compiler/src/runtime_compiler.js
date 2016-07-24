/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var core_1 = require('@angular/core');
var core_private_1 = require('../core_private');
var exceptions_1 = require('../src/facade/exceptions');
var lang_1 = require('../src/facade/lang');
var async_1 = require('../src/facade/async');
var compile_metadata_1 = require('./compile_metadata');
var style_compiler_1 = require('./style_compiler');
var view_compiler_1 = require('./view_compiler/view_compiler');
var ng_module_compiler_1 = require('./ng_module_compiler');
var template_parser_1 = require('./template_parser');
var directive_normalizer_1 = require('./directive_normalizer');
var metadata_resolver_1 = require('./metadata_resolver');
var config_1 = require('./config');
var ir = require('./output/output_ast');
var output_jit_1 = require('./output/output_jit');
var output_interpreter_1 = require('./output/output_interpreter');
var util_1 = require('./util');
var RuntimeCompiler = (function () {
    function RuntimeCompiler(_injector, _metadataResolver, _templateNormalizer, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig, _console) {
        this._injector = _injector;
        this._metadataResolver = _metadataResolver;
        this._templateNormalizer = _templateNormalizer;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._compilerConfig = _compilerConfig;
        this._console = _console;
        this._compiledTemplateCache = new Map();
        this._compiledHostTemplateCache = new Map();
        this._compiledNgModuleCache = new Map();
    }
    Object.defineProperty(RuntimeCompiler.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    RuntimeCompiler.prototype.compileNgModuleSync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        return this._compileNgModuleAndComponents(moduleType, true).syncResult;
    };
    RuntimeCompiler.prototype.compileNgModuleAsync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        return this._compileNgModuleAndComponents(moduleType, false).asyncResult;
    };
    RuntimeCompiler.prototype._compileNgModuleAndComponents = function (moduleType, isSync) {
        var componentPromise = this._compileComponents(moduleType, isSync);
        var ngModuleFactory = this._compileNgModule(moduleType);
        return new util_1.SyncAsyncResult(ngModuleFactory, componentPromise.then(function () { return ngModuleFactory; }));
    };
    RuntimeCompiler.prototype._compileNgModule = function (moduleType) {
        var _this = this;
        var ngModuleFactory = this._compiledNgModuleCache.get(moduleType);
        if (!ngModuleFactory) {
            var moduleMeta_1 = this._metadataResolver.getNgModuleMetadata(moduleType);
            var transitiveModuleMeta = moduleMeta_1.transitiveModule;
            var boundCompilerFactory = function (parentResolver) {
                return new CoreCompiler(_this, moduleMeta_1.type.runtime, parentResolver, _this._console);
            };
            // Always provide a bound Compiler and ComponentResolver
            var extraProviders = [
                this._metadataResolver.getProviderMetadata(new core_1.Provider(core_1.Compiler, {
                    useFactory: boundCompilerFactory,
                    deps: [[new core_1.OptionalMetadata(), new core_1.SkipSelfMetadata(), core_1.ComponentResolver]]
                })),
                this._metadataResolver.getProviderMetadata(new core_1.Provider(core_1.ComponentResolver, { useExisting: core_1.Compiler }))
            ];
            var compileResult = this._ngModuleCompiler.compile(moduleMeta_1, extraProviders);
            compileResult.dependencies.forEach(function (dep) {
                dep.placeholder.runtime =
                    _this._assertComponentLoaded(dep.comp.runtime, true).proxyComponentFactory;
                dep.placeholder.name = "compFactory_" + dep.comp.name;
            });
            if (lang_1.IS_DART || !this._compilerConfig.useJit) {
                ngModuleFactory =
                    output_interpreter_1.interpretStatements(compileResult.statements, compileResult.ngModuleFactoryVar);
            }
            else {
                ngModuleFactory = output_jit_1.jitStatements(moduleMeta_1.type.name + ".ngfactory.js", compileResult.statements, compileResult.ngModuleFactoryVar);
            }
            this._compiledNgModuleCache.set(moduleMeta_1.type.runtime, ngModuleFactory);
        }
        return ngModuleFactory;
    };
    /**
     * @internal
     */
    RuntimeCompiler.prototype._compileComponentInModule = function (compType, isSync, moduleType) {
        this._metadataResolver.addComponentToModule(moduleType, compType);
        var componentPromise = this._compileComponents(moduleType, isSync);
        var componentFactory = this._assertComponentLoaded(compType, true).proxyComponentFactory;
        return new util_1.SyncAsyncResult(componentFactory, componentPromise.then(function () { return componentFactory; }));
    };
    /**
     * @internal
     */
    RuntimeCompiler.prototype._compileComponents = function (mainModule, isSync) {
        var _this = this;
        var templates = new Set();
        var loadingPromises = [];
        var ngModule = this._metadataResolver.getNgModuleMetadata(mainModule);
        ngModule.transitiveModule.modules.forEach(function (localModuleMeta) {
            localModuleMeta.declaredDirectives.forEach(function (dirMeta) {
                if (dirMeta.isComponent) {
                    var template = _this._createCompiledTemplate(dirMeta, localModuleMeta.transitiveModule.directives, localModuleMeta.transitiveModule.pipes);
                    if (!templates.has(template)) {
                        templates.add(template);
                    }
                    dirMeta.precompile.forEach(function (precompileType) {
                        var template = _this._createCompiledHostTemplate(precompileType.runtime);
                        if (!templates.has(template)) {
                            templates.add(template);
                        }
                    });
                }
            });
            localModuleMeta.precompile.forEach(function (precompileType) {
                var template = _this._createCompiledHostTemplate(precompileType.runtime);
                if (!templates.has(template)) {
                    templates.add(template);
                }
            });
        });
        templates.forEach(function (template) {
            if (template.loading) {
                if (isSync) {
                    throw new core_1.ComponentStillLoadingError(template.compType.runtime);
                }
                else {
                    loadingPromises.push(template.loading);
                }
            }
        });
        var compile = function () { templates.forEach(function (template) { _this._compileTemplate(template); }); };
        if (isSync) {
            compile();
            return Promise.resolve(null);
        }
        else {
            return Promise.all(loadingPromises).then(compile);
        }
    };
    RuntimeCompiler.prototype.clearCacheFor = function (type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        var compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
            this._templateNormalizer.clearCacheFor(compiledTemplate.normalizedCompMeta);
            this._compiledTemplateCache.delete(type);
        }
    };
    RuntimeCompiler.prototype.clearCache = function () {
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._templateNormalizer.clearCache();
        this._compiledNgModuleCache.clear();
    };
    RuntimeCompiler.prototype._createCompiledHostTemplate = function (compType) {
        var compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (lang_1.isBlank(compiledTemplate)) {
            var compMeta = this._metadataResolver.getDirectiveMetadata(compType);
            assertComponent(compMeta);
            var hostMeta = compile_metadata_1.createHostComponentMeta(compMeta);
            compiledTemplate = new CompiledTemplate(true, compMeta.selector, compMeta.type, [compMeta], [], this._templateNormalizer.normalizeDirective(hostMeta));
            this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
    };
    RuntimeCompiler.prototype._createCompiledTemplate = function (compMeta, directives, pipes) {
        var compiledTemplate = this._compiledTemplateCache.get(compMeta.type.runtime);
        if (lang_1.isBlank(compiledTemplate)) {
            assertComponent(compMeta);
            compiledTemplate = new CompiledTemplate(false, compMeta.selector, compMeta.type, directives, pipes, this._templateNormalizer.normalizeDirective(compMeta));
            this._compiledTemplateCache.set(compMeta.type.runtime, compiledTemplate);
        }
        return compiledTemplate;
    };
    RuntimeCompiler.prototype._assertComponentLoaded = function (compType, isHost) {
        var compiledTemplate = isHost ? this._compiledHostTemplateCache.get(compType) :
            this._compiledTemplateCache.get(compType);
        if (!compiledTemplate) {
            throw new exceptions_1.BaseException("Illegal state: CompiledTemplate for " + lang_1.stringify(compType) + " (isHost: " + isHost + ") does not exist!");
        }
        if (compiledTemplate.loading) {
            throw new exceptions_1.BaseException("Illegal state: CompiledTemplate for " + lang_1.stringify(compType) + " (isHost: " + isHost + ") is still loading!");
        }
        return compiledTemplate;
    };
    RuntimeCompiler.prototype._compileTemplate = function (template) {
        var _this = this;
        if (template.isCompiled) {
            return;
        }
        var compMeta = template.normalizedCompMeta;
        var externalStylesheetsByModuleUrl = new Map();
        var stylesCompileResult = this._styleCompiler.compileComponent(compMeta);
        stylesCompileResult.externalStylesheets.forEach(function (r) { externalStylesheetsByModuleUrl.set(r.meta.moduleUrl, r); });
        this._resolveStylesCompileResult(stylesCompileResult.componentStylesheet, externalStylesheetsByModuleUrl);
        var viewCompMetas = template.viewComponentTypes.map(function (compType) { return _this._assertComponentLoaded(compType, false).normalizedCompMeta; });
        var parsedTemplate = this._templateParser.parse(compMeta, compMeta.template.template, template.viewDirectives.concat(viewCompMetas), template.viewPipes, compMeta.type.name);
        var compileResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, ir.variable(stylesCompileResult.componentStylesheet.stylesVar), template.viewPipes);
        compileResult.dependencies.forEach(function (dep) {
            var depTemplate;
            if (dep instanceof view_compiler_1.ViewFactoryDependency) {
                var vfd = dep;
                depTemplate = _this._assertComponentLoaded(vfd.comp.runtime, false);
                vfd.placeholder.runtime = depTemplate.proxyViewFactory;
                vfd.placeholder.name = "viewFactory_" + vfd.comp.name;
            }
            else if (dep instanceof view_compiler_1.ComponentFactoryDependency) {
                var cfd = dep;
                depTemplate = _this._assertComponentLoaded(cfd.comp.runtime, true);
                cfd.placeholder.runtime = depTemplate.proxyComponentFactory;
                cfd.placeholder.name = "compFactory_" + cfd.comp.name;
            }
        });
        var statements = stylesCompileResult.componentStylesheet.statements.concat(compileResult.statements);
        var factory;
        if (lang_1.IS_DART || !this._compilerConfig.useJit) {
            factory = output_interpreter_1.interpretStatements(statements, compileResult.viewFactoryVar);
        }
        else {
            factory = output_jit_1.jitStatements(template.compType.name + ".ngfactory.js", statements, compileResult.viewFactoryVar);
        }
        template.compiled(factory);
    };
    RuntimeCompiler.prototype._resolveStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        var _this = this;
        result.dependencies.forEach(function (dep, i) {
            var nestedCompileResult = externalStylesheetsByModuleUrl.get(dep.moduleUrl);
            var nestedStylesArr = _this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
            dep.valuePlaceholder.runtime = nestedStylesArr;
            dep.valuePlaceholder.name = "importedStyles" + i;
        });
    };
    RuntimeCompiler.prototype._resolveAndEvalStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        if (lang_1.IS_DART || !this._compilerConfig.useJit) {
            return output_interpreter_1.interpretStatements(result.statements, result.stylesVar);
        }
        else {
            return output_jit_1.jitStatements(result.meta.moduleUrl + ".css.js", result.statements, result.stylesVar);
        }
    };
    /** @nocollapse */
    RuntimeCompiler.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    RuntimeCompiler.ctorParameters = [
        { type: core_1.Injector, },
        { type: metadata_resolver_1.CompileMetadataResolver, },
        { type: directive_normalizer_1.DirectiveNormalizer, },
        { type: template_parser_1.TemplateParser, },
        { type: style_compiler_1.StyleCompiler, },
        { type: view_compiler_1.ViewCompiler, },
        { type: ng_module_compiler_1.NgModuleCompiler, },
        { type: config_1.CompilerConfig, },
        { type: core_private_1.Console, },
    ];
    return RuntimeCompiler;
}());
exports.RuntimeCompiler = RuntimeCompiler;
var CompiledTemplate = (function () {
    function CompiledTemplate(isHost, selector, compType, viewDirectivesAndComponents, viewPipes, _normalizeResult) {
        var _this = this;
        this.isHost = isHost;
        this.compType = compType;
        this.viewPipes = viewPipes;
        this._viewFactory = null;
        this.loading = null;
        this._normalizedCompMeta = null;
        this.isCompiled = false;
        this.isCompiledWithDeps = false;
        this.viewComponentTypes = [];
        this.viewDirectives = [];
        viewDirectivesAndComponents.forEach(function (dirMeta) {
            if (dirMeta.isComponent) {
                _this.viewComponentTypes.push(dirMeta.type.runtime);
            }
            else {
                _this.viewDirectives.push(dirMeta);
            }
        });
        this.proxyViewFactory = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (!_this._viewFactory) {
                throw new exceptions_1.BaseException("Illegal state: CompiledTemplate for " + lang_1.stringify(_this.compType) + " is not compiled yet!");
            }
            return _this._viewFactory.apply(null, args);
        };
        this.proxyComponentFactory = isHost ?
            new core_1.ComponentFactory(selector, this.proxyViewFactory, compType.runtime) :
            null;
        if (_normalizeResult.syncResult) {
            this._normalizedCompMeta = _normalizeResult.syncResult;
        }
        else {
            this.loading = _normalizeResult.asyncResult.then(function (normalizedCompMeta) {
                _this._normalizedCompMeta = normalizedCompMeta;
                _this.loading = null;
            });
        }
    }
    Object.defineProperty(CompiledTemplate.prototype, "normalizedCompMeta", {
        get: function () {
            if (this.loading) {
                throw new exceptions_1.BaseException("Template is still loading for " + this.compType.name + "!");
            }
            return this._normalizedCompMeta;
        },
        enumerable: true,
        configurable: true
    });
    CompiledTemplate.prototype.compiled = function (viewFactory) {
        this._viewFactory = viewFactory;
        this.isCompiled = true;
    };
    CompiledTemplate.prototype.depsCompiled = function () { this.isCompiledWithDeps = true; };
    return CompiledTemplate;
}());
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new exceptions_1.BaseException("Could not compile '" + meta.type.name + "' because it is not a component.");
    }
}
/**
 * Implements `Compiler` and `ComponentResolver` by delegating
 * to the RuntimeCompiler using a known module.
 */
var CoreCompiler = (function () {
    function CoreCompiler(_delegate, _ngModule, _parentComponentResolver, _console) {
        this._delegate = _delegate;
        this._ngModule = _ngModule;
        this._parentComponentResolver = _parentComponentResolver;
        this._console = _console;
        this._warnOnComponentResolver = true;
    }
    Object.defineProperty(CoreCompiler.prototype, "injector", {
        get: function () { return this._delegate.injector; },
        enumerable: true,
        configurable: true
    });
    CoreCompiler.prototype.resolveComponent = function (component) {
        if (lang_1.isString(component)) {
            if (this._parentComponentResolver) {
                return this._parentComponentResolver.resolveComponent(component);
            }
            else {
                return async_1.PromiseWrapper.reject(new exceptions_1.BaseException("Cannot resolve component using '" + component + "'."), null);
            }
        }
        if (this._warnOnComponentResolver) {
            this._console.warn(core_1.ComponentResolver.DynamicCompilationDeprecationMsg);
            this._warnOnComponentResolver = false;
        }
        return this.compileComponentAsync(component);
    };
    CoreCompiler.prototype.compileComponentAsync = function (compType) {
        return this._delegate._compileComponentInModule(compType, false, this._ngModule).asyncResult;
    };
    CoreCompiler.prototype.compileComponentSync = function (compType) {
        return this._delegate._compileComponentInModule(compType, true, this._ngModule).syncResult;
    };
    CoreCompiler.prototype.compileNgModuleSync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        return this._delegate.compileNgModuleSync(moduleType, metadata);
    };
    CoreCompiler.prototype.compileNgModuleAsync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        return this._delegate.compileNgModuleAsync(moduleType, metadata);
    };
    /**
     * Clears all caches
     */
    CoreCompiler.prototype.clearCache = function () {
        this._delegate.clearCache();
        if (this._parentComponentResolver) {
            this._parentComponentResolver.clearCache();
        }
    };
    /**
     * Clears the cache for the given component/ngModule.
     */
    CoreCompiler.prototype.clearCacheFor = function (type) { this._delegate.clearCacheFor(type); };
    return CoreCompiler;
}());
//# sourceMappingURL=runtime_compiler.js.map