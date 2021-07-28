'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
function pipe$1(a, ab, bc, cd, de, ef, fg, gh, hi, ij, jk, kl, lm, mn, no, op, pq, qr, rs, st) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
        case 11:
            return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
        case 12:
            return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
        case 13:
            return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));
        case 14:
            return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));
        case 15:
            return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));
        case 16:
            return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));
        case 17:
            return pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))));
        case 18:
            return qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))));
        case 19:
            return rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))));
        case 20:
            return st(rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))));
    }
    return;
}

(undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/** @internal */
var none$1 = { _tag: 'None' };
/** @internal */
var some$1 = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft$1 = function (ma) { return ma._tag === 'Left'; };
/** @internal */
var isRight$1 = function (ma) { return ma._tag === 'Right'; };
/** @internal */
var left$1 = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
var right$3 = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var singleton = function (a) { return [a]; };
/** @internal */
var isNonEmpty = function (as) { return as.length > 0; };
/** @internal */
var head = function (as) { return as[0]; };
/** @internal */
var tail = function (as) { return as.slice(1); };
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
var emptyReadonlyArray = [];

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var left = left$1;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var right$2 = right$3;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$1 = 'Either';
/**
 * @category instance operations
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return isLeft(fa) ? fa : right$2(f(fa.right));
}; };
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category instance operations
 * @since 2.6.0
 */
var chainW = function (f) { return function (ma) {
    return isLeft(ma) ? ma : f(ma.right);
}; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain$1 = chainW;
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) { return (isLeft(fa) ? left(f(fa.left)) : right$2(g(fa.right))); }; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : fa;
}; };
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isLeft = isLeft$1;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isRight = isRight$1;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW$1 = function (onLeft, onRight) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
}; };
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match$1 = matchW$1;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold$1 = match$1;

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
var none = none$1;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
var some = some$1;
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
var getRight = function (ma) { return (ma._tag === 'Left' ? none : some(ma.right)); };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) {
    return isNone(ma) ? none : f(ma.value);
}; };
/**
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getright)
 *
 * @category natural transformations
 * @since 2.0.0
 */
var fromEither = getRight;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW = function (onNone, onSome) { return function (ma) {
    return isNone(ma) ? onNone() : onSome(ma.value);
}; };
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold = match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = function (onNone) { return function (ma) { return (isNone(ma) ? onNone() : ma.value); }; };
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (a) { return (a == null ? none : some(a)); };

function right$1(F) {
    return flow(right$2, F.of);
}

/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$2 = function (a) { return function () { return Promise.resolve(a); }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI = 'Task';
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed = {
    URI: URI,
    of: of$2
};

/**
 * @category constructors
 * @since 2.0.0
 */
var right = 
/*#__PURE__*/
right$1(Pointed);
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * Note: `f` should never `throw` errors, they are not caught.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onRejected) { return function () {
    return f().then(right$3, function (reason) { return left$1(onRejected(reason)); });
}; };
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$1 = right;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var ApT = of$1(emptyReadonlyArray);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    return tail(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
            return isLeft$1(ebs)
                ? acc
                : f(i + 1, a)().then(function (eb) {
                    if (isLeft$1(eb)) {
                        return eb;
                    }
                    ebs.right.push(eb.right);
                    return ebs;
                });
        });
    }, f(0, head(as))().then(map(singleton)));
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
/**
 * @since 2.9.0
 */
var sequenceSeqArray = 
/*#__PURE__*/
traverseSeqArray(identity);

/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#flow) from `function` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var pipe = pipe$1;

/**
 * @category constructors
 * @since 2.2.7
 */
var of = function (a) { return ({ _tag: 'Of', value: a }); };
/**
 * @category constructors
 * @since 2.2.7
 */
var concat = function (left, right) { return ({
    _tag: 'Concat',
    left: left,
    right: right
}); };
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup$1() {
    return { concat: concat };
}

/**
 * @category constructors
 * @since 2.2.7
 */
var leaf = function (actual, error) { return ({ _tag: 'Leaf', actual: actual, error: error }); };
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return getSemigroup$1();
}

/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.0
 */
/**
 * @category primitives
 * @since 2.2.0
 */
