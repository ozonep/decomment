'use strict';

// Tests for multi-line comments;

var decomment = require('../lib');
var os = require('os');
var LB = os.EOL;

describe("Multi:", function () {

    describe("empty comment", function () {
        it("must return an empty string", function () {
            expect(decomment("/**/")).toBe("");
            expect(decomment("\/**\/")).toBe("");
        });
    });

    describe("multiple empty comments", function () {
        it("must return an empty string", function () {
            expect(decomment("/**/" + LB + "/**/" + LB)).toBe("");
            expect(decomment("/**/" + LB + "/**/")).toBe("");
        });
    });

    describe("non-empty comment", function () {
        it("must return an empty string", function () {
            expect(decomment("/* text*/")).toBe("");
        });
    });

    describe("non-empty multiple comments", function () {
        it("must return an empty string", function () {
            expect(decomment("/* text1 */" + LB + "/*text2*/")).toBe("");
            expect(decomment("/* text1 */" + LB + "/*text2*/" + LB)).toBe("");
        });
    });

    describe("with line-break prefix", function () {
        it("must return the break", function () {
            expect(decomment(LB + "/**/")).toBe(LB);
        });
    });

    describe("with line-break suffix", function () {
        it("must return an empty string", function () {
            expect(decomment("/**/" + LB)).toBe("");
        });
    });

    describe("with multiple line-break suffixes", function () {
        it("must return a single line break", function () {
            expect(decomment("/**/" + LB + LB)).toBe(LB);
        });
    });

    describe("with preceding text", function () {
        var out1 = decomment("Text/**/");
        var out2 = decomment(LB + "Text/**/");
        var out3 = decomment("Text" + LB + "/**/");
        var out4 = decomment("Text/**/" + LB + "Here");
        it("must return the preceding text", function () {
            expect(out1).toBe("Text");
            expect(out2).toBe(LB + "Text");
            expect(out3).toBe("Text" + LB);
            expect(out4).toBe("Text" + LB + "Here");
        });
    });

    describe("with empty text prefix", function () {
        var out1 = decomment("''/**/");
        var out2 = decomment("\"\"/**/");
        var out3 = decomment("``/**/");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("with empty text suffix", function () {
        var out1 = decomment("/**/" + LB + "''");
        var out2 = decomment("/**/" + LB + "\"\"");
        var out3 = decomment("/**/" + LB + "``");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("comments inside text", function () {
        var out = decomment("'/**/Text'");
        it("must leave only the comment", function () {
            expect(out).toBe("'/**/Text'");
        });
    });

    describe("spaces", function () {
        describe("complex case", function () {
            var out = decomment("a /* comment*/" + LB + "\tb /* comment*/" + LB + "c/*end*/");
            it("must keep spaces correctly", function () {
                expect(out).toBe("a " + LB + "\tb " + LB + "c");
            });
        });
    });

    describe("multiple line breaks that follow", function () {
        it("must be removed", function () {
            expect(decomment("/*text*/" + LB + LB + "end", {trim: true})).toBe("end");
        });
    });

    describe("with safe options", function () {

        it("must become empty when safe=false", function () {
            expect(decomment("/*!*/")).toBe("");
        });

        it("must keep comments when safe=true", function () {
            expect(decomment("/*!*/", {safe: true})).toBe("/*!*/");
        });
    });

    describe("combination of options", function () {
        it("must process correctly", function () {
            expect(decomment("/*!special*/" + LB + LB + "code" + LB + "/*normal*/" + LB + LB + "hello" + LB, {
                trim: true,
                safe: true
            })).toBe("/*!special*/" + LB + LB + "code" + LB + "hello" + LB);
        });
    });

    describe("inside regEx", function () {
        it("must be ignored", function () {
            expect(decomment("/[a-b/*]text/")).toBe("/[a-b/*]text/");
        });
    });

});
