# Endangered Animals

Scrapped data from the WWF 🐼 website.

```ts
type Data = { 
  Population: Number,
  'Scientific Name': String,
  Height: String,
  Weight: String,
  Length: String,
  Habitats: String,
  description: String,
  locations: String[],
  name: String,
  Status: String
}
```
## API Useage

```curl
GET https://wwf-animals.netlify.app/.netlify/functions/find?name=arctic%20fox
```

### Query Params
1. find: The animal you want returned

### Response

```json
{
  "Status": "Least Concern",
  "Population": null,
  "Scientific Name": "<em>Vulpes  lagopus</em>",
  "Height": "11 inches",
  "Weight": "3 to 20 pounds",
  "Length": "18 to 27 inches",
  "Habitats": "Tundra",
  "description": "The Arctic fox is primarily a carnivore that lives inland, away from the coasts. They are dependent on the presence of smaller animals (most often lemmings) to survive.&nbsp; Arctic foxes also hunt for sea birds, fish, and other marine life. Smaller rodent populations waver between times of abundance and scarcity, which leaves the Arctic fox vulnerable when these creatures are low in numbers.",
  "locations": [
    null
  ],
  "name": "Arctic Fox"
}
```
