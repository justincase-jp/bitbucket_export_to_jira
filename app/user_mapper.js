'use strict';

// Copyright (c) 2018 justInCase, Inc

const fs = require('fs');

class UserMapper {

  /**
   * mapping file path
   * @returns {string}
   */
  static get mappingFile() {
    return '../config/user_mapping.json';
  }

  /**
   * map username from bitbucket username to a mapped username (defined in user_mapping.json)
   * @param {string} alias - bitbucket username to be mapped
   * @param {boolean} quiet - no debug output if it's true
   * @returns {string} mapped username
   */
  static userName(alias, quiet) {
    if (typeof this.bitbucketIdToName === 'undefined') {
      const mapping = JSON.parse(fs.readFileSync(`${__dirname}/${this.mappingFile}`, 'utf8'));
      this.bitbucketIdToName = (mapping && mapping.bitbucketIdToName) || {};
    }
    const user = this.bitbucketIdToName[alias];
    if (typeof user === 'undefined' || user === '') {
      if (!quiet) {
        console.log('missing ... ' + alias);
      }
      return alias;
    }
    return user;
  }

  /**
   * map username from a given mapped username to Jira username (defined in user_mapping.json)
   * @param {string} alias
   * @returns {string} Jira username
   */
  static userNameOnJira(alias) {
    if (!alias) {
      return null;
    }
    if (typeof this.nameToJiraId === 'undefined') {
      const mapping = JSON.parse(fs.readFileSync(`${__dirname}/${this.mappingFile}`, 'utf8'));
      this.nameToJiraId = (mapping && mapping.nameToJiraId) || {};
    }
    const user = this.userName(alias, true);
    const users = this.nameToJiraId;
    if (typeof users[user] === 'undefined' || users[user] === '') {
      return null;
    }
    return users[user];
  }
}

module.exports = UserMapper;
