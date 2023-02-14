# Hub API Content Picker

Advanced Custom field that enables users to select content from the Hub API.

## Installation via Composer

In your composer.json file, be sure to let Composer know where to install WordPress plugins:
```json
{
  "extra": {
    "installer-paths": {
      "path/tp/plugins/{$name}/": [
        "type:wordpress-plugin"
      ]
    }
  }
}
```
Require the plugin:
```bash
composer require johnshopkins/acf-hub-api
  ```
In wp-config.php or your theme's functions file, define your Hub auhthentication:
```php
const HUB_API_KEY = '{your_api_key}';
const HUB_API_VERSION = 1;
```
Activate the plugin in WordPress.

## Field value

When getting the value of the field, you will receive an array with endpoint parts, like so:

```php
[
  'collection' => string 'tags',
  'id' => int 384,
  'subcollection' => string 'articles'
]
```
It is up to your theme to query the API and fetch the results.
