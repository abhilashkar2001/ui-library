// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  microServiceURL: "https://192.168.0.127:8765", // 192.168.1.21 - old
  maintUrl: "http://MAINTENANCE-SERVICE/apis",

  // microServiceURL: "http://192.168.0.241:8765", // 192.168.1.21
  basePath: "http://192.168.0.14:8081/Icust-Digital-Banking",
  redirectUrl:
    "http://icust.rumango.com/DEV_ROOT/Customer-Onboarding/#/sessions/callback",
  chatBotRedirect:
    "http://icust.rumango.com/DEV_ROOT/Customer-Onboarding/#/others/mainNavigation",
  build: 32,
};
