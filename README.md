# Lambda IG Mentions
Webhook for IG mentions apis.

Computes `sha1` signature out of the raw body and app secret. If the signature
matches the value of `X-Hub-Signature` header sent with the request, it makes
a request to the IG mentions endpoint to gather more data about the media. Then
it stores it into DynamoDB.

## Deployment
To deploy for production, run `npm run deploy:prod`.

### Enviroment variables
- `APP_ID` is Instagram app id
- `APP_SECRET` is token associated with app

## Request
A request has to have `X-Hub-Signature` header in format `sha1=${token}`.
It also has to have a query parameter `promoter` with promoter handle.

## Response
If the signatures don't match returns `403`.

If the promoter id is missing returns `422`.

Any unexcepted error returns `500`.

If everything is ok returns `200`.
