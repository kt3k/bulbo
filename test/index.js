const fs = require('fs')
const bulbo = require('../src/')

require('./helper')
const { expect } = require('chai')
const rimraf = require('rimraf')
const request = require('superagent')
const vinylServe = require('vinyl-serve')
const through2 = require('through2')
const browserify = require('browserify')

const SERVER_LAUNCH_WAIT = 800
const BUILD_WAIT = 400
const WATCH_BUILD_WAIT = 100
const WATCH_BUILD_WAIT_CHANGED = 300

describe('bulbo', () => {
  beforeEach(() => {
    bulbo.clear()
    bulbo.setLogger(require('../src/util/logger')('bulbo'))
  })

  describe('asset', () => {
    it('registers the asset', () => {
      bulbo.asset('test/fixture/**/*.js')
      expect(bulbo.isEmpty()).to.be.false()
    })

    it('returns the asset\'s modifier', () => {
      expect(bulbo.asset('test/fixture/**/*.js')).to.be.an('object')
      expect(bulbo.asset('test/fixture/**/*.js').watch).to.be.a('function')
      expect(bulbo.asset('test/fixture/**/*.js').watchOptions).to.be.a('function')
      expect(bulbo.asset('test/fixture/**/*.js').base).to.be.a('function')
    })

    describe('.pipe', () => {
      it('sets the transform to the asset', done => {
        bulbo
        .asset('test/fixture/js/{foo,bar}.js')
        .base('test/fixture')
        .pipe(through2.obj(function (file, enc, cb) {
          file.contents = browserify(file.path).bundle()

          cb(null, file)
        }))

        bulbo.build().then(() => {
          const contents = fs.readFileSync('build/js/foo.js').toString()

          expect(contents).to.contain('This is foo.js')
          expect(contents).to.contain('This is bar.js')

          rimraf('build', done)
        }).catch(done)
      })
    })
  })

  describe('build', () => {
    it('builds the assets and put them in build/ dir', done => {
      bulbo.asset('test/fixture/**/*.js')

      bulbo.build().then(() => {
        expect(fs.readFileSync('build/js/foo.js').toString()).to.have.length.above(1)

        rimraf('build', done)
      })
    })

    it('does not stop at highWaterMark(=16) files', done => {
      bulbo.asset('test/fixture/**/*.js')

      bulbo.build().then(() => {
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

    it('does not throw when assets are empty', done => {
      bulbo.build()

      setTimeout(done, BUILD_WAIT)
    })
  })

  describe('watchAndBuild', () => {
    it('builds the assets', done => {
      bulbo.asset('test/fixture/js/0.js').base('test/fixture')

      bulbo.watchAndBuild()

      setTimeout(() => {
        expect(fs.readFileSync('build/js/0.js').toString()).to.equal("console.log('hello')\n")

        bulbo.unwatch()
        rimraf('build', done)
      }, WATCH_BUILD_WAIT)
    })

    it('watches the assets', done => {
      bulbo.asset('test/fixture/js/0.js').base('test/fixture')

      bulbo.watchAndBuild()

      setTimeout(() => {
        expect(fs.readFileSync('build/js/0.js').toString()).to.equal("console.log('hello')\n")

        fs.writeFileSync('test/fixture/js/0.js', "console.log('spam')\n")

        setTimeout(() => {
          expect(fs.readFileSync('build/js/0.js').toString()).to.equal("console.log('spam')\n")

          fs.writeFileSync('test/fixture/js/0.js', "console.log('hello')\n")

          bulbo.unwatch()
          rimraf('build', done)
        }, WATCH_BUILD_WAIT_CHANGED)
      }, WATCH_BUILD_WAIT)
    })
  })

  describe('serve', () => {
    it('serves the assets at port 7100', done => {
      bulbo.asset('test/fixture/**/*.js')

      bulbo.serve().then(() => {
        setTimeout(() => {
          request.get('localhost:7100/js/foo.js').buffer().end((err, res) => {
            if (err) { done(err) }

            expect(res.text).to.contain('This is foo.js')
            bulbo.unwatch()

            vinylServe.stop(7100).then(() => {
              done()
            })
          })
        }, SERVER_LAUNCH_WAIT)
      })
    })

    it('does not throw when the assets are empty', done => {
      bulbo.serve()

      setTimeout(() => {
        bulbo.unwatch()

        vinylServe.stop(7100).then(() => {
          done()
        })
      }, SERVER_LAUNCH_WAIT)
    })

    it('serves the index.html when the directory is requested', done => {
      bulbo.port(7101)

      bulbo.asset('test/fixture/**/*.*')

      bulbo.serve().then(() => {
        setTimeout(() => {
          request.get('localhost:7101/js/').buffer().end((err, res) => {
            if (err) { done(err) }

            expect(res.text).to.contain('This is js/index.html')

            bulbo.unwatch()
            vinylServe.stop(7101).then(() => {
              done()
            })
          })
        }, SERVER_LAUNCH_WAIT)
      })
    })
  })

  describe('port', () => {
    it('sets the port number', done => {
      bulbo.port(8500)

      bulbo.serve().then(() => {
        request.get('localhost:8500/__bulbo__').end((err, res) => {
          vinylServe.stop(8500)

          bulbo.unwatch()
          done(err)
        })
      })
    })
  })

  describe('dest', () => {
    it('sets the build destination', done => {
      bulbo.dest('build/dist')

      bulbo.asset('test/fixture/**/*.js')

      bulbo.build().then(() => {
        expect(fs.readFileSync('build/dist/js/foo.js').toString()).to.have.length.above(1)

        rimraf('build', done)
      })
    })
  })

  describe('debugPageTitle', () => {
    it('sets the debug page\'s title', done => {
      bulbo.asset('test/fixture/**/*.js')
      bulbo.debugPageTitle('FooBarBaz')
      bulbo.port(7111)

      bulbo.serve().then(() => {
        request.get('localhost:7111/__bulbo__').buffer().end((err, res) => {
          if (err) { done(err) }

          expect(res.text).to.contain('<title>FooBarBaz</title>')

          bulbo.unwatch()
          vinylServe.stop(7111)

          done()
        })
      })
    })
  })

  describe('debugPagePath', () => {
    it('sets the debug page path', done => {
      bulbo.asset('test/fixture/**/*.js')
      bulbo.debugPagePath('__foobarbaz__')
      bulbo.port(8113)

      bulbo.serve().then(() => {
        request.get('localhost:8113/__foobarbaz__').buffer().end((err, res) => {
          if (err) { done(err) }

          expect(res.text).to.contain('<html>')

          bulbo.unwatch()
          vinylServe.stop(8113)

          done()
        })
      })
    })
  })

  describe('base', () => {
    it('sets the default base path of the assets', done => {
      bulbo.asset('test/fixture/js/foo.js')
      bulbo.base('test')
      bulbo.port(8114)

      bulbo.serve().then(() => {
        setTimeout(() => {
          request.get('localhost:8114/fixture/js/foo.js').buffer().end((err, res) => {
            if (err) { done(err) }

            expect(res.text).to.contain('This is foo.js')

            bulbo.unwatch()
            vinylServe.stop(8114)

            bulbo.base(null)

            done()
          })
        }, SERVER_LAUNCH_WAIT)
      })
    })
  })
})
