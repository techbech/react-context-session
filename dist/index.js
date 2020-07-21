function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var cloneDeep = _interopDefault(require('lodash.clonedeep'));

var Dispatcher = /*#__PURE__*/function () {
  function Dispatcher() {
    this.dispatchers = {};
  }

  var _proto = Dispatcher.prototype;

  _proto.dispatch = function dispatch(key, value) {
    if (typeof this.dispatchers[key] === "undefined") {
      return;
    }

    for (var i = 0; i < this.dispatchers[key].length; i++) {
      this.dispatchers[key][i](value);
    }
  };

  _proto.register = function register(key, dispatchFunc) {
    if (typeof this.dispatchers[key] === "undefined") {
      this.dispatchers[key] = [dispatchFunc];
    } else {
      this.dispatchers[key].push(dispatchFunc);
    }
  };

  _proto.unregister = function unregister(key, dispatchFunc) {
    if (typeof this.dispatchers[key] === "undefined") {
      return;
    }

    for (var j = 0; j < this.dispatchers[key].length; j++) {
      if (this.dispatchers[key][j] === dispatchFunc) {
        this.dispatchers[key].splice(j, 1);
      }
    }
  };

  return Dispatcher;
}();

var ReactSessionContext = React.createContext("default");
var sessionContexts = {};
function useSessionContext() {
  return sessionContexts[React.useContext(ReactSessionContext)];
}
function getSessionContexts() {
  var data = {};

  for (var i in sessionContexts) {
    data[i] = cloneDeep(sessionContexts);
  }

  return data;
}
function hasSessionContext(contextKey) {
  return !!sessionContexts[contextKey];
}

function initializeSession(contextKey, data, onChange) {
  if (!hasSessionContext(contextKey)) {
    sessionContexts[contextKey] = {
      data: cloneDeep(data),
      dispatcher: new Dispatcher(),
      onChange: onChange
    };
  }
}

function clearSessionContext(contextKey) {
  delete sessionContexts[contextKey];
}

function getUniqueContextName() {
  return "default-" + Date.now() + "-" + Math.floor(Math.random() * 999999);
}

function ProvideSession(_ref) {
  var children = _ref.children,
      name = _ref.name,
      data = _ref.data,
      onChange = _ref.onChange,
      keepOnUnmount = _ref.keepOnUnmount;

  var _useState = React.useState(name || getUniqueContextName),
      contextKey = _useState[0];

  initializeSession(contextKey, data, onChange);
  React.useEffect(function () {
    return function () {
      if (!keepOnUnmount) {
        clearSessionContext(contextKey);
      }
    };
  });
  return React__default.createElement(ReactSessionContext.Provider, {
    value: contextKey
  }, children);
}

function useSession() {
  return useSessionBase;
}
function useSessionBase(dependencies) {
  var context = useSessionContext();

  if (typeof context === "undefined") {
    throw new Error("\"useSession\" is called outside a session context. Make sure to wrap your component with a \"<ProvideSession data={...} />\"");
  }

  var k = dependencies || [];
  var states = {};

  for (var i = 0; i < k.length; i++) {
    states[k[i]] = React.useState(context.data[k[i]]);
  }

  React.useEffect(function () {
    for (var _i = 0; _i < k.length; _i++) {
      context.dispatcher.register(k[_i], states[k[_i]][1]);
    }

    return function () {
      for (var _i2 = 0; _i2 < k.length; _i2++) {
        context.dispatcher.unregister(k[_i2], states[k[_i2]][1]);
      }
    };
  }, []);
  var set = React.useCallback(function (key, value) {
    context.data[key] = value;

    if (context.onChange) {
      context.onChange(context.data);
    }

    context.dispatcher.dispatch(key, value);
  }, []);
  var output = {};

  for (var _i3 = 0; _i3 < k.length; _i3++) {
    output[k[_i3]] = states[k[_i3]][0];
  }

  return [output, set];
}

exports.ProvideSession = ProvideSession;
exports.getSessionContexts = getSessionContexts;
exports.hasSessionContext = hasSessionContext;
exports.useSession = useSession;
//# sourceMappingURL=index.js.map
