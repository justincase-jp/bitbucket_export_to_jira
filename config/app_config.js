'use strict';

class AppConfig {
  /**
   * Output destination directory / 結果出力先ディレクトリ
   * @returns {string}
   */
  static get outputDir() {
    return 'results';
  }

  /**
   * Configuration of target repository on BitBucket / 対象となる BitBucket のリポジトリ情報
   * @returns {{team_id: string, repository: string}}
   */
  static get bitbucketProject() {
    return {
      'team_id': 'xxxxxx',
      'repository': 'xxxxxx',
    }
  }

  /**
   * Information about a target project on Jira / ターゲットとなる Jira のプロジェクト情報
   * @returns {{name: string, key: string, description: string, type: string, template: null}}
   */
  static get jiraProject() {
    return {
      'name': 'Jira test',
      'key': 'JT',
      'description': 'justInCase bitbucket issue exporter',
      'type': 'software',
      'template': null,
    }
  }

  /**
   * Configuration of criteria determines which issues will be exported / 対象となる issue の条件を設定します
   * @returns {{state: string[], kind: string[]}}
   */
  static get issueFilterOptions() {
    return {
      'state': ['open', 'new'],
      'kind': ['bug', 'enhancement', 'proposal', 'task'],
    }
  }

  /**
   * Wait factor for resending requests (in ms) / リクエストを再送する際の待ち時間 (ms 単位)
   * Sequential request may be refused by BitBucket API, so we need some wait to avoid this.
   * @returns {number}
   */
  static get requestWait() {
    return Math.floor(1000 * (1 + Math.random()));
  }
}

module.exports = AppConfig;