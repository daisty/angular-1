/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var create_url_tree_1 = require('../src/create_url_tree');
var router_state_1 = require('../src/router_state');
var shared_1 = require('../src/shared');
var url_tree_1 = require('../src/url_tree');
describe('createUrlTree', function () {
    var serializer = new url_tree_1.DefaultUrlSerializer();
    it('should navigate to the root', function () {
        var p = serializer.parse('/');
        var t = createRoot(p, ['/']);
        expect(serializer.serialize(t)).toEqual('/');
    });
    it('should error when navigating to the root segment with params', function () {
        var p = serializer.parse('/');
        expect(function () { return createRoot(p, ['/', { p: 11 }]); })
            .toThrowError(/Root segment cannot have matrix parameters/);
    });
    it('should support nested segments', function () {
        var p = serializer.parse('/a/b');
        var t = createRoot(p, ['/one', 11, 'two', 22]);
        expect(serializer.serialize(t)).toEqual('/one/11/two/22');
    });
    it('should stringify positional parameters', function () {
        var p = serializer.parse('/a/b');
        var t = createRoot(p, ['/one', 11]);
        var params = t.root.children[shared_1.PRIMARY_OUTLET].pathsWithParams;
        expect(params[0].path).toEqual('one');
        expect(params[1].path).toEqual('11');
    });
    it('should preserve secondary segments', function () {
        var p = serializer.parse('/a/11/b(right:c)');
        var t = createRoot(p, ['/a', 11, 'd']);
        expect(serializer.serialize(t)).toEqual('/a/11/d(right:c)');
    });
    it('should support updating secondary segments', function () {
        var p = serializer.parse('/a(right:b)');
        var t = createRoot(p, [{ outlets: { right: ['c', 11, 'd'] } }]);
        expect(serializer.serialize(t)).toEqual('/a(right:c/11/d)');
    });
    it('should support updating secondary segments (nested case)', function () {
        var p = serializer.parse('/a/(b//right:c)');
        var t = createRoot(p, ['a', { outlets: { right: ['d', 11, 'e'] } }]);
        expect(serializer.serialize(t)).toEqual('/a/(b//right:d/11/e)');
    });
    it('should support updating using a string', function () {
        var p = serializer.parse('/a(right:b)');
        var t = createRoot(p, [{ outlets: { right: 'c/11/d' } }]);
        expect(serializer.serialize(t)).toEqual('/a(right:c/11/d)');
    });
    it('should support updating primary and secondary segments at once', function () {
        var p = serializer.parse('/a(right:b)');
        var t = createRoot(p, [{ outlets: { primary: 'y/z', right: 'c/11/d' } }]);
        expect(serializer.serialize(t)).toEqual('/y/z(right:c/11/d)');
    });
    it('should support removing primary segment', function () {
        var p = serializer.parse('/a/(b//right:c)');
        var t = createRoot(p, ['a', { outlets: { primary: null, right: 'd' } }]);
        expect(serializer.serialize(t)).toEqual('/a/(right:d)');
    });
    it('should support removing secondary segments', function () {
        var p = serializer.parse('/a(right:b)');
        var t = createRoot(p, [{ outlets: { right: null } }]);
        expect(serializer.serialize(t)).toEqual('/a');
    });
    it('should update matrix parameters', function () {
        var p = serializer.parse('/a;pp=11');
        var t = createRoot(p, ['/a', { pp: 22, dd: 33 }]);
        expect(serializer.serialize(t)).toEqual('/a;pp=22;dd=33');
    });
    it('should create matrix parameters', function () {
        var p = serializer.parse('/a');
        var t = createRoot(p, ['/a', { pp: 22, dd: 33 }]);
        expect(serializer.serialize(t)).toEqual('/a;pp=22;dd=33');
    });
    it('should create matrix parameters together with other segments', function () {
        var p = serializer.parse('/a');
        var t = createRoot(p, ['/a', '/b', { aa: 22, bb: 33 }]);
        expect(serializer.serialize(t)).toEqual('/a/b;aa=22;bb=33');
    });
    describe('relative navigation', function () {
        it('should work', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['c2']);
            expect(serializer.serialize(t)).toEqual('/a/(c2//left:cp)(left:ap)');
        });
        it('should work when the first command starts with a ./', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['./c2']);
            expect(serializer.serialize(t)).toEqual('/a/(c2//left:cp)(left:ap)');
        });
        it('should work when the first command is ./)', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['./', 'c2']);
            expect(serializer.serialize(t)).toEqual('/a/(c2//left:cp)(left:ap)');
        });
        it('should work when given params', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, [{ 'x': 99 }]);
            expect(serializer.serialize(t)).toEqual('/a/(c;x=99//left:cp)(left:ap)');
        });
        it('should work when index > 0', function () {
            var p = serializer.parse('/a/c');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ['c2']);
            expect(serializer.serialize(t)).toEqual('/a/c/c2');
        });
        it('should support going to a parent (within a segment)', function () {
            var p = serializer.parse('/a/c');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ['../c2']);
            expect(serializer.serialize(t)).toEqual('/a/c2');
        });
        it('should support setting matrix params', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../', { x: 5 }]);
            expect(serializer.serialize(t)).toEqual('/a;x=5(left:ap)');
        });
        xit('should support going to a parent (across segments)', function () {
            var p = serializer.parse('/q/(a/(c//left:cp)//left:qp)(left:ap)');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET].children[shared_1.PRIMARY_OUTLET], 0, p, ['../../q2']);
            expect(serializer.serialize(t)).toEqual('/q2(left:ap)');
        });
        it('should navigate to the root', function () {
            var p = serializer.parse('/a/c');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../']);
            expect(serializer.serialize(t)).toEqual('/');
        });
        it('should work with ../ when absolute url', function () {
            var p = serializer.parse('/a/c');
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ['../', 'c2']);
            expect(serializer.serialize(t)).toEqual('/a/c2');
        });
        it('should work with position = -1', function () {
            var p = serializer.parse('/');
            var t = create(p.root, -1, p, ['11']);
            expect(serializer.serialize(t)).toEqual('/11');
        });
        it('should throw when too many ..', function () {
            var p = serializer.parse('/a/(c//left:cp)(left:ap)');
            expect(function () { return create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../../']); })
                .toThrowError('Invalid number of \'../\'');
        });
    });
    it('should set query params', function () {
        var p = serializer.parse('/');
        var t = createRoot(p, [], { a: 'hey' });
        expect(t.queryParams).toEqual({ a: 'hey' });
    });
    it('should stringify query params', function () {
        var p = serializer.parse('/');
        var t = createRoot(p, [], { a: 1 });
        expect(t.queryParams).toEqual({ a: '1' });
    });
    it('should set fragment', function () {
        var p = serializer.parse('/');
        var t = createRoot(p, [], {}, 'fragment');
        expect(t.fragment).toEqual('fragment');
    });
});
function createRoot(tree, commands, queryParams, fragment) {
    var s = new router_state_1.ActivatedRouteSnapshot([], {}, {}, shared_1.PRIMARY_OUTLET, 'someComponent', null, tree.root, -1, null);
    var a = new router_state_1.ActivatedRoute(new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), shared_1.PRIMARY_OUTLET, 'someComponent', s);
    router_state_1.advanceActivatedRoute(a);
    return create_url_tree_1.createUrlTree(a, tree, commands, queryParams, fragment);
}
function create(segment, startIndex, tree, commands, queryParams, fragment) {
    if (!segment) {
        expect(segment).toBeDefined();
    }
    var s = new router_state_1.ActivatedRouteSnapshot([], {}, {}, shared_1.PRIMARY_OUTLET, 'someComponent', null, segment, startIndex, null);
    var a = new router_state_1.ActivatedRoute(new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), shared_1.PRIMARY_OUTLET, 'someComponent', s);
    router_state_1.advanceActivatedRoute(a);
    return create_url_tree_1.createUrlTree(a, tree, commands, queryParams, fragment);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3VybF90cmVlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL0Bhbmd1bGFyL3JvdXRlci90ZXN0L2NyZWF0ZV91cmxfdHJlZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnQ0FBOEIsc0JBQXNCLENBQUMsQ0FBQTtBQUVyRCxnQ0FBNEIsd0JBQXdCLENBQUMsQ0FBQTtBQUNyRCw2QkFBNEUscUJBQXFCLENBQUMsQ0FBQTtBQUNsRyx1QkFBcUMsZUFBZSxDQUFDLENBQUE7QUFDckQseUJBQTJFLGlCQUFpQixDQUFDLENBQUE7QUFFN0YsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixJQUFNLFVBQVUsR0FBRyxJQUFJLCtCQUFvQixFQUFFLENBQUM7SUFFOUMsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQ2hDLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7UUFDakUsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsY0FBTSxPQUFBLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUFDO2FBQ3RDLFlBQVksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxDQUFD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QUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7UUFDcEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2QyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7UUFDcEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7UUFDakUsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFF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