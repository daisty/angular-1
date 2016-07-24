import { CompileDirectiveMetadata, CompileIdentifierMap, CompileNgModuleMetadata, CompileProviderMetadata, CompileQueryMetadata, CompileTokenMetadata } from './compile_metadata';
import { ParseError, ParseSourceSpan } from './parse_util';
import { AttrAst, DirectiveAst, ProviderAst, ReferenceAst } from './template_ast';
export declare class ProviderError extends ParseError {
    constructor(message: string, span: ParseSourceSpan);
}
export declare class ProviderViewContext {
    component: CompileDirectiveMetadata;
    sourceSpan: ParseSourceSpan;
    /**
     * @internal
     */
    viewQueries: CompileIdentifierMap<CompileTokenMetadata, CompileQueryMetadata[]>;
    /**
     * @internal
     */
    viewProviders: CompileIdentifierMap<CompileTokenMetadata, boolean>;
    errors: ProviderError[];
    constructor(component: CompileDirectiveMetadata, sourceSpan: ParseSourceSpan);
}
export declare class ProviderElementContext {
    private _viewContext;
    private _parent;
    private _isViewRoot;
    private _directiveAsts;
    private _sourceSpan;
    private _contentQueries;
    private _transformedProviders;
    private _seenProviders;
    private _allProviders;
    private _attrs;
    private _hasViewContainer;
    constructor(_viewContext: ProviderViewContext, _parent: ProviderElementContext, _isViewRoot: boolean, _directiveAsts: DirectiveAst[], attrs: AttrAst[], refs: ReferenceAst[], _sourceSpan: ParseSourceSpan);
    afterElement(): void;
    readonly transformProviders: ProviderAst[];
    readonly transformedDirectiveAsts: DirectiveAst[];
    readonly transformedHasViewContainer: boolean;
    private _addQueryReadsTo(token, queryReadTokens);
    private _getQueriesFor(token);
    private _getOrCreateLocalProvider(requestingProviderType, token, eager);
    private _getLocalDependency(requestingProviderType, dep, eager?);
    private _getDependency(requestingProviderType, dep, eager?);
}
export declare class NgModuleProviderParser {
    private _transformedProviders;
    private _seenProviders;
    private _unparsedProviders;
    private _allProviders;
    private _errors;
    constructor(ngModule: CompileNgModuleMetadata, extraProviders: CompileProviderMetadata[], sourceSpan: ParseSourceSpan);
    parse(): ProviderAst[];
    private _getOrCreateLocalProvider(token, eager);
    private _getDependency(dep, eager, requestorSourceSpan);
}
