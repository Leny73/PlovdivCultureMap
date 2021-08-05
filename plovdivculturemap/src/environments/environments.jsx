
export const environment = {
    production: false,
    apiServerUrl: 'http://127.0.0.1:5000', // the running FLASK api server url
    auth0: {
      url: 'twbm.eu', // the auth0 domain prefix
      audience: 'capstone', // the audience set for the auth0 app
      clientId: 'aGu0hcE53n4V0YLEn7cIG8PAs0dBJiiy', // the client id generated for the auth0 app
      callbackURL: 'http://localhost:3000', // the base url of the running ionic application. 
    }
  };