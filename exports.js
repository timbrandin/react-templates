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
  if (RT.check(context, string)) {
    return "" + new RT.SafeString(context.counter);
  }
  return "";
}

RT.get = function(props) {
  // A component exists for the template.
  if (window[props.template]) {
    return React.createElement(window[props.template], _.omit(props, 'template'));
  }
  // A template exists.
  else if (ReactTemplate[props.template]) {
    return React.createElement(ReactTemplate[props.template], _.omit(props, 'template'));
  }
  return "";
}
