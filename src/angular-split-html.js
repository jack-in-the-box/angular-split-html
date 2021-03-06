(function() {

    'use strict';

    angular.module('angularSplitHtml', [])
        .service('SplitHtml', SplitHtml);

    function SplitHtml() {
        var self = this;

        var prepareForRun = function(html) {
            return [html];
        };

        var splitImg = function(htmlArray) {
            var result = [];
            _.forEach(htmlArray, function(html) {
                result.push(splitHtml(html, 'img', function($el) {
                    return $el.parent('a').length === 0;
                }));
            });

            return result;
        };

        var splitLinkImg = function(htmlArray) {
            var result = [];
            _.forEach(htmlArray, function(html) {
                result.push(splitHtml(html, 'a', function($el) {
                    return $el.find('img').length > 0;
                }));
            });

            return result;
        };

        var splitHn = function(htmlArray) {
            var result = [];
            _.forEach(htmlArray, function(html) {
                var splittedHtml = splitHtml(html, 'h1,h2,h3,h4,h5,h6');
                var splittedHtmlWithoutEmptyElements = _.filter(splittedHtml, function(element) {
                    // we don't create element that has only br or p tag without content
                    return _.trim(element.replace(/<(\/)?(p|br)>/ig, ''))  !== '';
                });
                result.push(splittedHtmlWithoutEmptyElements);
            });
            return result;
        };

        var splitHr = function(htmlArray) {
            var result = [];
            _.forEach(htmlArray, function(html) {
                var splittedHtml = splitHtml(html, 'hr');
                result.push(splittedHtml);
            });
            return result;
        };

        var purge = function(html) {
            return _.filter(html, function(html) {
                if(html === '') {
                    return false;
                }

                return true;
            });
        };

        self.run = _.flow(
            prepareForRun,
            _.flattenDeep,
            splitImg,
            _.flattenDeep,
            splitLinkImg,
            _.flattenDeep,
            splitHr,
            _.flattenDeep,
            splitHn,
            _.flattenDeep,
            purge
        );

        /***** THIS HAVE TO GO OUT ! ******/
        var cheerio;
        if (typeof window === 'undefined') {
            // node
            module.exports = splitHtml;
            cheerio = require('cheerio');
        } else {
            window.splitHtml = splitHtml;
            // In the browser, use actual jQuery in place of Cheerio.
            // Create a simulated cheerio object.
            cheerio = {
                load: function(html) {
                    var $wrapper = jQuery('<div data-cheerio-root>');
                    var $el = jQuery(html);
                    $wrapper.append($el);

                    function c(s) {
                        if (s[0] === '<') {
                            return jQuery(s);
                        }
                        return $wrapper.find(s);
                    }
                    c.html = function() {
                        return $wrapper.html();
                    };
                    return c;
                },
            };
        }

        function splitHtml(html, splitOn, test) {
            if (!test) {
                test = function($el) {
                    return true;
                };
            }
            var result = [];
            var splitAttr = 'data-' + token();
            var ignoreAttr = 'data-' + token();
            var $;
            var $matches;
            var i;
            var $match;
            var $wrapper;
            var tag;
            while (true) {
                $ = cheerio.load(html);
                $matches = $(splitOn);
                $match = null;
                for (i = 0;
                    (i < $matches.length); i++) {
                    $match = $matches.eq(i);
                    if ((!$match.attr(ignoreAttr)) && test($match)) {
                        break;
                    } else {
                        $match.attr(ignoreAttr, '1');
                    }
                    $match = null;
                }
                if (!$match) {
                    result.push(html);
                    break;
                }
                $match.attr(splitAttr, '1');
                var markup = $.html();
                var splitAt = markup.indexOf(splitAttr);
                var leftAt = markup.lastIndexOf('<', splitAt);
                if (leftAt === -1) {
                    result.push(html);
                    break;
                }
                var first = markup.substr(0, leftAt);

                // For the second segment we need to reopen the
                // open tags from the first segment. Reconstruct that.

                var reopen = '';
                $wrapper = cheerio.load('<div></div>')('div').eq(0);
                var $parents = $match.parents();
                for (i = 0;
                    (i < $parents.length); i++) {
                    var $original = $parents.eq(i);
                    if ($original.is('[data-cheerio-root]')) {
                        // Simulated cheerio used in browser has
                        // a wrapper element
                        break;
                    }
                    var $parent = $original.clone();
                    $parent.empty();
                    $wrapper.empty();
                    $wrapper.append($parent);
                    var parentMarkup = $wrapper.html();
                    var endTagAt = parentMarkup.indexOf('>');
                    tag = tagName($parent);
                    // Cheerio tolerates missing closing tags,
                    // but real jQuery will discard any text
                    // preceding them, so play nice
                    first += '</' + tag + '>';
                    reopen = parentMarkup.substr(0, endTagAt + 1) + reopen;
                }

                // We can't just split off the next fragment at
                // > because the matching tag may be a container.
                // Move it to a wrapper to get its full markup,
                // then remove it from the original document. The
                // remainder of the original document now begins
                // where the matching tag used to

                markup = $.html();

                $wrapper = cheerio.load('<div></div>')('div').eq(0);
                $match.removeAttr(splitAttr);
                $wrapper.append($match);
                tag = $wrapper.html();
                $match.remove();
                markup = $.html();
                var second = reopen + markup.substr(leftAt);
                // Let Cheerio close the open tags in the
                // first segment for us. Also mop up the attributes
                // we used to mark elements that matched the selector
                // but didn't match our test function
                first = cleanup(first);
                result.push(first);
                result.push(tag);
                html = cleanup(second);
            }
            return result;
            // Use Cheerio to strip out any attributes we used to keep
            // track of our work, then generate new HTML. This also
            // closes any tags we opened but did not close.
            function cleanup(html) {
                html = cheerio.load(html);
                html('[' + ignoreAttr + ']').removeAttr(ignoreAttr);
                html = html.html();
                return html;
            }

            function token() {
                return Math.floor(Math.random() * 1000000000).toString();
            }
        }

        function tagName($el) {
            // Different in DOM and Cheerio. Cheerio
            // doesn't support prop() either.
            return $el[0].tagName || $el[0].name;
        }
    }
})();
