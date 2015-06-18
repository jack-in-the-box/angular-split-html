/*jshint undef:false */
describe('test angular-split-html', function() {
    'use strict';

    beforeEach(module('angularSplitHtml'));

    var SplitHtml;

    beforeEach(inject(function(_SplitHtml_) {
        SplitHtml = _SplitHtml_;
    }));

    it('Service could be loaded', function() {
        expect(SplitHtml).not.toBe(null);
    });

    describe('test divide', function() {
        it('Service should be divide simple p', function() {
            var input = '<p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p>';
            var output = ['<p>Lorem ipsum</p>', '<p>Lorem ipsum</p>', '<p>Lorem ipsum</p>'];
            expect(SplitHtml.divide(input)).toEqual(output);

        });
    });
});