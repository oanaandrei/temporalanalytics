// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive('dSet', function () {
  return {
    scope: {
      input: "=",
      output: "=",
    },
    controller: function ($scope) {
      var transforms = [];

      $scope.$watch('input', watch);

      function watch() {
        if (!$scope.input) {
          return;
        }

        var output = $scope.input.slice();
        try {
          transforms.forEach(f => {
            output = f(output);
          });
        } catch (e) {
          console.log('error running transforms', e);
        }

        $scope.output = output;
      }

      this.addTransform = function (f) {
        transforms.push(f);
        watch();

        return transforms.length - 1;
      };

      this.updateTransform = function (f, i) {
        if (i < transforms.length)
          transforms[i] = f;
        watch();
      };

      // wont work since it would destroy the indices returned from add
      // this.removeTransform = function (f) {
      //   var i = transforms.indexOf(f);
      //   if (i !== -1) {
      //     transforms.splice(i, 1);
      //     watch();
      //   }
      // };
    },
  };
})

.directive('dsMap', function () {
  return {
    require: '^dSet',
    scope: {
      f: "=",
    },
    template: `<code-line f="f" placeholder="map function"></code-line>`,
    link: function (scope, elem, attrs, dataset) {
      scope.$watch('f', watch);

      var transformIndex = dataset.addTransform(data => data);

      function watch() {
        if (!scope.f || !scope.f.f) return;

        var f = scope.f.f;

        var transform = data => data.map(row => {
          var rowCopy = Object.assign({}, row);
          f(rowCopy);
          return rowCopy;
        });

        dataset.updateTransform(transform, transformIndex);
      }
    },
  };
})

.directive('dsFilter', function () {
  return {
    require: '^dSet',
    scope: {
      f: "=",
    },
    template: `<code-line f="f" placeholder="filter function"></code-line>`,
    link: function (scope, elem, attrs, dataset) {
      scope.$watch('f', watch);

      var transformIndex = dataset.addTransform(data => data);

      function watch() {
        if (!scope.f || !scope.f.f) return;

        var f = scope.f.f;

        var transform = data => data.filter(f);

        dataset.updateTransform(transform, transformIndex);
      }
    },
  };
})

.directive('dMakeCol', function () {
  return {
    require: '^dSet',
    scope: {
      name: "@",
      code: "@",
    },
    link: function (scope, elem, attrs, dataset) {
//      scope.$watch('code', watch);

      var transformIndex = dataset.addTransform(data => data);
      watch();

      function watch() {
        if (!scope.code) return;

        try {
          var f = eval("(" + scope.code + ")");
        } catch (e) {
          console.log('error compiling code', scope.code);
          return;
        }

        var transform = data => data.map(row => {
          var rowCopy = Object.assign({}, row);
          f(rowCopy);
          return rowCopy;
        });

        if (transformIndex === undefined) {
          transformIndex = dataset.addTransform(transform);
        } else {
          dataset.updateTransform(transform, transformIndex);
        }
      }
    },
  };
})

.directive('dColDrop', function () {
  return {
    require: '^dSet',
    scope: {
      name: "@",
    },
    link: function (scope, elem, attrs, dataset) {
      dataset.addTransform(data => data.map(row => {
        var rowCopy = Object.assign({}, row);
        delete rowCopy[scope.name];
        return rowCopy;
      }));
    },
  };
})

.directive('dsFun', function () {
  return {
    require: '^dSet',
    scope: {
      type: "@",
      f: "=",
    },
    template: `
      <ds-map ng-if="type==='map'" f="f"></ds-map>
      <ds-filter ng-if="type==='filter'" f="f"></ds-filter>
      `,
  };
});