var boolean$1 = {
    is: function (u) { return typeof u === 'boolean'; }
};

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
function fromRefinement$1(M) {
    return function (refinement, onError) { return ({
        decode: function (i) { return (refinement(i) ? M.of(i) : M.throwError(onError(i))); }
    }); };
}

// -------------------------------------------------------------------------------------
// Kleisli config
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var SE = 
/*#__PURE__*/
getSemigroup();
/**
 * @internal
 */
var ap = function (fab, fa) {
    return isLeft(fab)
        ? isLeft(fa)
            ? left(SE.concat(fab.left, fa.left))
            : fab
        : isLeft(fa)
            ? fa
            : right$2(fab.right(fa.right));
};
var M = {
    URI: URI$1,
    _E: undefined,
    map: function (fa, f) { return pipe(fa, map(f)); },
    ap: ap,
    of: right$2,
    chain: function (ma, f) { return pipe(ma, chain$1(f)); },
    throwError: left,
    bimap: function (fa, f, g) { return pipe(fa, bimap(f, g)); },
    mapLeft: function (fa, f) { return pipe(fa, mapLeft(f)); },
    alt: function (me, that) {
        if (isRight(me)) {
            return me;
        }
        var ea = that();
        return isLeft(ea) ? left(SE.concat(me.left, ea.left)) : ea;
    }
};
/**
 * @category DecodeError
 * @since 2.2.7
 */
var error = function (actual, message) { return of(leaf(actual, message)); };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.8
 */
var fromRefinement = function (refinement, expected) {
    return fromRefinement$1(M)(refinement, function (u) { return error(u, expected); });
};
/**
 * @category constructors
 * @since 2.2.8
 */
var fromGuard = function (guard, expected) {
    return fromRefinement(guard.is, expected);
};
/**
 * @category primitives
 * @since 2.2.7
 */
var boolean = 
/*#__PURE__*/
fromGuard(boolean$1, 'boolean');

var lib = {};

var symbols = {};

/**
 * Symbols used internally within ts-pattern to construct and discriminate
 * Guard, Not, and Select, and AnonymousSelect patterns
 *
 * Symbols have the advantage of not appearing in auto-complete suggestions in
 * user defined patterns, and eliminate the admittedly unlikely risk of property
 * overlap between ts-pattern internals and user defined patterns.
 *
 * These symbols have to be visible to tsc for type inference to work, but
 * users should not import them
 * @module
 * @private
 * @internal
 */
Object.defineProperty(symbols, "__esModule", { value: true });
symbols.AnonymousSelect = symbols.NamedSelect = symbols.Not = symbols.Guard = symbols.PatternKind = void 0;
/** @internal This symbol should only be used by ts-pattern's internals. */
symbols.PatternKind = Symbol('@ts-pattern/pattern-kind');
/** @internal This symbol should only be used by ts-pattern's internals. */
symbols.Guard = Symbol('@ts-pattern/guard');
/** @internal This symbol should only be used by ts-pattern's internals. */
symbols.Not = Symbol('@ts-pattern/not');
/** @internal This symbol should only be used by ts-pattern's internals. */
symbols.NamedSelect = Symbol('@ts-pattern/named-select');
/** @internal This symbol should only be used by ts-pattern's internals. */
symbols.AnonymousSelect = Symbol('@ts-pattern/anonymous-select');

var guards = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOf = exports.select = exports.ANONYMOUS_SELECT_KEY = exports.not = exports.when = void 0;
const symbols$1 = symbols;
const when = (predicate) => ({
    [symbols$1.PatternKind]: symbols$1.Guard,
    [symbols$1.Guard]: predicate,
});
exports.when = when;
const not = (pattern) => ({
    [symbols$1.PatternKind]: symbols$1.Not,
    [symbols$1.Not]: pattern,
});
exports.not = not;
exports.ANONYMOUS_SELECT_KEY = '@ts-pattern/__anonymous-select-key';
function select(key) {
    return key === undefined
        ? {
            [symbols$1.PatternKind]: symbols$1.AnonymousSelect,
        }
        : {
            [symbols$1.PatternKind]: symbols$1.NamedSelect,
            [symbols$1.NamedSelect]: key,
        };
}
exports.select = select;
function isInstanceOf(classConstructor) {
    return (val) => val instanceof classConstructor;
}
const instanceOf = (classConstructor) => exports.when(isInstanceOf(classConstructor));
exports.instanceOf = instanceOf;
}(guards));

