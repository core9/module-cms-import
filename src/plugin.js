angular.module( 'core9Dashboard.import', [
  'core9.importer',
  'core9.importer.csv',
  'templates-module-cms-import'
]);

angular.module('core9Dashboard.admin.dashboard').requires.push('core9Dashboard.import');