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

`GET http://localhost:2020/healthcheck`

## APIs

Once running, you can hit the magic API locally from here:

`POST localhost:2020/api/magic/curl/v1`

```
{
	query: "Write me an API to schedule a zoom meeting"
}
```

## Notes

* This API involves multiple chained LLM calls, and so may take a few seconds to complete! Please be patient.
