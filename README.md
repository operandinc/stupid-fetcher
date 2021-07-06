[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Foperandinc%2Fstupid-fetcher&envs=SECRET%2CENVIRONMENT&SECRETDesc=Do+CMD%2BK+-%3E+Generate+32+Character+Secret.&ENVIRONMENTDesc=This+should+be+set+to+%60production%60+when+running+on+Railway.&ENVIRONMENTDefault=production)

It's really stupid that I need a headless browser to do a GET request in 2021.

Required Environment Variables:
- SECRET (can be anything, must include this in `Authorization` header of request)
- ENVIRONMENT (for prod, use `production`. otherwise, leave empty or omit)

To use, just do a POST to /api/fetch with a JSON document containing a `url` field. The response will contain `content` which is the HTML content of the page.