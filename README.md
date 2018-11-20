# BitBucket issue exporter

Simple node application to export BitBucket issues in order to import them into Jira.

## Setup

- required node version is defined in `.nvmrc`.
- run `nvm use; npm install` to install required module

## Confinguration

- copy `config/api_credential-default.js` as `config/api_credential.js`
    - update `username` and `password` of the bitbucket account to access bitbucket api.
- edit `config/app_config.js` to configure settings to setup a target BitBucket repository.
- edit `config/state_mapper.js` to define issue status mapping between BitBucket and Jira.
- copy `config/user_mapping-sample.json` as `config/user_mapping.json`
    - edit `config/user_mapping.json` to define user mapping between BitBucket and Jira.


## Execution

- run `node export_issues.js`, then result will be exported into `results` directory by default.

## Copyright

[bitbucket_export_to_jira](https://github.com/justincase-jp/bitbucket_export_to_jira) is developed by justInCase, Inc.

Copyright (c) 2018 [justInCase, Inc](https://justincase.jp/)

## License

bitbucket_export_to_jira is released under the MIT-license.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
