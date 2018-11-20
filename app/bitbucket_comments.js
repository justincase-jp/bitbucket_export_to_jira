'use strict';

// Copyright (c) 2018 justInCase, Inc

const request = require('request');
const ApiAuth = require('../config/api_credential');
const AppConfig = require('../config/app_config');
const AppUtil = require('./app_util');
const UserMapper = require('./user_mapper');

class BitBucketComments {

  /**
   * BitBucketComments manages comments of a given base entry.
   * @param {string} baseAddress - base address of api entry point.
   */
  constructor(baseAddress) {
    this.entrypoint = `${baseAddress}/comments`;
  }

  /**
   * convert format for a given comments array with Jira compatible json structure.
   * @param {Object[]} comments
   * @returns {{body: string, author: string, created: string}[]}
   */
  makeExportable(comments) {
    return comments.map(com => ({
      body: com.content || '',
      author: UserMapper.userNameOnJira(com.user),
      created: com.created_on,
    }));
  }

  /**
   * @callback commentFetchCompletion
   * @param {Object[]} - an array of comment objects
   */
  /**
   * fetch all comments. It iterates through all comments as long as next page given.
   * @param {commentFetchCompletion} completion - to be called when all comments fetched
   * @returns {Promise<*>}
   */
  async fetchAll(completion) {
    return new Promise(resolve => {
      const comments = [];
      const fetcher = uri => {
        if (!uri) {
          uri = this.entrypoint;
        }
        const options = {
          auth: ApiAuth,
          json: true
        };
        const callback = (err, resp, body) => {
          if (err) {
            console.log(`err (${uri}) ... ${err}`);
            return;
          }
          if (!body.values) {
            console.log(`err (${uri}) ... ${body}`);
            setTimeout(() => fetcher(uri), AppConfig.requestWait);
            return;
          }
          // console.log(JSON.stringify(body, null, '  '));
          const results = body.values.filter(obj => obj.user !== null).map(obj => ({
            content: AppUtil.markdownToJiraNotation(obj.content.raw || ''),
            user: UserMapper.userName(obj.user.username),
            id: obj.id,
            created_on: obj.created_on,
          }));
          comments.push(...results);
          if (body.next) {
            fetcher(body.next);
          } else {
            if (completion) {
              completion(comments);
            }
            resolve();
          }
        };
        request.get(uri, options, callback);
      };
      fetcher();
    });
  }
}

module.exports = BitBucketComments;