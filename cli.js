#!/usr/bin/env node
'use strict'
const cac = require('cac')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
const main = require('./')

updateNotifier({ pkg }).notify()

const cli = cac()

const defaultCommand = cli.command('*', 'My Default Command', (input, flags) => {
  main(flags.limit)
})

defaultCommand.option('limit', {
  desc: ''
})

cli.parse()
