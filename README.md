# Hapier

[![npm version](https://badge.fury.io/js/hapier.svg)](https://badge.fury.io/js/hapier)
[![Build Status](https://api.travis-ci.org/indexiatech/hapier.png?branch=master)](https://travis-ci.org/indexiatech/hapier)
[![Coverage Status](https://coveralls.io/repos/indexiatech/hapier/badge.svg?branch=master&service=github)](https://coveralls.io/github/indexiatech/hapier?branch=master)
[![Dependency Status](https://david-dm.org/indexiatech/hapier.svg)](https://david-dm.org/indexiatech/hapier)
[![bitHound Overalll Score](https://www.bithound.io/github/indexiatech/hapier/badges/score.svg)](https://www.bithound.io/github/indexiatech/hapier)


A happier way to use [Hapi](http://hapijs.com)

Lead Maintainer: [Asaf Shakarzy](https://github.com/asaf)

## Introduction

**hapier** is a [hapi](http://hapijs.com) plugin that helps you to focus on building
your product by reducing the effort required to register and organize Hapi components,

It conduct (still can be changed) a methodology for managing application
components (i.e actions, routes, etc) and automatically injects the relevant
configuration to each component.

Hapier is not changing the way hapi works, it just reduce glue code and conduct
a simple yet powerful way to manage application component.

This project is based on the following modules:

* [hapi](http://hapijs.com) - the application container for the front-end API.
* [seneca](http://senecajs.org) (via [Chairo](https://github.com/hapijs/chairo) plugin) - a micro service container for the business logic.
