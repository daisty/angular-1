/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var compile_metadata_1 = require('@angular/compiler/src/compile_metadata');
var o = require('@angular/compiler/src/output/output_ast');
var path_util_1 = require('@angular/compiler/src/output/path_util');
var util_1 = require('@angular/compiler/src/util');
var core_1 = require('@angular/core');
var view_type_1 = require('@angular/core/src/linker/view_type');
var exceptions_1 = require('../../src/facade/exceptions');
var ExternalClass = (function () {
    function ExternalClass(data) {
        this.data = data;
        this.changeable = data;
    }
    ExternalClass.prototype.someMethod = function (a /** TODO #9100 */) { return { 'param': a, 'data': this.data }; };
    return ExternalClass;
}());
exports.ExternalClass = ExternalClass;
var testDataIdentifier = new compile_metadata_1.CompileIdentifierMetadata({
    name: 'ExternalClass',
    moduleUrl: "asset:@angular/lib/compiler/test/output/output_emitter_util",
    runtime: ExternalClass
});
var eventEmitterIdentifier = new compile_metadata_1.CompileIdentifierMetadata({ name: 'EventEmitter', moduleUrl: util_1.assetUrl('core'), runtime: core_1.EventEmitter });
var enumIdentifier = new compile_metadata_1.CompileIdentifierMetadata({
    name: 'ViewType.HOST',
    moduleUrl: util_1.assetUrl('core', 'linker/view_type'),
    runtime: view_type_1.ViewType.HOST
});
var baseExceptionIdentifier = new compile_metadata_1.CompileIdentifierMetadata({ name: 'BaseException', moduleUrl: util_1.assetUrl('core'), runtime: exceptions_1.BaseException });
exports.codegenExportsVars = [
    'getExpressions',
];
var _getExpressionsStmts = [
    o.variable('readVar').set(o.literal('someValue')).toDeclStmt(),
    o.variable('changedVar').set(o.literal('initialValue')).toDeclStmt(),
    o.variable('changedVar').set(o.literal('changedValue')).toStmt(),
    o.variable('map')
        .set(o.literalMap([
        ['someKey', o.literal('someValue')],
        ['changeable', o.literal('initialValue')],
    ]))
        .toDeclStmt(),
    o.variable('map').key(o.literal('changeable')).set(o.literal('changedValue')).toStmt(),
    o.variable('externalInstance')
        .set(o.importExpr(testDataIdentifier).instantiate([o.literal('someValue')]))
        .toDeclStmt(),
    o.variable('externalInstance').prop('changeable').set(o.literal('changedValue')).toStmt(),
    o.variable('fn')
        .set(o.fn([new o.FnParam('param')], [new o.ReturnStatement(o.literalMap([['param', o.variable('param')]]))], o.DYNAMIC_TYPE))
        .toDeclStmt(),
    o.variable('throwError')
        .set(o.fn([], [new o.ThrowStmt(o.importExpr(baseExceptionIdentifier).instantiate([o.literal('someError')]))]))
        .toDeclStmt(),
    o.variable('catchError')
        .set(o.fn([new o.FnParam('runCb')], [new o.TryCatchStmt([o.variable('runCb').callFn([]).toStmt()], [new o.ReturnStatement(o.literalArr([o.CATCH_ERROR_VAR, o.CATCH_STACK_VAR]))])], o.DYNAMIC_TYPE))
        .toDeclStmt(),
    o.variable('dynamicInstance')
        .set(o.variable('DynamicClass').instantiate([
        o.literal('someValue'), o.literal('dynamicValue')
    ]))
        .toDeclStmt(),
    o.variable('dynamicInstance').prop('dynamicChangeable').set(o.literal('changedValue')).toStmt(),
    new o.ReturnStatement(o.literalMap([
        ['stringLiteral', o.literal('Hello World!')],
        ['intLiteral', o.literal(42)],
        ['boolLiteral', o.literal(true)],
        ['arrayLiteral', o.literalArr([o.literal(0)])],
        ['mapLiteral', o.literalMap([['key0', o.literal(0)]])],
        ['readVar', o.variable('readVar')],
        ['changedVar', o.variable('changedVar')],
        ['readKey', o.variable('map').key(o.literal('someKey'))],
        ['changedKey', o.variable('map').key(o.literal('changeable'))],
        ['readPropExternalInstance', o.variable('externalInstance').prop('data')],
        ['readPropDynamicInstance', o.variable('dynamicInstance').prop('dynamicProp')],
        ['readGetterDynamicInstance', o.variable('dynamicInstance').prop('dynamicGetter')],
        ['changedPropExternalInstance', o.variable('externalInstance').prop('changeable')],
        ['changedPropDynamicInstance', o.variable('dynamicInstance').prop('dynamicChangeable')],
        [
            'invokeMethodExternalInstance',
            o.variable('externalInstance').callMethod('someMethod', [o.literal('someParam')])
        ],
        [
            'invokeMethodExternalInstanceViaBind',
            o.variable('externalInstance')
                .prop('someMethod')
                .callMethod(o.BuiltinMethod.bind, [o.variable('externalInstance')])
                .callFn([o.literal('someParam')])
        ],
        [
            'invokeMethodDynamicInstance',
            o.variable('dynamicInstance').callMethod('dynamicMethod', [o.literal('someParam')])
        ],
        [
            'invokeMethodDynamicInstanceViaBind',
            o.variable('dynamicInstance')
                .prop('dynamicMethod')
                .callMethod(o.BuiltinMethod.bind, [o.variable('dynamicInstance')])
                .callFn([o.literal('someParam')])
        ],
        [
            'concatedArray', o.literalArr([o.literal(0)])
                .callMethod(o.BuiltinMethod.ConcatArray, [o.literalArr([o.literal(1)])])
        ],
        ['fn', o.variable('fn')],
        ['closureInDynamicInstance', o.variable('dynamicInstance').prop('closure')],
        ['invokeFn', o.variable('fn').callFn([o.literal('someParam')])],
        [
            'conditionalTrue', o.literal('')
                .prop('length')
                .equals(o.literal(0))
                .conditional(o.literal('true'), o.literal('false'))
        ],
        [
            'conditionalFalse', o.literal('')
                .prop('length')
                .notEquals(o.literal(0))
                .conditional(o.literal('true'), o.literal('false'))
        ],
        ['not', o.not(o.literal(false))],
        ['externalTestIdentifier', o.importExpr(testDataIdentifier)],
        ['externalSrcIdentifier', o.importExpr(eventEmitterIdentifier)],
        ['externalEnumIdentifier', o.importExpr(enumIdentifier)],
        ['externalInstance', o.variable('externalInstance')],
        ['dynamicInstance', o.variable('dynamicInstance')],
        ['throwError', o.variable('throwError')],
        ['catchError', o.variable('catchError')],
        [
            'operators', o.literalMap([
                ['==', createOperatorFn(o.BinaryOperator.Equals)],
                ['!=', createOperatorFn(o.BinaryOperator.NotEquals)],
                ['===', createOperatorFn(o.BinaryOperator.Identical)],
                ['!==', createOperatorFn(o.BinaryOperator.NotIdentical)],
                ['-', createOperatorFn(o.BinaryOperator.Minus)],
                ['+', createOperatorFn(o.BinaryOperator.Plus)],
                ['/', createOperatorFn(o.BinaryOperator.Divide)],
                ['*', createOperatorFn(o.BinaryOperator.Multiply)],
                ['%', createOperatorFn(o.BinaryOperator.Modulo)],
                ['&&', createOperatorFn(o.BinaryOperator.And)],
                ['||', createOperatorFn(o.BinaryOperator.Or)],
                ['<', createOperatorFn(o.BinaryOperator.Lower)],
                ['<=', createOperatorFn(o.BinaryOperator.LowerEquals)],
                ['>', createOperatorFn(o.BinaryOperator.Bigger)],
                ['>=', createOperatorFn(o.BinaryOperator.BiggerEquals)]
            ])
        ],
    ]))
];
exports.codegenStmts = [
    new o.CommentStmt('This is a comment'),
    new o.ClassStmt('DynamicClass', o.importExpr(testDataIdentifier), [
        new o.ClassField('dynamicProp', o.DYNAMIC_TYPE),
        new o.ClassField('dynamicChangeable', o.DYNAMIC_TYPE),
        new o.ClassField('closure', o.FUNCTION_TYPE)
    ], [
        new o.ClassGetter('dynamicGetter', [
            new o.ReturnStatement(o.literalMap([
                ['data', o.THIS_EXPR.prop('data')],
                ['dynamicProp', o.THIS_EXPR.prop('dynamicProp')]
            ]))
        ], new o.MapType(o.DYNAMIC_TYPE))
    ], new o.ClassMethod(null, [
        new o.FnParam('dataParam', o.DYNAMIC_TYPE),
        new o.FnParam('dynamicPropParam', o.DYNAMIC_TYPE)
    ], [
        o.SUPER_EXPR.callFn([o.variable('dataParam')])
            .toStmt(),
        o.THIS_EXPR.prop('dynamicProp')
            .set(o.variable('dynamicPropParam'))
            .toStmt(),
        o.THIS_EXPR.prop('dynamicChangeable')
            .set(o.variable('dynamicPropParam'))
            .toStmt(),
        o.THIS_EXPR.prop('closure')
            .set(o.fn([new o.FnParam('param', o.DYNAMIC_TYPE)], [
            new o.ReturnStatement(o.literalMap([
                ['param', o.variable('param')],
                ['data', o.THIS_EXPR.prop('data')],
                ['dynamicProp', o.THIS_EXPR.prop('dynamicProp')]
            ]))
        ], o.DYNAMIC_TYPE))
            .toStmt(),
    ]), [
        new o.ClassMethod('dynamicMethod', [new o.FnParam('param', o.DYNAMIC_TYPE)], [
            new o.ReturnStatement(o.literalMap([
                ['param', o.variable('param')],
                ['data', o.THIS_EXPR.prop('data')],
                ['dynamicProp', o.THIS_EXPR.prop('dynamicProp')]
            ]))
        ], o.DYNAMIC_TYPE)
    ]),
    o.fn([], _getExpressionsStmts, o.DYNAMIC_TYPE).toDeclStmt('getExpressions')
];
function createOperatorFn(op) {
    return o.fn([new o.FnParam('a'), new o.FnParam('b')], [new o.ReturnStatement(new o.BinaryOperatorExpr(op, o.variable('a'), o.variable('b')))], o.DYNAMIC_TYPE);
}
var SimpleJsImportGenerator = (function () {
    function SimpleJsImportGenerator() {
    }
    SimpleJsImportGenerator.prototype.getImportPath = function (moduleUrlStr, importedUrlStr) {
        var importedAssetUrl = path_util_1.ImportGenerator.parseAssetUrl(importedUrlStr);
        if (importedAssetUrl) {
            return importedAssetUrl.packageName + "/" + importedAssetUrl.modulePath;
        }
        else {
            return importedUrlStr;
        }
    };
    return SimpleJsImportGenerator;
}());
exports.SimpleJsImportGenerator = SimpleJsImportGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2VtaXR0ZXJfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvQGFuZ3VsYXIvY29tcGlsZXIvdGVzdC9vdXRwdXQvb3V0cHV0X2VtaXR0ZXJfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsaUNBQXdDLHdDQUF3QyxDQUFDLENBQUE7QUFDakYsSUFBWSxDQUFDLFdBQU0seUNBQXlDLENBQUMsQ0FBQTtBQUM3RCwwQkFBOEIsd0NBQXdDLENBQUMsQ0FBQTtBQUN2RSxxQkFBdUIsNEJBQTRCLENBQUMsQ0FBQTtBQUNwRCxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsMEJBQXVCLG9DQUFvQyxDQUFDLENBQUE7QUFFNUQsMkJBQTRCLDZCQUE2QixDQUFDLENBQUE7QUFFMUQ7SUFFRSx1QkFBbUIsSUFBUztRQUFULFNBQUksR0FBSixJQUFJLENBQUs7UUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUFDLENBQUM7SUFDekQsa0NBQVUsR0FBVixVQUFXLENBQU0sQ0FBQyxpQkFBaUIsSUFBSSxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLG9CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxxQkFBYSxnQkFJekIsQ0FBQTtBQUVELElBQUksa0JBQWtCLEdBQUcsSUFBSSw0Q0FBeUIsQ0FBQztJQUNyRCxJQUFJLEVBQUUsZUFBZTtJQUNyQixTQUFTLEVBQUUsNkRBQTZEO0lBQ3hFLE9BQU8sRUFBRSxhQUFhO0NBQ3ZCLENBQUMsQ0FBQztBQUVILElBQUksc0JBQXNCLEdBQUcsSUFBSSw0Q0FBeUIsQ0FDdEQsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUs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