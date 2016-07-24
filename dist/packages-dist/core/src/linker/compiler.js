/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exceptions_1 = require('../facade/exceptions');
var lang_1 = require('../facade/lang');
/**
 * Indicates that a component is still being loaded in a synchronous compile.
 *
 * @stable
 */
var ComponentStillLoadingError = (function (_super) {
    __extends(ComponentStillLoadingError, _super);
    function ComponentStillLoadingError(compType) {
        _super.call(this, "Can't compile synchronously as " + lang_1.stringify(compType) + " is still being loaded!");
        this.compType = compType;
    }
    return ComponentStillLoadingError;
}(exceptions_1.BaseException));
exports.ComponentStillLoadingError = ComponentStillLoadingError;
/**
 * Low-level service for running the angular compiler duirng runtime
 * to create {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 *
 * Each `@NgModule` provides an own `Compiler` to its injector,
 * that will use the directives/pipes of the ng module for compilation
 * of components.
 * @stable
 */
var Compiler = (function () {
    function Compiler() {
    }
    Object.defineProperty(Compiler.prototype, "injector", {
        /**
         * Returns the injector with which the compiler has been created.
         *
         * @internal
         */
        get: function () {
            throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to read the injector.");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Loads the template and styles of a component and returns the associated `ComponentFactory`.
     */
    Compiler.prototype.compileComponentAsync = function (component) {
        throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(component));
    };
    /**
     * Compiles the given component. All templates have to be either inline or compiled via
     * `compileComponentAsync` before. Otherwise throws a {@link ComponentStillLoadingError}.
     */
    Compiler.prototype.compileComponentSync = function (component) {
        throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(component));
    };
    /**
     * Compiles the given NgModule. All templates of the components listed in `precompile`
     * have to be either inline or compiled before via `compileComponentAsync` /
     * `compileNgModuleAsync`. Otherwise throws a {@link ComponentStillLoadingError}.
     */
    Compiler.prototype.compileNgModuleSync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(moduleType));
    };
    Compiler.prototype.compileNgModuleAsync = function (moduleType, metadata) {
        if (metadata === void 0) { metadata = null; }
        throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(moduleType));
    };
    /**
     * Clears all caches
     */
    Compiler.prototype.clearCache = function () { };
    /**
     * Clears the cache for the given component/ngModule.
     */
    Compiler.prototype.clearCacheFor = function (type) { };
    return Compiler;
}());
exports.Compiler = Compiler;
/**
 * A factory for creating a Compiler
 *
 * @experimental
 */
var CompilerFactory = (function () {
    function CompilerFactory() {
    }
    CompilerFactory.mergeOptions = function (defaultOptions, newOptions) {
        if (defaultOptions === void 0) { defaultOptions = {}; }
        if (newOptions === void 0) { newOptions = {}; }
        return {
            useDebug: _firstDefined(newOptions.useDebug, defaultOptions.useDebug),
            useJit: _firstDefined(newOptions.useJit, defaultOptions.useJit),
            defaultEncapsulation: _firstDefined(newOptions.defaultEncapsulation, defaultOptions.defaultEncapsulation),
            providers: _mergeArrays(defaultOptions.providers, newOptions.providers)
        };
    };
    CompilerFactory.prototype.withDefaults = function (options) {
        if (options === void 0) { options = {}; }
        return new _DefaultApplyingCompilerFactory(this, options);
    };
    return CompilerFactory;
}());
exports.CompilerFactory = CompilerFactory;
var _DefaultApplyingCompilerFactory = (function (_super) {
    __extends(_DefaultApplyingCompilerFactory, _super);
    function _DefaultApplyingCompilerFactory(_delegate, _options) {
        _super.call(this);
        this._delegate = _delegate;
        this._options = _options;
    }
    _DefaultApplyingCompilerFactory.prototype.createCompiler = function (options) {
        if (options === void 0) { options = {}; }
        return this._delegate.createCompiler(CompilerFactory.mergeOptions(this._options, options));
    };
    return _DefaultApplyingCompilerFactory;
}(CompilerFactory));
function _firstDefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
function _mergeArrays() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i - 0] = arguments[_i];
    }
    var result = [];
    parts.forEach(function (part) { return result.push.apply(result, part); });
    return result;
}
//# sourceMappingURL=compiler.js.map