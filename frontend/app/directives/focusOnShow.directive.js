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
                                }); // no time passed to the $timeout (in order to execute it at the end of cycle)
                            }
                        });     
                    }
                    // Just in case
                    elm.on('$destroy', function() {
                        scope.$destroy();
                    });
                }
            };
        });

})();