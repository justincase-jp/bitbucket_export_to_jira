'use strict';

// Copyright (c) 2018 justInCase, Inc

const request = require('request');
const ApiAuth = require('../config/api_credential');
const AppConfig = require('../config/app_config');
const StateMapper = require('../config/state_mapper');
const AppUtil = require('./app_util');
const BitBucketComments = require('./bitbucket_comments');
const UserMapper = require('./user_mapper');

class BitBucketIssue {

  /**
   * Default api entry point to get issues.
   * @param {string} repository - repository name, it should be like `${team_id}/${repo_name}`
   * @returns {string}
   */
  static entryPoint(repository) {
    return `https://api.bitbucket.org/2.0/repositories/${repository}/issues`;
  }

  /**
   * BitBucketIssue class to manage issues for a given repository.
   * @param {string} repository - repository name, it should be like `${team_id}/${repo_name}`
   */
  constructor(repository) {
    this.repository = repository;
    this.issues = [];
    this.completion = null;
    this.ignore = null;
  }

  /**
   * get api access permalink address for a given issue ID
   * @param {string} issueId
   * @returns {string}
   */
  apiPermalink(issueId) {
    return `${BitBucketIssue.entryPoint(this.repository)}/${issueId}`;
  }

  /**
   * get web permalink address for a given issue ID
   * @param  {string} issueId
   * @returns {string}
   */
  permalink(issueId) {
    return `https://bitbucket.org/${this.repository}/issues/${issueId}`;
  }

  /**
   * convert format for a given object with Jira compatible json structure.
   * @param {Object} obj
   * @returns {*}
   * @private
   */
  _makeExportable(obj) {
    if (this.ignore && this.ignore(obj)) {
      return undefined;
    }
    const issue = obj;
    const repository = this.repository.split('/').pop();
    issue.externalId = `${repository}-${obj.id}`;
    // We can't specify custom field for Jira, so using labels then run bulk changes afterward.
    // なぜかCustomFieldが指定できないため、ラベルに指定したのち一括置換する。
    issue.labels = [repository, obj.kind];
    issue.priority = obj.priority.charAt(0).toUpperCase() + obj.priority.slice(1);
    issue.issuetype = obj.kind.charAt(0).toUpperCase() + obj.kind.slice(1);
    issue.reporter = UserMapper.userNameOnJira(obj.reporter && obj.reporter.username);
    issue.assignee = UserMapper.userNameOnJira(obj.assignee && obj.assignee.username);
    issue.summary = obj.title;
    issue.status = StateMapper(obj.state);
    const body = AppUtil.markdownToJiraNotation(obj.content.raw);
    issue.description = `Original:\n${this.permalink(obj.id)}\n\n${body}`;
    ['votes', 'watches', 'content', 'kind', 'title', 'links', 'id'].forEach(key => issue[key] = undefined);
    return issue;
  }

  /**
   * fetch all comments of all issues.  It iterates through all issues of the repository.
   * @returns {Promise<void>}
   * @private
   */
  async _fetchAllComments() {
    const fetchComment = index => {
      if (index >= this.issues.length) {
        console.log(`[fetch comments] finished ... ${this.repository}\n-----------`);
        if (this.completion) {
          this.completion(this.repository);
        }
        return;
      }
      const id = this.issues[index].externalId.split('-').pop();
      const fetcher = new BitBucketComments(this.apiPermalink(id));
      console.log(`[fetch comments] ${index}/${this.issues.length} ... ${this.repository}`);
      fetcher.fetchAll(comments => {
        this.issues[index].comments = fetcher.makeExportable(comments);
        fetchComment(index + 1);
      }).then();
    };
    console.log(`[fetch comments] started ... ${this.repository}`);
    fetchComment(0);
  }

  /**
   * fetch all issues of the repository.
   * @param {string} [uri] - issue's api entry point.  using default entry point if it's empty.
   * @returns {Promise<void>}
   */
  async fetchIssues(uri) {
    if (!uri) {
      console.log(`[fetch issues] started ... ${this.repository}`);
      uri = BitBucketIssue.entryPoint(this.repository);
    }
    const options = {
      auth: ApiAuth,
      json: true
    };
    const parseIssueAndFetchNext = async (err, resp, body) => {
      if (err) {
        console.log(`err (${uri}) ... ${err}`);
        return;
      }
      if (!body.values) {
        console.log(`err (${uri}) ... ${body}`);
        setTimeout(() => this.fetchIssues(uri).then(), AppConfig.requestWait);
        return;
      }
      const page = body.page * body.pagelen > body.size ? body.size : body.page * body.pagelen;
      console.log(`[fetch issues] ${page}/${body.size} ... ${this.repository}`);
      // console.log(JSON.stringify(body, null, '  '));
      body.values.forEach(obj => {
        const issue = this._makeExportable(obj);
        if (typeof issue !== 'undefined') {
          this.issues.push(issue);
        }
      });
      if (body.next) {
        this.fetchIssues(body.next).then();
      } else {
        console.log(`[fetch issues] finished ... ${this.repository}\n-----------`);
        this._fetchAllComments().then();
      }
    };
    request.get(uri, options, parseIssueAndFetchNext);
  }
}

module.exports = BitBucketIssue;