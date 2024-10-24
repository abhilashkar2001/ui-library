// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  microServiceURL: "https://192.168.0.26:4210/api", // 192.168.1.21 - old
  build: 33
};
