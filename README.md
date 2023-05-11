## Clean Installation

* `npm install` (from the project base folder) to install server dependencies. I recommend node v17.4.x or higher
* Add your OpenAPI key to the `.env` file:

```
OPENAI_API_KEY=<your key here>
```

## Running Locally

* (From the project base folder): `npm start`
* This service runs on :2020 (as defined in the `start` script in `package.json`)

Then, you can hit the healthcheck to verify that it's running:

`http://localhost:2020/healthcheck`

## APIs

Once running, you can hit the magic APIs locally from here:

`localhost:2020/api/magic/...`
