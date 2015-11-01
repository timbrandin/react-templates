TemplateRegex = [
  {
    // Replace the head with a reactive dochead component.
    regex: /<(head)[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, className, code) {
      let markup = code;
      DocHeadRegex.forEach(function (obj) {
        markup = markup.replace(obj.regex, obj.replace);
      });
      return markup;
    }
  },
  {
    // Replace the body template.
    regex: /<(body)[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, className, code) {
      const markup = ReactTemplate.compile(className, code || '');
      return `ReactTemplate["${className}"] = (component, context) => { return (${markup}) }; RT.body("${className}");`
    }
  },
  {
    // Replace the body template.
    regex: /<(template)\sname="([^"]+)"[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, tag, className, code) {
      const markup = ReactTemplate.compile(className, code || '');
      return `ReactTemplate["${className}"] = (component, context) => { return (${markup}) }; RT.template("${className}");`;
    }
  }
];

DocHeadRegex = [
  {
    regex: /\s*<title>([^<>]+)<\/title>/g,
    replace: `DocHead.setTitle("$1");`
  }
];
