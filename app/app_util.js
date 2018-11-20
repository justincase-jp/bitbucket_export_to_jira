'use strict';

// Copyright (c) 2018 justInCase, Inc

class AppUtil {
  /**
   * apply simple conversion from a given markdown text to Jira notation text.
   * @param {string} text - assumes markdown format
   * @returns {string} - Jira notated text
   */
  static markdownToJiraNotation(text) {
    let result = text;
    result = result.replace(/### /g, 'h3. ');
    result = result.replace(/## /g, 'h2. ');
    result = result.replace(/# /g, 'h1. ');
    result = result.replace(/```(\w.?)/g, '{code}');
    result = result.replace(/```/g, '{code}');
    return result;
  }
}

module.exports = AppUtil;
