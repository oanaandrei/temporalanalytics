// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.directive("myToggle", function () {
  return {
    link: function (scope, element, attr) {
      var selector = attr.myToggle;

      element.on('click', function () {
        console.log('clicked', selector);
        if ($(selector).is(':visible')) {
          $(selector).hide();
        } else {
          $(selector).show();
        }
      });
    },
  };
})

.directive("timecutConfig", function () {
  return {
    scope: {
      timecut: '=',
      onremove: '&',
    },
    template: `
            <div class="col-xs-4">
                <div class="form-group">
                  <label>From</label>
                  <input class="form-control" ng-model="timecut.start" />
                </div>
              </div>
              <div class="col-xs-4">
                <div class="form-group">
                  <label>To</label>
                  <input class="form-control" ng-model="timecut.end" />
                </div>
              </div>
              <div class="col-xs-3">
                <div class="form-group">
                  <label>Min days</label>
                  <input class="form-control" ng-model="timecut.mindays" />
                </div>
              </div>
              <div class="col-xs-1 controls">
                <button class="btn btn-link" ng-click="onremove()"><span class="glyphicon glyphicon-remove-circle"></span></button>
              </div>`,
    link: function (scope, element, attributes) {
    },
  };
})

.directive('pctlConfig', function () {
  return {
    scope: {
      pctl: '=',
      onremove: '&',
    },
    template: `<div class="col-xs-10">
                <div class="row">
                  <div class="col-xs-12">
                    <input class="form-control" ng-model="pctl.name" placeholder="Label" />
                  </div>
                  <div class="col-xs-12">
                    <textarea class="form-control" ng-model="pctl.properties" placeholder="Properties"></textarea>
                  </div>
                  <div class="col-xs-12">
                    <input class="form-control" ng-model="pctl.arguments" placeholder="Arguments" />
                  </div>
                </div>
              </div>
              <div class="col-xs-2">
                <button class="btn btn-link" ng-click="onremove()"><span class="glyphicon glyphicon-remove-circle"></span></button>
              </div>`,
    link: function (scope, element, attributes) {},
  };
})

.directive("fileread", function () {
  return {
    scope: {
      fileread: "=",
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        };

        reader.readAsText(changeEvent.target.files[0]);
      });
    },
  };
})

.directive("objectEdit", function () {
  return {
    scope: {
      object: "=",
    },
    templateUrl: 'templates/object-edit.html',
    link: function (scope, elem, attrs) {
      scope.$watch('object', function (object) {
        scope.keys = Object.keys(object);
      });
    },
  };
})

.directive("dFilter", function () {
  return {
    scope: {
      input: "=",
      output: "=",
      placeholder: "@",
    },
    template: '<code-line f="f" placeholder="{{ placeholder }}"></code-line>',
    link: function (scope, elem, attrs) {
      scope.$watch('input', watch, true);
      scope.$watch('f', watch, true);

      function watch() {
        if (!scope.input) {
          console.log('filter has no input');
          return;
        }

        var f = scope.f && scope.f.f || (() => true);

        scope.output = scope.input.filter(f);
        console.log('running filter', scope.output);
      }
    },
  };
})

.directive('dTable', function () {
  return {
    scope: {
      data: "=",
    },
    template: `<table class="table">
      <tr>
        <th ng-repeat="column in columns">{{ column }}</th>
      </tr>
      <tr ng-repeat="row in data">
        <td ng-repeat="column in columns">{{ format(row[column]) }}</td>
      </tr>
    </table>`,
    link: function (scope, elem, attr) {
      scope.$watch('data', watch);

      scope.format = function (value) {
        if (typeof value === "object") {
          return JSON.stringify(value);
        }

        return value;
      };

      function watch() {
        console.log('changing columns');

        if (!scope.data) return;
        scope.columns = Object.keys(scope.data[0]).filter(
          key => key.indexOf('$$') !== 0
        );
      }
    },
  };
})

.directive('playGround', function () {
  return {
    scope: {},
    templateUrl: 'playground.html',
    link: function (scope, elem, attrs) {
      scope.sampleData = [{"timecut":{"start":0,"end":1},"pctl":{"name":"Prop 1","properties":"const N;\nP = ? [F<=N y=4]\n","arguments":"-const N=50","$$hashKey":"object:14"},"result":{"value":0.9999864968453416},"$$hashKey":"object:41"},{"timecut":{"start":0,"end":1,"$$hashKey":"object:5"},"pctl":{"name":"Prop 2","properties":"const N;\nP = ? [F<=N y=2]\n","arguments":"-const N=50","$$hashKey":"object:15"},"result":{"value":0.7447036070999433},"$$hashKey":"object:42"},{"timecut":{"start":0,"end":7,"$$hashKey":"object:6"},"pctl":{"name":"Prop 1","properties":"const N;\nP = ? [F<=N y=4]\n","arguments":"-const N=50","$$hashKey":"object:14"},"result":{"value":0.9999894348795845},"$$hashKey":"object:43"},{"timecut":{"start":0,"end":7,"$$hashKey":"object:6"},"pctl":{"name":"Prop 2","properties":"const N;\nP = ? [F<=N y=2]\n","arguments":"-const N=50","$$hashKey":"object:15"},"result":{"value":0.7074208681113434},"$$hashKey":"object:44"}];
      scope.dsfuns = [];
      scope.addMap = function () { scope.dsfuns.push({ type: "map", f: { code: "" } }); };

      scope.addFilter = function () { scope.dsfuns.push({ type: "filter", f: { code: "" } }); };
    }
  };
})

.directive('prismStatus', function() {
  return {
    scope: {},
    templateUrl: 'templates/prism-status.html',
    link: function (scope, elem, attrs) {
      scope.clear = function() {
        scope.status.lastOutput = '';
      };

      scope.nl2br = function(text) {
        if (text) {
          return text.replace(/\n/g, '<br>');
        }
      }
    },
    controller: function($scope, PRISM) {
      $scope.status = PRISM.getStatusObject();
      $scope.$watch(
        function() {
          return PRISM.getStatusObject();
        },
        function(newValue) {
          $scope.status = newValue;
          console.log('new value');
        },
        true
      );
    },
  };
})

.directive('arhmmStatus', function() {
  return {
    scope: {},
    templateUrl: 'templates/arhmm-status.html',
    link: function (scope, elem, attrs) {
      scope.clear = function() {
        scope.status.lastOutput = '';
      };
    },
    controller: function($scope, ARHMM) {
      $scope.status = ARHMM.getStatusObject();
      $scope.$watch(
        function() {
          return ARHMM.getStatusObject();
        },
        function(newValue) {
          $scope.status = newValue;
        },
        true
      );
    },
  };
})

.directive('emStatus', function() {
  return {
    scope: {},
    templateUrl: 'templates/em-status.html',
    link: function (scope, elem, attrs) {
      scope.clear = function() {
        scope.status.lastOutput = '';
      };
    },
    controller: function($scope, EM) {
      $scope.status = EM.getStatusObject();
      $scope.$watch(
        function() {
          return EM.getStatusObject();
        },
        function(newValue) {
          $scope.status = newValue;
        },
        true
      );
    },
  };
});
