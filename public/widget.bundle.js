/*! For license information please see widget.bundle.js.LICENSE.txt */
(() => {
  function t(e) {
    return (
      (t =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      t(e)
    );
  }
  function e() {
    'use strict';
    e = function () {
      return n;
    };
    var r,
      n = {},
      o = Object.prototype,
      i = o.hasOwnProperty,
      a =
        Object.defineProperty ||
        function (t, e, r) {
          t[e] = r.value;
        },
      c = 'function' == typeof Symbol ? Symbol : {},
      u = c.iterator || '@@iterator',
      l = c.asyncIterator || '@@asyncIterator',
      s = c.toStringTag || '@@toStringTag';
    function f(t, e, r) {
      return (
        Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        t[e]
      );
    }
    try {
      f({}, '');
    } catch (r) {
      f = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function h(t, e, r, n) {
      var o = e && e.prototype instanceof b ? e : b,
        i = Object.create(o.prototype),
        c = new N(n || []);
      return a(i, '_invoke', { value: _(t, r, c) }), i;
    }
    function p(t, e, r) {
      try {
        return { type: 'normal', arg: t.call(e, r) };
      } catch (t) {
        return { type: 'throw', arg: t };
      }
    }
    n.wrap = h;
    var d = 'suspendedStart',
      y = 'suspendedYield',
      v = 'executing',
      g = 'completed',
      m = {};
    function b() {}
    function x() {}
    function w() {}
    var E = {};
    f(E, u, function () {
      return this;
    });
    var L = Object.getPrototypeOf,
      k = L && L(L(G([])));
    k && k !== o && i.call(k, u) && (E = k);
    var O = (w.prototype = b.prototype = Object.create(E));
    function j(t) {
      ['next', 'throw', 'return'].forEach(function (e) {
        f(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function S(e, r) {
      function n(o, a, c, u) {
        var l = p(e[o], e, a);
        if ('throw' !== l.type) {
          var s = l.arg,
            f = s.value;
          return f && 'object' == t(f) && i.call(f, '__await')
            ? r.resolve(f.__await).then(
                function (t) {
                  n('next', t, c, u);
                },
                function (t) {
                  n('throw', t, c, u);
                },
              )
            : r.resolve(f).then(
                function (t) {
                  (s.value = t), c(s);
                },
                function (t) {
                  return n('throw', t, c, u);
                },
              );
        }
        u(l.arg);
      }
      var o;
      a(this, '_invoke', {
        value: function (t, e) {
          function i() {
            return new r(function (r, o) {
              n(t, e, r, o);
            });
          }
          return (o = o ? o.then(i, i) : i());
        },
      });
    }
    function _(t, e, n) {
      var o = d;
      return function (i, a) {
        if (o === v) throw Error('Generator is already running');
        if (o === g) {
          if ('throw' === i) throw a;
          return { value: r, done: !0 };
        }
        for (n.method = i, n.arg = a; ; ) {
          var c = n.delegate;
          if (c) {
            var u = C(c, n);
            if (u) {
              if (u === m) continue;
              return u;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;
          else if ('throw' === n.method) {
            if (o === d) throw ((o = g), n.arg);
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          o = v;
          var l = p(t, e, n);
          if ('normal' === l.type) {
            if (((o = n.done ? g : y), l.arg === m)) continue;
            return { value: l.arg, done: n.done };
          }
          'throw' === l.type &&
            ((o = g), (n.method = 'throw'), (n.arg = l.arg));
        }
      };
    }
    function C(t, e) {
      var n = e.method,
        o = t.iterator[n];
      if (o === r)
        return (
          (e.delegate = null),
          ('throw' === n &&
            t.iterator.return &&
            ((e.method = 'return'),
            (e.arg = r),
            C(t, e),
            'throw' === e.method)) ||
            ('return' !== n &&
              ((e.method = 'throw'),
              (e.arg = new TypeError(
                "The iterator does not provide a '" + n + "' method",
              )))),
          m
        );
      var i = p(o, t.iterator, e.arg);
      if ('throw' === i.type)
        return (e.method = 'throw'), (e.arg = i.arg), (e.delegate = null), m;
      var a = i.arg;
      return a
        ? a.done
          ? ((e[t.resultName] = a.value),
            (e.next = t.nextLoc),
            'return' !== e.method && ((e.method = 'next'), (e.arg = r)),
            (e.delegate = null),
            m)
          : a
        : ((e.method = 'throw'),
          (e.arg = new TypeError('iterator result is not an object')),
          (e.delegate = null),
          m);
    }
    function T(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]),
        2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
        this.tryEntries.push(e);
    }
    function P(t) {
      var e = t.completion || {};
      (e.type = 'normal'), delete e.arg, (t.completion = e);
    }
    function N(t) {
      (this.tryEntries = [{ tryLoc: 'root' }]),
        t.forEach(T, this),
        this.reset(!0);
    }
    function G(e) {
      if (e || '' === e) {
        var n = e[u];
        if (n) return n.call(e);
        if ('function' == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            a = function t() {
              for (; ++o < e.length; )
                if (i.call(e, o)) return (t.value = e[o]), (t.done = !1), t;
              return (t.value = r), (t.done = !0), t;
            };
          return (a.next = a);
        }
      }
      throw new TypeError(t(e) + ' is not iterable');
    }
    return (
      (x.prototype = w),
      a(O, 'constructor', { value: w, configurable: !0 }),
      a(w, 'constructor', { value: x, configurable: !0 }),
      (x.displayName = f(w, s, 'GeneratorFunction')),
      (n.isGeneratorFunction = function (t) {
        var e = 'function' == typeof t && t.constructor;
        return (
          !!e && (e === x || 'GeneratorFunction' === (e.displayName || e.name))
        );
      }),
      (n.mark = function (t) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(t, w)
            : ((t.__proto__ = w), f(t, s, 'GeneratorFunction')),
          (t.prototype = Object.create(O)),
          t
        );
      }),
      (n.awrap = function (t) {
        return { __await: t };
      }),
      j(S.prototype),
      f(S.prototype, l, function () {
        return this;
      }),
      (n.AsyncIterator = S),
      (n.async = function (t, e, r, o, i) {
        void 0 === i && (i = Promise);
        var a = new S(h(t, e, r, o), i);
        return n.isGeneratorFunction(e)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      j(O),
      f(O, s, 'Generator'),
      f(O, u, function () {
        return this;
      }),
      f(O, 'toString', function () {
        return '[object Generator]';
      }),
      (n.keys = function (t) {
        var e = Object(t),
          r = [];
        for (var n in e) r.push(n);
        return (
          r.reverse(),
          function t() {
            for (; r.length; ) {
              var n = r.pop();
              if (n in e) return (t.value = n), (t.done = !1), t;
            }
            return (t.done = !0), t;
          }
        );
      }),
      (n.values = G),
      (N.prototype = {
        constructor: N,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = r),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = r),
            this.tryEntries.forEach(P),
            !t)
          )
            for (var e in this)
              't' === e.charAt(0) &&
                i.call(this, e) &&
                !isNaN(+e.slice(1)) &&
                (this[e] = r);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ('throw' === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function n(n, o) {
            return (
              (c.type = 'throw'),
              (c.arg = t),
              (e.next = n),
              o && ((e.method = 'next'), (e.arg = r)),
              !!o
            );
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var a = this.tryEntries[o],
              c = a.completion;
            if ('root' === a.tryLoc) return n('end');
            if (a.tryLoc <= this.prev) {
              var u = i.call(a, 'catchLoc'),
                l = i.call(a, 'finallyLoc');
              if (u && l) {
                if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return n(a.finallyLoc);
              } else if (u) {
                if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
              } else {
                if (!l) throw Error('try statement without catch or finally');
                if (this.prev < a.finallyLoc) return n(a.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var n = this.tryEntries[r];
            if (
              n.tryLoc <= this.prev &&
              i.call(n, 'finallyLoc') &&
              this.prev < n.finallyLoc
            ) {
              var o = n;
              break;
            }
          }
          o &&
            ('break' === t || 'continue' === t) &&
            o.tryLoc <= e &&
            e <= o.finallyLoc &&
            (o = null);
          var a = o ? o.completion : {};
          return (
            (a.type = t),
            (a.arg = e),
            o
              ? ((this.method = 'next'), (this.next = o.finallyLoc), m)
              : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ('throw' === t.type) throw t.arg;
          return (
            'break' === t.type || 'continue' === t.type
              ? (this.next = t.arg)
              : 'return' === t.type
              ? ((this.rval = this.arg = t.arg),
                (this.method = 'return'),
                (this.next = 'end'))
              : 'normal' === t.type && e && (this.next = e),
            m
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t)
              return this.complete(r.completion, r.afterLoc), P(r), m;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ('throw' === n.type) {
                var o = n.arg;
                P(r);
              }
              return o;
            }
          }
          throw Error('illegal catch attempt');
        },
        delegateYield: function (t, e, n) {
          return (
            (this.delegate = { iterator: G(t), resultName: e, nextLoc: n }),
            'next' === this.method && (this.arg = r),
            m
          );
        },
      }),
      n
    );
  }
  function r(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  function n(t) {
    return function () {
      var e = this,
        n = arguments;
      return new Promise(function (o, i) {
        var a = t.apply(e, n);
        function c(t) {
          r(a, o, i, c, u, 'next', t);
        }
        function u(t) {
          r(a, o, i, c, u, 'throw', t);
        }
        c(void 0);
      });
    };
  }
  window.initChatWidget = function (t) {
    var r = document.createElement('div');
    (r.style.position = 'fixed'),
      (r.style.bottom = '0'),
      (r.style.right = '0'),
      (r.style.width = '300px'),
      (r.style.height = '400px'),
      (r.style.border = '1px solid #ccc'),
      (r.style.borderRadius = '10px 10px 0 0'),
      (r.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'),
      (r.style.backgroundColor = '#fff'),
      (r.style.display = 'flex'),
      (r.style.flexDirection = 'column'),
      (r.style.overflow = 'hidden'),
      (r.innerHTML =
        '\n      <div id="chat-header" style="background-color: #007bff; color: white; padding: 10px; text-align: center; font-weight: bold;">Chat</div>\n      <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto; border-top: 1px solid #ccc;"></div>\n      <div style="display: flex; border-top: 1px solid #ccc;">\n        <input id="chat-input" type="text" style="flex: 1; padding: 10px; border: none; border-top-left-radius: 0; border-top-right-radius: 0;">\n        <button id="chat-send" style="padding: 10px; background-color: #007bff; color: white; border: none; cursor: pointer;">Send</button>\n      </div>\n    '),
      document.body.appendChild(r);
    var o = document.getElementById('chat-input'),
      i = document.getElementById('chat-send'),
      a = document.getElementById('chat-messages');
    i.onclick = n(
      e().mark(function r() {
        var n, i, c, u, l;
        return e().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (!o.value) {
                    e.next = 31;
                    break;
                  }
                  return (
                    (n = o.value),
                    ((i = document.createElement('div')).textContent = n),
                    (i.style.padding = '5px'),
                    (i.style.margin = '5px 0'),
                    (i.style.backgroundColor = '#f1f1f1'),
                    (i.style.borderRadius = '5px'),
                    a.appendChild(i),
                    (o.value = ''),
                    (a.scrollTop = a.scrollHeight),
                    (e.prev = 11),
                    (e.next = 14),
                    fetch('https://budachat.com/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        businessId: t,
                        messages: [{ role: 'user', content: n }],
                      }),
                    })
                  );
                case 14:
                  return (c = e.sent), (e.next = 17), c.json();
                case 17:
                  (u = e.sent),
                    ((l = document.createElement('div')).textContent = u.reply),
                    (l.style.padding = '5px'),
                    (l.style.margin = '5px 0'),
                    (l.style.backgroundColor = '#e1f5fe'),
                    (l.style.borderRadius = '5px'),
                    a.appendChild(l),
                    (a.scrollTop = a.scrollHeight),
                    (e.next = 31);
                  break;
                case 28:
                  (e.prev = 28),
                    (e.t0 = e.catch(11)),
                    console.error('Error:', e.t0);
                case 31:
                case 'end':
                  return e.stop();
              }
          },
          r,
          null,
          [[11, 28]],
        );
      }),
    );
  };
})();
