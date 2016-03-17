var BasePlugin = require('ember-cli-deploy-plugin');
var Rsync = require('rsync');

module.exports = {
  name: 'ember-cli-deploy-scp',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        port: '22',
        directory: 'tmp/deploy-dist/*',
        remoteDir: '/current/web'
      },

      requiredConfig: ['username', 'path', 'host'],

      build: function(context) {
        this.log('Building...');
      },

      upload: function(context) {
        this.log('Uploading...');
        var MyDate = new Date();
        var MyDateString;
        MyDate.setDate(MyDate.getDate());
        MyDateString = ('0' + MyDate.getDate()).slice(-2) + ('0' + (MyDate.getMonth()+1)).slice(-2) + MyDate.getFullYear() + ('0' + MyDate.getHours()).slice(-2) + ('0' + MyDate.getMinutes()).slice(-2);

        var rsync = new Rsync()
          .shell('ssh')
          .flags('rtvu')
          .source(this.readConfig('directory'))
          .destination(this.readConfig('username') + '@' + this.readConfig('host') + ':' + this.readConfig('path') + '/' + MyDateString);

        rsync.execute(function(error, code, cmd) {
            this.log('Done !');
        });

        var rsync_current = new Rsync()
          .shell('ssh')
          .flags('rtvu')
          .source(this.readConfig('directory'))
          .destination(this.readConfig('username') + '@' + this.readConfig('host') + ':' + this.readConfig('path') + this.readConfig('remoteDir'));

        rsync_current.execute(function(error, code, cmd) {
            this.log('Done !');
        });

        this.log('Done !');
      }
    });

    return new DeployPlugin();
  }
};
