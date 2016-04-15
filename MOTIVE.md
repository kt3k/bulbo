# Introduction

I was a heavy user of `middleman` for years. It is a tool for generating static web sites and it really simplifies the process of making them. I was satisfied with it at first. However at some point I started being frustrated with it in a specific point.

# The frustration

The problem is that it doesn't support `CommonJS` well. Middleman supports bundling of JavaScript with `Sprockets` by default. I was happy with it at first, but after some days the entire frontend JavaScript community seems to started moving to npm as its distribution platform and so did I. Therefore Sprockets doesn't fit this situation at all. It only concatenate all scripts and doesn't understand CommonJS. It's necessary to use `browserify` or `webpack` to bundle CommonJS compatible modules but it's not easy to use it with middleman.

# Search

Then I started googling the web. According to staticsitegenerators.net, we have nowadays over 400 static site generator choices, so I hoped I would find one which fits my need.

After comparing hundreds of generators, I found this article ( https://medium.com/objects-in-space/considering-a-static-site-tool-learn-gulp-2fd5f9821fc4 ) and the method in it (using Gulp as site generator) is the best fit to my need. It can bundle CommonJS and seemed able to do anything I wanted.

However the problem here is that gulp is too generic for this purpose. It's not created as a static site generator but for a more generic purpose, which means if we start static site with gulp, then we always need to set up some basic settings for it. It could be solved by a gulp plugin but I thought it's better to build a bit different `frontend` for gulp mechanism.

Gulp is at its heart a vinyl stream processor. Gulp is made of `js-liftoff`, `orchestrator` and `vinyl-fs` basically. All of them are highly reusable and actually used by many other tools. So creating a bit different version of gulp using these tools is not difficult.

# Bulbo

Then I created `bulbo`, a gulp compatible static site generator. It's basically almost the same as gulp but has some different appearance.
