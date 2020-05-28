// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive("codeLine", function ($timeout) {
  return {
    scope: {
      f: "=",
      onCompiled: "&",
      placeholder: "@",
    },
    template: '<input class="form-control" ng-model="text" placeholder="{{ placeholder }}"/><div class="compile-error">{{ info.error }}<div>',
    link: function (scope, element, attributes) {
      scope.info = {};

      scope.$watch('text', function (code, oldCode) {
        compile();
      });

      function compile() {
        var code = scope.text;

        scope.info.error = "";

        if (!code) return;

        try {
          var f = eval("(" + code + ")");

          // success
          console.log('compiled successfully');
          scope.f = { f: f, code: code };
          $timeout(0).then(() => {
            scope.onCompiled(f);
          });
        } catch (e) {
          scope.info.error = "" + e;
          console.log('error', e, code);

          scope.f = undefined;
        }
      }
    },
  };
})

.directive("codeArea", function ($timeout) {
  return {
    scope: {
      f: "=",
      onCompiled: "&",
    },
    transclude: true,
    template: `<textarea class="form-control" placeholder="{{ placeholder }}"></textarea>
    <div class="compile-error">{{ info.error }}<div>`,
    link: function (scope, element, attributes, ctrl, transclude) {
      scope.info = {};

      var content = transclude()[0].innerText;

      var ta = element.find('textarea')[0];
      ta.value = content;

      if (attributes.init) {
        var code = document.getElementById(attributes.init);
        ta.value = code.innerText;
      }

      var codemirror = CodeMirror.fromTextArea(ta, {
        mode: 'javascript',
        lineNumbers: true,
        viewportMargin: Infinity,
      });

      codemirror.on('blur', compile);
      codemirror.on('focus', function () {
        scope.$apply(function () {
          scope.info.error = "";
        });
      });

      compile();

      function compile() {
        var code = codemirror.getValue();

        scope.info.error = "";

        if (!code) return;

        try {
          var f = eval("(" + code + ")");

          // success
          console.log('compiled successfully');
          scope.f = { f: f, code: code };
          $timeout(0).then(() => {
            scope.onCompiled(f);
          });
          scope.info.error = "compiled successfully";
        } catch (e) {
          scope.info.error = "" + e;
          console.log('error', e);

          scope.f = undefined;
        }
      }
    },
  };
});
