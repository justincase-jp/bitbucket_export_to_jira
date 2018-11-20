'use strict';

// Copyright (c) 2018 justInCase, Inc

const fs = require('fs');
const BitbucketIssue = require('./app/bitbucket_issue');
const AppConfig = require('./config/app_config');

// setup with repository to be exported.
const repository = `${AppConfig.bitbucketProject.team_id}/${AppConfig.bitbucketProject.repository}`;
const instance = new BitbucketIssue(repository);
instance.ignore = (issue) => {
  if (!AppConfig.issueFilterOptions.state.includes(issue.state)) {
    return true;
  } else if (!AppConfig.issueFilterOptions.kind.includes(issue.kind)) {
    return true;
  }
  return false;
};
instance.completion = () => {
  const output = { 'projects': [{
        ...AppConfig.jiraProject,
        'issues': instance.issues
      }]};
  // A result will be stored in output dir (result by default) as `export.json`
  fs.writeFileSync(`${AppConfig.outputDir}/export.json`, JSON.stringify(output, null, '  '));
};
instance.fetchIssues().then();
