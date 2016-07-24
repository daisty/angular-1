/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var lexer_1 = require('@angular/compiler/src/expression_parser/lexer');
function lex(text) {
    return new lexer_1.Lexer().tokenize(text);
}
function expectToken(token, index) {
    expect(token instanceof lexer_1.Token).toBe(true);
    expect(token.index).toEqual(index);
}
function expectCharacterToken(token, index, character) {
    expect(character.length).toBe(1);
    expectToken(token, index);
    expect(token.isCharacter(character.charCodeAt(0))).toBe(true);
}
function expectOperatorToken(token, index, operator) {
    expectToken(token, index);
    expect(token.isOperator(operator)).toBe(true);
}
function expectNumberToken(token, index, n) {
    expectToken(token, index);
    expect(token.isNumber()).toBe(true);
    expect(token.toNumber()).toEqual(n);
}
function expectStringToken(token, index, str) {
    expectToken(token, index);
    expect(token.isString()).toBe(true);
    expect(token.toString()).toEqual(str);
}
function expectIdentifierToken(token, index, identifier) {
    expectToken(token, index);
    expect(token.isIdentifier()).toBe(true);
    expect(token.toString()).toEqual(identifier);
}
function expectKeywordToken(token, index, keyword) {
    expectToken(token, index);
    expect(token.isKeyword()).toBe(true);
    expect(token.toString()).toEqual(keyword);
}
function expectErrorToken(token, index, message) {
    expectToken(token, index);
    expect(token.isError()).toBe(true);
    expect(token.toString()).toEqual(message);
}
function main() {
    describe('lexer', function () {
        describe('token', function () {
            it('should tokenize a simple identifier', function () {
                var tokens = lex('j');
                expect(tokens.length).toEqual(1);
                expectIdentifierToken(tokens[0], 0, 'j');
            });
            it('should tokenize a dotted identifier', function () {
                var tokens = lex('j.k');
                expect(tokens.length).toEqual(3);
                expectIdentifierToken(tokens[0], 0, 'j');
                expectCharacterToken(tokens[1], 1, '.');
                expectIdentifierToken(tokens[2], 2, 'k');
            });
            it('should tokenize an operator', function () {
                var tokens = lex('j-k');
                expect(tokens.length).toEqual(3);
                expectOperatorToken(tokens[1], 1, '-');
            });
            it('should tokenize an indexed operator', function () {
                var tokens = lex('j[k]');
                expect(tokens.length).toEqual(4);
                expectCharacterToken(tokens[1], 1, '[');
                expectCharacterToken(tokens[3], 3, ']');
            });
            it('should tokenize numbers', function () {
                var tokens = lex('88');
                expect(tokens.length).toEqual(1);
                expectNumberToken(tokens[0], 0, 88);
            });
            it('should tokenize numbers within index ops', function () { expectNumberToken(lex('a[22]')[2], 2, 22); });
            it('should tokenize simple quoted strings', function () { expectStringToken(lex('"a"')[0], 0, 'a'); });
            it('should tokenize quoted strings with escaped quotes', function () { expectStringToken(lex('"a\\""')[0], 0, 'a"'); });
            it('should tokenize a string', function () {
                var tokens = lex('j-a.bc[22]+1.3|f:\'a\\\'c\':"d\\"e"');
                expectIdentifierToken(tokens[0], 0, 'j');
                expectOperatorToken(tokens[1], 1, '-');
                expectIdentifierToken(tokens[2], 2, 'a');
                expectCharacterToken(tokens[3], 3, '.');
                expectIdentifierToken(tokens[4], 4, 'bc');
                expectCharacterToken(tokens[5], 6, '[');
                expectNumberToken(tokens[6], 7, 22);
                expectCharacterToken(tokens[7], 9, ']');
                expectOperatorToken(tokens[8], 10, '+');
                expectNumberToken(tokens[9], 11, 1.3);
                expectOperatorToken(tokens[10], 14, '|');
                expectIdentifierToken(tokens[11], 15, 'f');
                expectCharacterToken(tokens[12], 16, ':');
                expectStringToken(tokens[13], 17, 'a\'c');
                expectCharacterToken(tokens[14], 23, ':');
                expectStringToken(tokens[15], 24, 'd"e');
            });
            it('should tokenize undefined', function () {
                var tokens = lex('undefined');
                expectKeywordToken(tokens[0], 0, 'undefined');
                expect(tokens[0].isKeywordUndefined()).toBe(true);
            });
            it('should ignore whitespace', function () {
                var tokens = lex('a \t \n \r b');
                expectIdentifierToken(tokens[0], 0, 'a');
                expectIdentifierToken(tokens[1], 8, 'b');
            });
            it('should tokenize quoted string', function () {
                var str = '[\'\\\'\', "\\""]';
                var tokens = lex(str);
                expectStringToken(tokens[1], 1, '\'');
                expectStringToken(tokens[3], 7, '"');
            });
            it('should tokenize escaped quoted string', function () {
                var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
                var tokens = lex(str);
                expect(tokens.length).toEqual(1);
                expect(tokens[0].toString()).toEqual('"\n\f\r\t\v\u00A0');
            });
            it('should tokenize unicode', function () {
                var tokens = lex('"\\u00A0"');
                expect(tokens.length).toEqual(1);
                expect(tokens[0].toString()).toEqual('\u00a0');
            });
            it('should tokenize relation', function () {
                var tokens = lex('! == != < > <= >= === !==');
                expectOperatorToken(tokens[0], 0, '!');
                expectOperatorToken(tokens[1], 2, '==');
                expectOperatorToken(tokens[2], 5, '!=');
                expectOperatorToken(tokens[3], 8, '<');
                expectOperatorToken(tokens[4], 10, '>');
                expectOperatorToken(tokens[5], 12, '<=');
                expectOperatorToken(tokens[6], 15, '>=');
                expectOperatorToken(tokens[7], 18, '===');
                expectOperatorToken(tokens[8], 22, '!==');
            });
            it('should tokenize statements', function () {
                var tokens = lex('a;b;');
                expectIdentifierToken(tokens[0], 0, 'a');
                expectCharacterToken(tokens[1], 1, ';');
                expectIdentifierToken(tokens[2], 2, 'b');
                expectCharacterToken(tokens[3], 3, ';');
            });
            it('should tokenize function invocation', function () {
                var tokens = lex('a()');
                expectIdentifierToken(tokens[0], 0, 'a');
                expectCharacterToken(tokens[1], 1, '(');
                expectCharacterToken(tokens[2], 2, ')');
            });
            it('should tokenize simple method invocations', function () {
                var tokens = lex('a.method()');
                expectIdentifierToken(tokens[2], 2, 'method');
            });
            it('should tokenize method invocation', function () {
                var tokens = lex('a.b.c (d) - e.f()');
                expectIdentifierToken(tokens[0], 0, 'a');
                expectCharacterToken(tokens[1], 1, '.');
                expectIdentifierToken(tokens[2], 2, 'b');
                expectCharacterToken(tokens[3], 3, '.');
                expectIdentifierToken(tokens[4], 4, 'c');
                expectCharacterToken(tokens[5], 6, '(');
                expectIdentifierToken(tokens[6], 7, 'd');
                expectCharacterToken(tokens[7], 8, ')');
                expectOperatorToken(tokens[8], 10, '-');
                expectIdentifierToken(tokens[9], 12, 'e');
                expectCharacterToken(tokens[10], 13, '.');
                expectIdentifierToken(tokens[11], 14, 'f');
                expectCharacterToken(tokens[12], 15, '(');
                expectCharacterToken(tokens[13], 16, ')');
            });
            it('should tokenize number', function () { expectNumberToken(lex('0.5')[0], 0, 0.5); });
            it('should tokenize number with exponent', function () {
                var tokens = lex('0.5E-10');
                expect(tokens.length).toEqual(1);
                expectNumberToken(tokens[0], 0, 0.5E-10);
                tokens = lex('0.5E+10');
                expectNumberToken(tokens[0], 0, 0.5E+10);
            });
            it('should return exception for invalid exponent', function () {
                expectErrorToken(lex('0.5E-')[0], 4, 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-]');
                expectErrorToken(lex('0.5E-A')[0], 4, 'Lexer Error: Invalid exponent at column 4 in expression [0.5E-A]');
            });
            it('should tokenize number starting with a dot', function () { expectNumberToken(lex('.5')[0], 0, 0.5); });
            it('should throw error on invalid unicode', function () {
                expectErrorToken(lex('\'\\u1\'\'bla\'')[0], 2, 'Lexer Error: Invalid unicode escape [\\u1\'\'b] at column 2 in expression [\'\\u1\'\'bla\']');
            });
            it('should tokenize hash as operator', function () { expectOperatorToken(lex('#')[0], 0, '#'); });
            it('should tokenize ?. as operator', function () { expectOperatorToken(lex('?.')[0], 0, '?.'); });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvQGFuZ3VsYXIvY29tcGlsZXIvdGVzdC9leHByZXNzaW9uX3BhcnNlci9sZXhlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQkFBMkIsK0NBQStDLENBQUMsQ0FBQTtBQUUzRSxhQUFhLElBQVk7SUFDdkIsTUFBTSxDQUFDLElBQUksYUFBSyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxxQkFBcUIsS0FBVSxFQUFFLEtBQWE7SUFDNUMsTUFBTSxDQUFDLEtBQUssWUFBWSxhQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVELDhCQUE4QixLQUFVLEVBQUUsS0FBYSxFQUFFLFNBQWlCO0lBQ3hFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRCw2QkFBNkIsS0FBVSxFQUFFLEtBQWEsRUFBRSxRQUFnQjtJQUN0RSxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hE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LEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFLGNBQVEsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtnQkFDekMsSUFBSSxNQUFNLEdBQVksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtnQkFDakQsZ0JBQWdCLENBQ1osR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxpRUFBaUUsQ0FBQyxDQUFDO2dCQUUzRixnQkFBZ0IsQ0FDWixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNuQixrRUFBa0UsQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUM1QyxjQUFRLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7Z0JBQzFDLGdCQUFnQixDQUNaLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDNUIsNkZBQTZGLENBQUMsQ0FBQztZQUNyRyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxjQUFRLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1RixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsY0FBUSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFyTGUsWUFBSSxPQXFMbkIsQ0FBQSJ9