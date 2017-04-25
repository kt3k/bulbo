const { asset } = require('../src/')
const { expect } = require('chai')
const through2 = require('through2')

describe('asset-facade', () => {
  describe('.asset', () => {
    it('adds the assets to build', () => {
      const facade = asset('foo').asset('bar')

      expect(facade.getAssetModel().paths).to.eql(['foo', 'bar'])

      facade.asset('baz', 'spam', 'ham')

      expect(facade.getAssetModel().paths).to.eql(['foo', 'bar', 'baz', 'spam', 'ham'])
    })
  })

  describe('.assetOptions', () => {
    it('sets the asset options to the asset', () => {
      const facade = asset('foo').assetOptions({bar: 'baz'})

      expect(facade.getAssetModel().opts).to.eql({bar: 'baz'})
    })
  })

  describe('.watch', () => {
    it('adds the watch paths', () => {
      const facade = asset('foo').watch('bar')

      expect(facade.getAssetModel().getWatchPaths()).to.eql(['bar'])

      facade.watch('baz', 'ham', 'spam')

      expect(facade.getAssetModel().getWatchPaths()).to.eql(['bar', 'baz', 'ham', 'spam'])
    })
  })

  describe('.watchOptions', () => {
    it('sets the watch options', () => {
      const facade = asset('foo').watchOptions({bar: 'baz'})

      expect(facade.getAssetModel().watchOpts).to.eql({bar: 'baz'})
    })
  })

  describe('.base', () => {
    it('sets the base path', () => {
      const facade = asset('foo').base('src')

      expect(facade.getAssetModel().opts.base).to.equal('src')
    })

    it('does not conflict with asset opts', () => {
      const facade = asset('foo').base('src').assetOptions({bar: 'baz'})

      expect(facade.getAssetModel().opts).to.eql({base: 'src', bar: 'baz'})
    })
  })

  describe('.pipe', () => {
    it('adds the pipe to the pipeline', () => {
      const facade = asset('foo').pipe(through2())

      expect(facade.getAssetModel().pipeline.length).to.equal(2)
    })

    it('throws when the given tranform equals null', () => {
      expect(() => asset('foo').pipe(null)).to.throw(Error)
    })
  })
})
