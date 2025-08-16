
# Polluted Cities Service

A RESTful Node.js API that returns the most polluted cities by country, cleanses and enriches data with Wikipedia, and follows production-quality standards.

## Features
- **GET /cities**: Returns a paginated list of the most polluted cities, normalized and enriched with Wikipedia descriptions.
- Filters out non-city entries using heuristics and keywords.
- Caches API and Wikipedia results to avoid rate limits.
- Error handling and input validation.

## How to Run
1. Install dependencies:
	 ```
	 npm install
	 ```
2. Start the server:
	 ```
	 npm run dev
	 # or
	 npm start
	 ```
3. The API will be available at `http://localhost:3000/cities`

## Endpoint
### GET /cities
Query parameters:
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `country` (optional)

**Response format:**
```
{
	"page": 1,
	"limit": 10,
	"total": 200,
	"cities": [
		{
            "name": "Katowice",
            "country": "",
            "pollution": 52.8,
            "description": "Katowice is the capital city of the Silesian Voivodeship in southern Poland and the central city of the Katowice urban area. As of 2021, Katowice has an official population of 286,960, and a resident population estimate of around 315,000. Katowice is a central part of the Metropolis GZM, with a population of 2.3 million, and a part of a larger Katowice–Ostrava metropolitan area that extends into the Czech Republic and has a population of around 5 million people, making it one of the most populous metropolitan areas in the European Union."
        }
	]
}
```

## City Validation Logic
- Filters out entries containing keywords like `Station`, `Area`, `Zone`, `District`, `Unknown`, etc.
- Uses Wikipedia API to confirm if an entry is a city (checks Wikipedia's `type` field and description).
- Only entries with valid city names and Wikipedia confirmation are returned.

## Limitations & Assumptions
- Some false positives/negatives may occur due to imperfect heuristics and Wikipedia data.
- Rate limits on external APIs are handled via in-memory caching, but may still affect high-frequency requests.
- Assumes pollution API and Wikipedia are available and responsive.

## Credentials
- Pollution API: [https://be-recruitment-task.onrender.com](https://be-recruitment-task.onrender.com)
	- Username: `testuser`
	- Password: `testpass`

## License
MIT