var wildcards = {};

Object.defineProperty(wildcards, "__esModule", { value: true });
wildcards.__ = void 0;
const guards_1 = guards;
function isUnknown(x) {
    return true;
}
function isNumber(x) {
    return typeof x === 'number' && !Number.isNaN(x);
}
function isString(x) {
    return typeof x === 'string';
}
function isBoolean(x) {
    return typeof x === 'boolean';
}
function isNullish(x) {
    return x === null || x === undefined;
}
const unknownGuard = guards_1.when(isUnknown);
const stringGuard = guards_1.when(isString);
const numberGuard = guards_1.when(isNumber);
const booleanGuard = guards_1.when(isBoolean);
const nullishGuard = guards_1.when(isNullish);
/**
 * ### Catch All wildcard
 * `__` is wildcard pattern, matching **any value**.
 *
 * `__.string` is wildcard pattern matching any **string**.
 *
 * `__.number` is wildcard pattern matching any **number**.
 *
 * `__.boolean` is wildcard pattern matching any **boolean**.
 *
 * `__.nullish` is wildcard pattern matching **null** or **undefined**.
 * @example
 *  match(value)
 *   .with(__, () => 'will always match')
 *   .with(__.string, () => 'will match on strings only')
 *   .with(__.number, () => 'will match on numbers only')
 *   .with(__.boolean, () => 'will match on booleans only')
 *   .with(__.nullish, () => 'will match on null or undefined only')
 */
wildcards.__ = Object.assign(unknownGuard, {
    string: stringGuard,
    number: numberGuard,
    boolean: booleanGuard,
    nullish: nullishGuard,
});

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatching = exports.match = exports.instanceOf = exports.select = exports.not = exports.when = exports.__ = void 0;
const symbols$1 = symbols;
const guards_1 = guards;
Object.defineProperty(exports, "when", { enumerable: true, get: function () { return guards_1.when; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return guards_1.not; } });
Object.defineProperty(exports, "select", { enumerable: true, get: function () { return guards_1.select; } });
Object.defineProperty(exports, "instanceOf", { enumerable: true, get: function () { return guards_1.instanceOf; } });
const wildcards_1 = wildcards;
Object.defineProperty(exports, "__", { enumerable: true, get: function () { return wildcards_1.__; } });
/**
 * #### match
 *
 * Entry point to create a pattern matching expression.
 *
 * It returns a `Match` builder, on which you can chain
 * several `.with(pattern, handler)` clauses.
 */
const match = (value) => builder(value, []);
exports.match = match;
/**
 * ### builder
 * This is the implementation of our pattern matching, using the
 * builder pattern.
 */
