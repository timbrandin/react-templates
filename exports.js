RT = RT || {};
ReactTemplate = {};

// Build out Handlebars basic SafeString type
RT.SafeString = function(string) {
  this.string = string;
};
RT.SafeString.prototype.toString = RT.SafeString.prototype.toHTML = function() {
  return '' + this.string;
};

RT.classNames = function(obj) {
  this.obj = obj;
};
RT.classNames.prototype.toString = RT.classNames.prototype.toHTML = function() {
  return '' + new RT.SafeString(RT._classNames(this.obj));
};

RT.check = function(context, string) {
  const tests = string.split('.');
  if (!context) {
    return false;
  }
  let obj = context;
  _.each(tests, function(test) {
    if (!obj) {
      return false;
    }
    obj = obj[test];
    if (!obj || !_.has(obj, string)) {
      return false;
    }
  });
  return obj;
};

RT.string = function(context, string) {
  if (RT.check(context, string) !== false) {
    return "" + new RT.SafeString(context[string]);
  }
  return "";
}

RT.get = function(props) {
  // A component exists.
  if (window && window[props.__name]) {
    return React.createElement(window[props.__name], _.omit(props, '__name'));
  }
  // A template component exists.
  else if (Template && Template[props.__name]) {
    return React.createElement(Template[props.__name], _.omit(props, '__name'));
  }
  // A template exists.
  else if (ReactTemplate[props.__name]) {
    return React.createElement(ReactTemplate[props.__name], _.omit(props, '__name'));
  }
  return "";
}

RT.event = function(component, key, context) {
  if (component && component.events && component.events[key]) {
    return component.events[key].bind(component, context);
  }
}

RT.template = function(name) {
  if (Package['timbrandin:sideburns']) {
    Package['timbrandin:sideburns'].Template._init('template', name);
  }
}

RT.body = function(name) {
  if (Package['timbrandin:sideburns']) {
    Package['timbrandin:sideburns'].Template._init('body', name);
  }
}
