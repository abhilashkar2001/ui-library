// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  microServiceURL: 'https://192.168.131.27:4200/api', // 192.168.1.21 - old
  parentAppUrl: 'http://192.168.131.27:4200',
  build: 33,
  SECRET_KEY:
    'e1cd356f6de53babfef423718f055d8034d5d580c4196f6c5f230e2ee395133b',
};