const builder = (value, cases) => {
    const run = () => {
        const entry = cases.find(({ test }) => test(value));
        if (!entry) {
            let displayedValue;
            try {
                displayedValue = JSON.stringify(value);
            }
            catch (e) {
                displayedValue = value;
            }
            throw new Error(`Pattern matching error: no pattern matches value ${displayedValue}`);
        }
        return entry.handler(entry.select(value), value);
    };
    return {
        with(...args) {
            const handler = args[args.length - 1];
            const patterns = [];
            const predicates = [];
            for (let i = 0; i < args.length - 1; i++) {
                const arg = args[i];
                if (typeof arg === 'function') {
                    predicates.push(arg);
                }
                else {
                    patterns.push(arg);
                }
            }
            let selected = {};
            const doesMatch = (value) => Boolean(patterns.some((pattern) => matchPattern(pattern, value, (key, value) => {
                selected[key] = value;
            })) && predicates.every((predicate) => predicate(value)));
            return builder(value, cases.concat([
                {
                    test: doesMatch,
                    handler,
                    select: (value) => Object.keys(selected).length
                        ? selected[guards_1.ANONYMOUS_SELECT_KEY] !== undefined
                            ? selected[guards_1.ANONYMOUS_SELECT_KEY]
                            : selected
                        : value,
                },
            ]));
        },
        when: (predicate, handler) => builder(value, cases.concat([
            {
                test: predicate,
                handler,
                select: (value) => value,
            },
        ])),
        otherwise: (handler) => builder(value, cases.concat([
            {
                test: () => true,
                handler,
                select: (value) => value,
            },
        ])).run(),
        exhaustive: () => run(),
        run,
    };
};
const isObject = (value) => Boolean(value && typeof value === 'object');
const isGuardPattern = (x) => {
    const pattern = x;
    return pattern && pattern[symbols$1.PatternKind] === symbols$1.Guard;
};
const isNotPattern = (x) => {
    const pattern = x;
    return pattern && pattern[symbols$1.PatternKind] === symbols$1.Not;
};
const isNamedSelectPattern = (x) => {
    const pattern = x;
    return pattern && pattern[symbols$1.PatternKind] === symbols$1.NamedSelect;
};
const isAnonymousSelectPattern = (x) => {
    const pattern = x;
    return pattern && pattern[symbols$1.PatternKind] === symbols$1.AnonymousSelect;
};
// tells us if the value matches a given pattern.
const matchPattern = (pattern, value, select) => {
    if (isObject(pattern)) {
        if (isGuardPattern(pattern))
            return Boolean(pattern[symbols$1.Guard](value));
        if (isNamedSelectPattern(pattern)) {
            select(pattern[symbols$1.NamedSelect], value);
            return true;
        }
        if (isAnonymousSelectPattern(pattern)) {
            select(guards_1.ANONYMOUS_SELECT_KEY, value);
            return true;
        }
        if (isNotPattern(pattern))
            return !matchPattern(pattern[symbols$1.Not], value, select);
        if (!isObject(value))
            return false;
        if (Array.isArray(pattern)) {
            if (!Array.isArray(value))
                return false;
            // List pattern
            if (pattern.length === 1) {
                const selected = {};
                const listSelect = (key, value) => {
                    selected[key] = (selected[key] || []).concat([value]);
                };
                const doesMatch = value.every((v) => matchPattern(pattern[0], v, listSelect));
                if (doesMatch) {
                    Object.keys(selected).forEach((key) => select(key, selected[key]));
                }
                return doesMatch;
            }
            // Tuple pattern
            return pattern.length === value.length
                ? pattern.every((subPattern, i) => matchPattern(subPattern, value[i], select))
                : false;
        }
        if (pattern instanceof Map) {
            if (!(value instanceof Map))
                return false;
            return [...pattern.keys()].every((key) => matchPattern(pattern.get(key), value.get(key), select));
        }
        if (pattern instanceof Set) {
            if (!(value instanceof Set))
                return false;
            if (pattern.size === 0)
                return value.size === 0;
            if (pattern.size === 1) {
                const [subPattern] = [...pattern.values()];
                return Object.values(wildcards_1.__).includes(subPattern)
                    ? matchPattern([subPattern], [...value.values()], select)
                    : value.has(subPattern);
            }
            return [...pattern.values()].every((subPattern) => value.has(subPattern));
        }
        return Object.keys(pattern).every((k) => k in value &&
            matchPattern(
            // @ts-ignore
            pattern[k], 
            // @ts-ignore
            value[k], select));
    }
    return value === pattern;
};
function isMatching(...args) {
    if (args.length === 1) {
        const [pattern] = args;
        return (value) => matchPattern(pattern, value, () => { });
    }
    if (args.length === 2) {
        const [pattern, value] = args;
        return matchPattern(pattern, value, () => { });
    }
    throw new Error(`isMatching wasn't given enough arguments: expected 1 or 2, received ${args.length}.`);
}
exports.isMatching = isMatching;
}(lib));

/*
 * Types
 */
var ExtensionConfigKeys;
(function (ExtensionConfigKeys) {
    ExtensionConfigKeys["FormatOnSave"] = "hansjhoffman.elixir.config.formatOnSave";
    ExtensionConfigKeys["FormatDocument"] = "hansjhoffman.elixir.commands.formatDocument";
})(ExtensionConfigKeys || (ExtensionConfigKeys = {}));
/*
 * Helpers
 */
