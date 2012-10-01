// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE in bottom for details.

/*global desc, task, jake, fail, complete, directory*/
(function() {
	"use strict";

	var NODE_VERSION = "v0.8.11";
	var GENERATED_DIR = "generated";
	var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

	directory(TEMP_TESTFILE_DIR);

	desc("Delete all generated files");
	task("clean", [], function() {
		jake.rmRf(GENERATED_DIR);
	});

	desc("Build and test");
	task("default", ["lint", "test"]);

	desc("Lint everything");
	task("lint", ["nodeVersion"], function() {
		var lint = require("./build/lint/lint_runner.js");

		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("**/*.js");
		javascriptFiles.exclude("node_modules");
		javascriptFiles.exclude("spikes");
		
		var options = nodeLintOptions();
		var passed = lint.validateFileList(javascriptFiles.toArray(), options, {});
		if (!passed) fail("Lint failed");
	});

	desc("Test everything");
	task("test", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
		var testFiles = new jake.FileList();
		testFiles.include("**/_*_test.js");
		testFiles.exclude("node_modules");
        // testFiles.exclude("/src/client/**");

		var reporter = require("nodeunit").reporters["default"];
		reporter.run(testFiles.toArray(), null, function(failures) {
			if (failures) fail("Tests failed");
			complete();
		});
	}, {async: true});

    // desc("Deploy to Heroku");
    // task("deploy", ["default"], function() {
    //  console.log("1. Make sure 'git status' is clean.");
    //  console.log("2. 'git push heroku master'");
    //  console.log("3. 'jake test'");
    // });

//	desc("Ensure correct version of Node is present. Use 'strict=true' to require exact match");
	task("nodeVersion", [], function() {
		function failWithQualifier(qualifier) {
			fail("Incorrect node version. Expected " + qualifier +
					" [" + expectedString + "], but was [" + actualString + "].");
		}

		var expectedString = NODE_VERSION;
		var actualString = process.version;
		var expected = parseNodeVersion("expected Node version", expectedString);
		var actual = parseNodeVersion("Node version", actualString);

		if (process.env.strict) {
			if (actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2]) {
				failWithQualifier("exactly");
			}
		}
		else {
			if (actual[0] < expected[0]) failWithQualifier("at least");
			if (actual[0] === expected[0] && actual[1] < expected[1]) failWithQualifier("at least");
			if (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] < expected[2]) failWithQualifier("at least");
		}

	});

    // desc("Integration checklist");
    // task("integrate", ["default"], function() {
    //  console.log("1. Make sure 'git status' is clean.");
    //  console.log("2. Build on the integration box.");
    //  console.log("   a. Walk over to integration box.");
    //  console.log("   b. 'git pull'");
    //  console.log("   c. 'jake strict=true'");
    //  console.log("   d. If jake fails, stop! Try again after fixing the issue.");
    //  console.log("3. 'git checkout integration'");
    //  console.log("4. 'git merge master --no-ff --log'");
    //  console.log("5. 'git checkout master'");
    // });


	function parseNodeVersion(description, versionString) {
		var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/;    // v[major].[minor].[bugfix]
		var versionInfo = versionString.match(versionMatcher);
		if (versionInfo === null) fail("Could not parse " + description + " (was '" + versionString + "')");

		var major = parseInt(versionInfo[1], 10);
		var minor = parseInt(versionInfo[2], 10);
		var bugfix = parseInt(versionInfo[3], 10);
		return [major, minor, bugfix];
	}

    // function sh(command, callback) {
    //  console.log("> " + command);
    //
    //  var stdout = "";
    //  var process = jake.createExec(command, {printStdout:true, printStderr: true});
    //  process.on("stdout", function(chunk) {
    //      stdout += chunk;
    //  });
    //  process.on("cmdEnd", function() {
    //      console.log();
    //      callback(stdout);
    //  });
    //  process.run();
    // }

	function nodeLintOptions() {
		return {
			bitwise:true,
			curly:false,
			eqeqeq:true,
			forin:true,
			immed:true,
			latedef:true,
			newcap:true,
			noarg:true,
			noempty:true,
			nonew:true,
			regexp:true,
			undef:true,
			strict:true,
			trailing:true,
			node:true
		};
	}
}());

// License
// -------
// Copyright (c) 2012 James Shore
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.