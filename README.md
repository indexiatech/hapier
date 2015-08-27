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
