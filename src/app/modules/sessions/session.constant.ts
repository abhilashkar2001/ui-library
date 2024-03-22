export interface ApplicationData {
  title: string;
  greeting: string;
}

export class SessionsConstants {
  static readonly APPLICATION_DATA: ApplicationData = {
    title: "Demo Bank",
    greeting: "Welcome to Corporate Net banking!",
  };
}
