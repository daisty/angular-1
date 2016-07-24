/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Compiler, CompilerFactory, Component, ComponentResolver, Injectable, PLATFORM_DIRECTIVES, PLATFORM_PIPES, ReflectiveInjector, ViewEncapsulation, isDevMode } from '@angular/core';
export * from './template_ast';
export { TEMPLATE_TRANSFORMS } from './template_parser';
export { CompilerConfig, RenderTypes } from './config';
export * from './compile_metadata';
export * from './offline_compiler';
export { RuntimeCompiler } from './runtime_compiler';
export * from './url_resolver';
export * from './xhr';
export { ViewResolver } from './view_resolver';
export { DirectiveResolver } from './directive_resolver';
export { PipeResolver } from './pipe_resolver';
export { NgModuleResolver } from './ng_module_resolver';
import { stringify } from './facade/lang';
import { ListWrapper } from './facade/collection';
import { TemplateParser } from './template_parser';
import { HtmlParser } from './html_parser';
import { DirectiveNormalizer } from './directive_normalizer';
import { CompileMetadataResolver } from './metadata_resolver';
import { StyleCompiler } from './style_compiler';
import { ViewCompiler } from './view_compiler/view_compiler';
import { NgModuleCompiler } from './ng_module_compiler';
import { CompilerConfig } from './config';
import { RuntimeCompiler } from './runtime_compiler';
import { ElementSchemaRegistry } from './schema/element_schema_registry';
import { DomElementSchemaRegistry } from './schema/dom_element_schema_registry';
import { UrlResolver, DEFAULT_PACKAGE_URL_PROVIDER } from './url_resolver';
import { Parser } from './expression_parser/parser';
import { Lexer } from './expression_parser/lexer';
import { ViewResolver } from './view_resolver';
import { DirectiveResolver } from './directive_resolver';
import { PipeResolver } from './pipe_resolver';
import { NgModuleResolver } from './ng_module_resolver';
import { Console, Reflector, reflector, ReflectorReader } from '../core_private';
import { XHR } from './xhr';
/**
 * A set of providers that provide `RuntimeCompiler` and its dependencies to use for
 * template compilation.
 */
export const COMPILER_PROVIDERS = 
/*@ts2dart_const*/ [
    { provide: Reflector, useValue: reflector },
    { provide: ReflectorReader, useExisting: Reflector },
    Console,
    Lexer,
    Parser,
    HtmlParser,
    TemplateParser,
    DirectiveNormalizer,
    CompileMetadataResolver,
    DEFAULT_PACKAGE_URL_PROVIDER,
    StyleCompiler,
    ViewCompiler,
    NgModuleCompiler,
    /*@ts2dart_Provider*/ { provide: CompilerConfig, useValue: new CompilerConfig() },
    RuntimeCompiler,
    /*@ts2dart_Provider*/ { provide: ComponentResolver, useExisting: RuntimeCompiler },
    /*@ts2dart_Provider*/ { provide: Compiler, useExisting: RuntimeCompiler },
    DomElementSchemaRegistry,
    /*@ts2dart_Provider*/ { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
    UrlResolver,
    ViewResolver,
    DirectiveResolver,
    PipeResolver,
    NgModuleResolver
];
export function analyzeAppProvidersForDeprecatedConfiguration(appProviders = []) {
    let platformDirectives = [];
    let platformPipes = [];
    let compilerProviders = [];
    let useDebug;
    let useJit;
    let defaultEncapsulation;
    const deprecationMessages = [];
    // Note: This is a hack to still support the old way
    // of configuring platform directives / pipes and the compiler xhr.
    // This will soon be deprecated!
    const tempInj = ReflectiveInjector.resolveAndCreate(appProviders);
    const compilerConfig = tempInj.get(CompilerConfig, null);
    if (compilerConfig) {
        platformDirectives = compilerConfig.platformDirectives;
        platformPipes = compilerConfig.platformPipes;
        useJit = compilerConfig.useJit;
        useDebug = compilerConfig.genDebugInfo;
        defaultEncapsulation = compilerConfig.defaultEncapsulation;
        deprecationMessages.push(`Passing CompilerConfig as a regular provider is deprecated. Use the "compilerOptions" parameter of "bootstrap()" or use a custom "CompilerFactory" platform provider instead.`);
    }
    else {
        // If nobody provided a CompilerConfig, use the
        // PLATFORM_DIRECTIVES / PLATFORM_PIPES values directly if existing
        platformDirectives = tempInj.get(PLATFORM_DIRECTIVES, []);
        platformPipes = tempInj.get(PLATFORM_PIPES, []);
    }
    platformDirectives = ListWrapper.flatten(platformDirectives);
    platformPipes = ListWrapper.flatten(platformPipes);
    const xhr = tempInj.get(XHR, null);
    if (xhr) {
        compilerProviders.push([{ provide: XHR, useValue: xhr }]);
        deprecationMessages.push(`Passing XHR as regular provider is deprecated. Pass the provider via "compilerOptions" instead.`);
    }
    if (platformDirectives.length > 0) {
        deprecationMessages.push(`The PLATFORM_DIRECTIVES provider and CompilerConfig.platformDirectives is deprecated. Add the directives to an NgModule instead! ` +
            `(Directives: ${platformDirectives.map(type => stringify(type))})`);
    }
    if (platformPipes.length > 0) {
        deprecationMessages.push(`The PLATFORM_PIPES provider and CompilerConfig.platformPipes is deprecated. Add the pipes to an NgModule instead! ` +
            `(Pipes: ${platformPipes.map(type => stringify(type))})`);
    }
    const compilerOptions = {
        useJit: useJit,
        useDebug: useDebug,
        defaultEncapsulation: defaultEncapsulation,
        providers: compilerProviders
    };
    class DynamicComponent {
    }
    /** @nocollapse */
    DynamicComponent.decorators = [
        { type: Component, args: [{ directives: platformDirectives, pipes: platformPipes, template: '' },] },
    ];
    return {
        compilerOptions,
        moduleDeclarations: [DynamicComponent],
        deprecationMessages: deprecationMessages
    };
}
export class _RuntimeCompilerFactory extends CompilerFactory {
    createCompiler(options) {
        const injector = ReflectiveInjector.resolveAndCreate([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers. E.g. important for the testing platform.
                        genDebugInfo: _firstDefined(options.useDebug, isDevMode()),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: _firstDefined(options.useJit, true),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: _firstDefined(options.defaultEncapsulation, ViewEncapsulation.Emulated),
                        logBindingUpdate: _firstDefined(options.useDebug, isDevMode())
                    });
                },
                deps: []
            },
            // options.providers will always contain a provider for XHR as well
            // (added by platforms). So allow compilerProviders to overwrite this
            options.providers ? options.providers : []
        ]);
        return injector.get(Compiler);
    }
}
/** @nocollapse */
_RuntimeCompilerFactory.decorators = [
    { type: Injectable },
];
export const RUNTIME_COMPILER_FACTORY = new _RuntimeCompilerFactory();
function _firstDefined(...args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
function _mergeArrays(...parts) {
    let result = [];
    parts.forEach((part) => result.push(...part));
    return result;
}
//# sourceMappingURL=compiler.js.map