/*jshint undef:false */
describe('test', function() {
    'use strict';

    beforeEach(module('angularSplitHtml'));

    var SplitHtml;

    beforeEach(inject(function(_SplitHtml_) {
        SplitHtml = _SplitHtml_;
        console.log('bouah');
    }));

    it('Should be True ;)', function() {
    	console.log('mais heu');
        expect(SplitHtml).not.toBe(null);
    });
});