'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    User = mongoose.model('User'),
    Shortcut = mongoose.model('Shortcut'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, shortcut;

/**
 * Shortcut routes tests
 */
describe('User route tests', function() {
    before(function(done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            roles: ['user'],
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Shortcut
        user.save(function(error, user) {
            shortcut = new Shortcut({
                keyCombination: 'keyCombination',
                application: 'application',
                description: 'description',
                operatingSystem: 'operatingSystem',
                category: 'category',
                created: Date.now(),
                user: mongoose.Types.ObjectId(user._id)
            });
            shortcut.save(function(error, shortcut) {
                done();
            });
        });
    });

    it('should run', function(done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                agent.put('/api/users/favorites/' + user._id)
                    .expect(200)
                    .end(function(error, res) {
                        if (error) done(error);
                        //verify the shortcut is in the response favorites
                        expect(res.body.message).to.equal('yes');

                        done();
                    });

            });
    });

    afterEach(function(done) {
        User.remove().exec();
        Shortcut.remove().exec();
        done();
    });
});