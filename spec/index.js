import fs from 'fs'
import bulbo from '../src/bulbo'

import {expect} from 'chai'
import rimraf from 'rimraf'
import request from 'superagent'
import vinylServe from 'vinyl-serve'
import through from 'through'
import browserify from 'browserify'

const SERVER_LAUNCH_WAIT = 800
const BUILD_WAIT = 400

describe('bulbo', () => {
    /* eslint handle-callback-err: 0 */

    beforeEach(() => {

        bulbo.clear()

    })

    describe('asset', () => {

        it('registers the asset', () => {

            bulbo.asset('spec/fixture/**/*.js')
            expect(bulbo.isEmpty()).to.be.false

        })

        it('returns the setter of the asset\'s modifier', () => {

            expect(bulbo.asset('spec/fixture/**/*.js')).to.be.a('function')

        })

        describe('modifier setter', () => {

            it('sets the asset modifier', done => {

                bulbo.asset('spec/fixture/js/{foo,bar}.js', {
                    base: 'spec/fixture'
                })(src => {

                    return src.pipe(through(function (file) {

                        file.contents = browserify(file.path).bundle()

                        this.queue(file)

                    }))

                })

                bulbo.build(() => {

                    const contents = fs.readFileSync('build/js/foo.js').toString()

                    expect(contents).to.contain('This is foo.js')
                    expect(contents).to.contain('This is bar.js')

                    rimraf('build', done)

                })

            })

            it('cause error when building if the modifier does not return stream', () => {

                bulbo.asset('spec/fixture/**/*.js')(src => null)

                expect(() => {

                    bulbo.build()

                }).to.throw()

            })

        })

    })

    describe('build', () => {

        it('builds the assets and put them in build/ dir', done => {

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.build(err => {

                expect(fs.readFileSync('build/js/foo.js').toString()).to.have.length.above(1)

                rimraf('build', done)

            })

        })

        it('does not stop at highWaterMark(=16) files', done => {

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.build(err => {

                expect(fs.readFileSync('build/js/0.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/1.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/2.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/3.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/4.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/5.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/6.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/7.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/8.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/9.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/10.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/11.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/12.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/13.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/14.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/15.js').toString()).to.have.length.above(1)
                expect(fs.readFileSync('build/js/16.js').toString()).to.have.length.above(1)

                rimraf('build', done)

            })

        })

        it('does not throw when param is undefined', done => {

            bulbo.build()

            setTimeout(done, BUILD_WAIT)

        })

    })

    describe('serve', () => {

        it('serves the assets at port 7100', done => {

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.serve(() => {

                setTimeout(() => {

                    request.get('0.0.0.0:7100/js/foo.js').buffer().end(function (err, res) {

                        expect(res.text).to.contain('This is foo.js')

                        vinylServe.stop(7100)

                        done()

                    })

                }, SERVER_LAUNCH_WAIT)

            })

        })

        it('does not throw when the param is undefined', done => {

            bulbo.serve()

            setTimeout(() => {

                vinylServe.stop(7100)

                done()

            }, SERVER_LAUNCH_WAIT)

        })

    })

    describe('port', () => {

        it('sets the port number', done => {

            bulbo.port(8500)

            bulbo.serve(() => {

                request.get('0.0.0.0:8500/__bulbo__').end((err, res) => {

                    vinylServe.stop(8500)

                    done(err)

                })

            })

        })

    })

    describe('dest', () => {

        it('sets the build destination', done => {

            bulbo.dest('build/dist')

            bulbo.asset('spec/fixture/**/*.js')

            bulbo.build(() => {

                expect(fs.readFileSync('build/dist/js/foo.js').toString()).to.have.length.above(1)

                rimraf('build', done)

            })

        })

    })

})