var showNotification = function (body) {
    if (nova.inDevMode()) {
        var notification = new NotificationRequest("elixir-nova-notification");
        notification.title = nova.extension.name;
        notification.body = body;
        nova.notifications.add(notification);
    }
};
var safeFormat = function (editor, formatterPath) {
    return tryCatch(function () {
        return new Promise(function (resolve, _reject) {
            resolve();
        });
    }, function () { return ({
        _tag: "invokeFormatterError",
        reason: nova.localize("Failed to format the document") + ".",
    }); });
};
var formatDocument = function (editor) {
    pipe$1(some("path-to-formatter"), fold(function () { return console.log(nova.localize("Skipping") + "... " + nova.localize("No formatter set") + "."); }, function (path) {
        safeFormat()().then(fold$1(function (err) {
            return lib.match(err)
                .with({ _tag: "invokeFormatterError" }, function (_a) {
                var reason = _a.reason;
                return console.error(reason);
            })
                .exhaustive();
        }, function () { return console.log(nova.localize("Formatted") + " " + editor.document.path); }));
    }));
};
var safeStart = function () {
    return sequenceSeqArray([
        tryCatch(function () {
            return new Promise(function (resolve, reject) {
                var process = new Process("chmod", {
                    args: ["755", nova.path.join(nova.extension.path, "elixir-ls/language_server.sh")],
                });
                process.onDidExit(function (status) { return (status === 0 ? resolve() : reject()); });
                process.start();
            });
        }, function () { return ({
            _tag: "makeExecutableError",
            reason: nova.localize("Failed to make file executable") + ".",
        }); }),
        tryCatch(function () {
            return new Promise(function (resolve, _reject) {
                var serverOptions = {
                    path: nova.path.join(nova.extension.path, "elixir-ls/language_server.sh"),
                    type: "stdio",
                };
                var clientOptions = {
                    syntaxes: ["elixir"],
                };
                var client = new LanguageClient("elixirLS", nova.extension.name, serverOptions, clientOptions);
                compositeDisposable.add(client.onDidStop(function (err) {
                    var message = nova.localize("Elixir Language Server stopped unexpectedly");
                    if (err) {
                        message += ":\n\n" + err.toString();
                    }
                    else {
                        message += ".";
                    }
                    message += "\n\n" + nova.localize("Please report this, along with any output in the Extension Console.");
                    nova.workspace.showActionPanel(message, { buttons: [nova.localize("Restart"), nova.localize("Ignore")] }, function (idx) {
                    });
                }));
                client.start();
                resolve();
            });
        }, function () { return ({
            _tag: "startError",
            reason: nova.localize("Failed to start language server") + ".",
        }); }),
    ]);
};
var safeShutdown = function () {
    return tryCatch(function () {
        return new Promise(function (resolve, _reject) {
            resolve();
        });
    }, function () { return ({ _tag: "shutdownError", reason: "Uh oh... Failed to deactivate plugin." }); });
};
/*
 * Main
 */
({
    workspace: {
        formatOnSave: pipe$1(fromNullable(nova.workspace.config.get(ExtensionConfigKeys.FormatOnSave)), chain(function (value) { return fromEither(boolean.decode(value)); }), getOrElseW(function () { return false; })),
    },
    global: {
        formatOnSave: pipe$1(fromNullable(nova.config.get(ExtensionConfigKeys.FormatOnSave)), chain(function (value) { return fromEither(boolean.decode(value)); }), getOrElseW(function () { return false; })),
    },
});
var compositeDisposable = new CompositeDisposable();
var activate = function () {
    console.log(nova.localize("Activating") + "...");
    showNotification(nova.localize("Starting extension") + "...");
    compositeDisposable.add(nova.workspace.onDidAddTextEditor(function (editor) {
        // add saveListener
    }));
    compositeDisposable.add(nova.commands.register(ExtensionConfigKeys.FormatDocument, formatDocument));
    safeStart()().then(fold$1(function (err) {
        return lib.match(err)
            .with({ _tag: "makeExecutableError" }, function (_a) {
            var reason = _a.reason;
            return console.error(reason);
        })
            .with({ _tag: "startError" }, function (_a) {
            var reason = _a.reason;
            return console.error(reason);
        })
            .exhaustive();
    }, function () { }));
    console.log(nova.localize("Activated") + " \uD83C\uDF89");
};
var deactivate = function () {
    console.log(nova.localize("Deactivating") + "...");
    compositeDisposable.dispose();
    safeShutdown()().then(fold$1(function (err) {
        lib.match(err)
            .with({ _tag: "shutdownError" }, function (_a) {
            var reason = _a.reason;
            return console.error(reason);
        })
            .exhaustive();
    }, function () { return console.log(nova.localize("Deactivated. Come back soon") + " :)"); }));
};

exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=main.dist.js.map
