(function() {
    'use strict';

    angular
        .module('case-study')
        .directive('nextOnEnter', function () {
		    return {
		        restrict: 'A',
		        link: function (scope, elm, attr) {
		            elm.bind('keydown', function(e) {
		                const code = e.keyCode || e.which;
		                if (code === 13) {
		                    e.preventDefault();
		                    const pageElems = document.querySelectorAll('input');
		                    let focusNext = false;
		                    const len = pageElems.length;
		                    for (let i = 0; i < len; i++) {
		                        const pe = pageElems[i];
		                        if (focusNext && !pe.disabled && pe.nodeName === 'INPUT') {
	                                pe.focus();
	                                break;
		                        } else if (pe === e.target) {
		                            focusNext = true;
		                        } 
		                    }
		                }
		            });
                    // Just in case
                    elm.on('$destroy', function() {
                        scope.$destroy();
                    });
		        }
		    }
		});

})();


