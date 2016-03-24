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
        it('Service should be divide simple img for p', function() {
            var input = '<p>Lorem ipsum</p><p>Lorem <img src="#"> ipsum</p><p>Lorem ipsum</p>';
            var output = ['<p>Lorem ipsum</p><p>Lorem </p>', '<img src="#">', '<p> ipsum</p><p>Lorem ipsum</p>'];
            expect(SplitHtml.run(input)).toEqual(output);

        });

        it('Service should split hn from html', function() {
            var input = '<h1>Section</h1>   <h2>Chapitre</h2> <p>Lorem ipsum</p>';
            var output = ['<h1>Section</h1>', '<h2>Chapitre</h2>', '<p>Lorem ipsum</p>'];
            expect(SplitHtml.run(input)).toEqual(output);
        });

        it('Service should split a>img from p', function() {
            var input = '<p>Lorem <a href="http://www.google.fr"><img src="#"></a>ipsum</p>';
            var output = ['<p>Lorem </p>', '<a href="http://www.google.fr"><img src="#"></a>', '<p>ipsum</p>' ];
            expect(SplitHtml.run(input)).toEqual(output);
        });

        it('Service should split two  <p> separated by a <hr>', function() {
            var input = '<p>Lorem ipsum</p> <hr> <p>Lorene ipsum youpilou</p>';
            var output = ['<p>Lorem ipsum</p>', '<hr>', '<p>Lorene ipsum youpilou</p>' ];
            expect(SplitHtml.run(input)).toEqual(output);
        });

        it('Service should escape empty bloks (with only <br>) and not create element for it)', function() {
            var input = '<h1>Section 2</h1>  <p>  <br>  </p>  <h1>Section 3</h1>';
            var output = ['<h1>Section 2</h1>', '<h1>Section 3</h1>' ];
            expect(SplitHtml.run(input)).toEqual(output);
        });
    });
});
