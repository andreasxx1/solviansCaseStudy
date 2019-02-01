(function() {
    'use strict';

    angular
        .module('case-study')
        .directive('focusOnShow', function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, elm, attr) {
                    if (attr.ngShow) {
                        scope.$watch(attr.ngShow, newValue => {
                            if (newValue) {
                                $timeout(function() {
                                    elm[0].focus();
                                });
                            }
                        });     
                    }
                    elm.on('$destroy', function() {
                        scope.$destroy();
                    });
                }
            };
        });

})();