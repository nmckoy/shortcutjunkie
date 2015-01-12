'use strict';
(function() {
	// Shortcuts Controller Spec
	describe('Shortcuts Controller Tests', function() {
		// Initialize global variables
		var ShortcutsController,
			Shortcuts,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			$filter,
			sampleShortcut,
			sampleShortcuts;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Shortcuts_, _$filter_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Shortcuts = _Shortcuts_;
			$filter = _$filter_;

			// Initialize the Shortcuts controller.
			ShortcutsController = $controller('ShortcutsController', {
				$scope: scope
			});

			sampleShortcut = new Shortcuts({
				keyCombination: 'testKeyCombination',
				application: 'testApplication',
				description: 'testDescription',
				operatingSystem: 'testOperatingSystem',
				category: 'testCategory'
			});

			sampleShortcuts = [new Shortcuts({
				keyCombination: 'firstTest',
				application: 'firstTest',
				description: 'firstTest',
				operatingSystem: 'firstTest',
				category: 'firstTest'
			}), new Shortcuts({
				keyCombination: 'secondTest',
				application: 'secondTest',
				description: 'secondTest',
				operatingSystem: 'secondTest',
				category: 'secondTest'
			}), new Shortcuts({
				keyCombination: 'thirdTest',
				application: 'firstTest',
				description: 'thirdTest',
				operatingSystem: 'thirdTest',
				category: 'thirdTest'
			})];
		}));

		it('$scope.find() should create an array with at least one Shortcut object fetched from XHR', inject(function() {
			// Set GET response
			$httpBackend.expectGET('api/shortcuts').respond(sampleShortcuts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shortcuts).toEqualData(sampleShortcuts);
		}));

		it('$scope.findApplications() should create an array with at at least one application name', inject(function() {
			// Set GET response
			$httpBackend.expectGET('api/shortcuts').respond(sampleShortcuts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			expect(scope.applications).toEqual(['firstTest', 'secondTest']);
			expect(scope.operatingSystems).toEqual(['firstTest', 'secondTest', 'thirdTest']);
		}));

		it('should restrict by application and OS', inject(function() {

			var result = $filter('applicationFilter')(sampleShortcuts, 'secondTest');
			expect(result).toEqual([sampleShortcuts[1]]);
			result = $filter('applicationFilter')(sampleShortcuts, '');
			expect(result).toEqual(sampleShortcuts);

			result = $filter('operatingSystemFilter')(sampleShortcuts, 'secondTest');
			expect(result).toEqual([sampleShortcuts[1]]);
			result = $filter('operatingSystemFilter')(sampleShortcuts, '');
			expect(result).toEqual(sampleShortcuts);

		}));

		it('should group by category', inject(function() {
			sampleShortcuts[2].category = 'firstTest';
			var result = $filter('groupBy')(sampleShortcuts, 'category');

			expect(result).toEqual({
				firstTest: [sampleShortcuts[0], sampleShortcuts[2]],
				secondTest: [sampleShortcuts[1]]
			});
		}));

		it('$scope.findOne() should create an array with one Shortcut object fetched from XHR using a shortcutId URL parameter', inject(function() {
			// Set the URL parameter
			$stateParams.shortcutId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/shortcuts\/([0-9a-fA-F]{24})$/).respond(sampleShortcut);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shortcut).toEqualData(sampleShortcut);
		}));


		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function() {
			// Create a sample Shortcut object
			var sampleShortcutPostData = new Shortcuts(sampleShortcut);

			// Create a sample Shortcut response
			sampleShortcut._id = '525cf20451979dea2c000001';
			var sampleShortcutResponse = new Shortcuts(sampleShortcut);

			// Fixture mock form input values
			scope.keyCombination = sampleShortcut.keyCombination;
			scope.application = sampleShortcut.application;
			scope.description = sampleShortcut.description;
			scope.operatingSystem = sampleShortcut.operatingSystem;
			scope.category = sampleShortcut.category;


			// Set POST response
			$httpBackend.expectPOST('api/shortcuts', sampleShortcutPostData).respond(sampleShortcutResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Shortcut was created
			expect($location.path()).toBe('/shortcuts/' + sampleShortcutResponse._id);
		}));

		it('$scope.update() should update a valid Shortcut', inject(function() {
			// Define a sample Shortcut put data
			sampleShortcut._id = '525cf20451979dea2c000001';
			var sampleShortcutPutData = new Shortcuts(sampleShortcut);

			// Mock Shortcut in scope
			scope.shortcut = sampleShortcutPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/shortcuts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shortcuts/' + sampleShortcutPutData._id);
		}));

		it('shortcuts are added to favorites', inject(function(){

		}));

		it('$scope.remove() should send a DELETE request with a valid shortcutId and remove the Shortcut from the scope', inject(function() {
			// Create new Shortcut object
			sampleShortcut._id ='525a8422f6d0f87f0e407a33';
			sampleShortcut = new Shortcuts(sampleShortcut);

			// Create new Shortcuts array and include the Shortcut
			scope.shortcuts = [sampleShortcut];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/shortcuts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShortcut);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shortcuts.length).toBe(0);
		}));
	});
}());