import {asset} from '../src/bulbo'
import {expect} from 'chai'
import through from 'through'
import through2 from 'through2'

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

            expect(facade.getAssetModel().getWatchOpts()).to.eql({bar: 'baz'})

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

    describe('.build', () => {

        it('adds the transform to the asset', () => {

            const f = () => 1
            const g = () => 1

            const facade = asset('foo').build(f)

            expect(facade.getAssetModel().transforms[0]).to.equal(f)

            facade.build(g)

            expect(facade.getAssetModel().transforms[1]).to.equal(g)

        })

    })

    describe('.pipe', () => {

        it('throws when the transform does not conform to Stream v2 Transform', () => {

            expect(() => asset('foo').pipe(through())).to.throw(Error)

        })

        it('adds the transform', () => {

            const facade = asset('foo').pipe(through2())

            expect(facade.getAssetModel().transforms.length).to.equal(1)

        })

    })

})
