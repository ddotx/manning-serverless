'use strict';

const fs = require("fs")
const Mustache = require('mustache')
const http = require('superagent-promise')(require('superagent'),Promise)
const aws4 = require('aws4')
const URL = require('url')

const restaurantsApiRoot = process.env.restaurants_api
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

var html;

async function loadHtml(){
  if (!html) {
    html = await fs.readFileSync('static/index.html','utf-8')
  }
  return html
}

async function getRestaurants(){
  let url = URL.parse(restaurantsApiRoot)
  let opts = {
    host: url.hostname,
    path: url.pathname
  }
  aws4.sign(opts)

  return (await http
    .get(restaurantsApiRoot)
    .set('Host', opts.headers['Host'])
    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
    .set('Authorization', opts.headers['Authorization'])
    .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])
    ).body
}

module.exports.handler = async event => {
  let template = await loadHtml()
  let restaurants = await getRestaurants()
  let dayOfWeek = days[new Date().getDate()]
  let html = Mustache.render(template, { dayOfWeek, restaurants })

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };
};
