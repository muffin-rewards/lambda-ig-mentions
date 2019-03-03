# Lambda IG Mentions
Webhook for IG mentions apis.

Computes `sha1` signature out of the raw body and app secret. If the signature
matches the value of `X-Hub-Signature` header sent with the request, it makes
a request to the IG mentions endpoint to gather more data about the media. Then
it stores it into DynamoDB.

## Deployment
To deploy for production, run `npm run deploy:prod`.

## Request
A request has to have `X-Hub-Signature` header in format `sha1=${token}`.

## Response
Intercepts the request and returns `403` if the signatures don't match.

