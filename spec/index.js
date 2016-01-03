'use strict'

var fs = require('fs')
var bulbo = require('../')
var expect = require('chai').expect
var rimraf = require('rimraf')
var request = require('superagent')
var vinylServe = require('vinyl-serve')
var through = require('through')
var browserify = require('browserify')

describe('moduleIF', function () {
    /* eslint handle-callback-err: 0 */

    beforeEach(function () {

        bulbo.clear()

    })

    describe('asset', function () {

        it('registers the asset', function () {

            bulbo.asset('spec/fixture/**/*.js')
            expect(bulbo.isEmpty()).to.be.false

        })

        it('returns the setter of the asset\'s modifier', function () {

            expect(bulbo.asset('spec/fixture/**/*.js')).to.be.a('function')

        })

        describe('modifier setter', function () {

            it('sets the asset modifier', function (done) {

                bulbo.asset('spec/fixture/**/*.js')(function (src) {

                    return src.pipe(through(function (file) {

                        file.contents = browserify(file.path).bundle()

                        this.queue(file)

                    }))

                })

                bulbo.build(function () {

                    var contents = fs.readFileSync('build/js/foo.js').toString()

                    expect(contents).to.contain('This is foo.js')
                    expect(contents).to.contain('This is bar.js')

                    rimraf('build', done)

                })

            })

            it('cause error when building if the modifier does not return stream', function () {

                bulbo.asset('spec/fixture/**/*.js')(function (src) { return null })

                expect(function () {

                    bulbo.build()

                }).to.throw()

            })

        })

    })

    describe('build', function () {

        it('builds the assets and put then in build/ dir', function (done) {

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.build(function (err) {

                expect(fs.readFileSync('build/js/foo.js').toString()).to.have.length.above(1)

                rimraf('build', done)

            })

        })

        it('does not throw when param is undefined', function (done) {

            bulbo.build()

            setTimeout(done, 100)

        })

    })

    describe('serve', function () {

        it('serves the assets at port 7100', function (done) {

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.serve(function () {

                setTimeout(function () {

                    request.get('0.0.0.0:7100/js/foo.js').buffer().end(function (err, res) {

                        expect(res.text).to.contain('This is foo.js')

                        vinylServe.stop(7100)

                        done()

                    })

                }, 100)

            })

        })

        it('does not throw when the param is undefined', function (done) {

            bulbo.serve()

            setTimeout(function () {

                vinylServe.stop(7100)

                done()

            }, 100)

        })

    })

    describe('port', function () {

        it('sets the port number', function (done) {

            bulbo.port(8500)

            bulbo.serve(function () {

                request.get('0.0.0.0:8500/__vinyl__').end(function (err, res) {

                    vinylServe.stop(8500)

                    done(err)

                })

            })

        })

    })

    describe('dest', function () {

        it('sets the build destination', function (done) {

            bulbo.dest('build/dist')

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.build(function () {

                expect(fs.readFileSync('build/dist/js/foo.js').toString()).to.have.length.above(1)

                rimraf('build', done)

            })

        })

    })

})
