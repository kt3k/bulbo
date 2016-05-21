# TODO

- bug(watch): the watch paths which is not the first one are ignored.

# DONE

- Command bulbo build -w
  - Use event emitter
  - create asset-watcher which extends event-emitter
  - asset-builder and asset-server extend asset-watcher
- Create bulbo.base() which sets the default base path for all
- Separate API reference and getting started guide
- Fix bug of options overriding .base('foo').assetOptions({}) removes the base path setting
- write a bit more tests
- DSL verb .pipe
- DSL verb .asset
- DSL verb .assetOptions
- Rename AssetModifier to AssetFacade, and write it to doc
- DSL verb .watch
- DSL verb .base
- DSL verb .build
- switch to es2015
- show error and stop the server when the port is already in use
- show the start and end of the watch handling
