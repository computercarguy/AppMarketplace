This is currently a work in progress, so use this at your own risk. I wouldn't even call it beta, as there's still functionality I need to write, as well as adding automated tests, documentation, and even fully testing everything from the ground up.

# App Marketplace

## Eric's Gear

### By Eric Ingamells

This utility is designed to be a gathering of other apps that require payment for their use. It can be one time use, pas as you go, monthly subscriptions, or whatever. In this utility, the main idea for payments is a credit. The credit can be any monetary amount, but it will be the same for all apps for easy usage. Each app can use different amounts of credits, so there is some ability to change how much each app costs.

One of the key features of this utility is that it uses the NodeOAuth2 API for login to allow multiple apps to use the same login information. This prevents duplication of effort for the programmer having to recreate login functionality for every app, as well as preventing duplication on the part of the user in having to register for every single app individually. There will still be some duplication, since each app will need to be able to login from their own hosting site. Some duplication can still occur with the user will having to login on each site, if they don't log into this utility first and link to the utility they want to use.

That last sentence is a little confusing, so I'll try to explain it better. The user will have to use this utility to create a account, but once they do, they can go to each app URI and login in there without having to use this utility. By doing that, they will have to log into each app individually. Using the "Utilities" page of this app, the user can login once and by choosing an app to visit, their credentials/token will be transmitted to the app so they don't have to login again.

When they use the same login across various apps, they can simply log out in one app, or this utility, and they will be logged out on all other apps and this utility.

To help simplfy logins, the apps can access this utility for their login needs, rather than directly accessing the NodeOAuth2 API. The login information is simply passed through this interface to the NodeOAuth2 API and back again. This way you don't have to keep track of which API to access when, you just access this API for both logins and credits/payments. You also don't have to change each individual app if you change the login API for this utility. If you find a different/better/easier login API to use for this utility, you can switch to it by making changes to only this utility and not the other apps, as long as you point those apps to this utility for their login functionality.

Another key feature is that this utility prevents the duplication of payment method integrations. The app developer doesn't have to repeat the same integration across multiple apps, and the user doesn't have to duplicate entry of their payment method in every app. Some payment methods are fairly simple to reuse as a user, like PayPal and Stripe, where the same account can be used across multiple apps, not not every payment processor is that simple to use. Integrating payment methods are usually fairly time intensive to create and test, since they can have so many parts to implement for security. This utility just tries to simplify that by using a single interface for all apps that need it.
