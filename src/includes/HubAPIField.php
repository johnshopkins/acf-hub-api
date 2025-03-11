<?php

class HubAPIField extends \acf_field
{
  /**
   * Types of API content that is selectable in the API field
   * @var array
   */
  protected array $contentTypes = [
    'announcements' => 'announcements',
    'announcement_categories' => 'announcement categories',
    'articles' => 'articles',
    'campaigns' => 'campaigns',
    'channels' => 'channels',
    'departments' => 'departments',
    'divisions' => 'divisions',
    'events' => 'events',
    'event_categories' => 'event categories',
    'faculty_expert_topics' => 'faculty_expert_topics',
    'galleries' => 'galleries',
    'issues' => 'issues',
    'locations' => 'locations',
    'people' => 'people',
    'promos' => 'promos',
    'tags' => 'tags',
    'topics' => 'topics',
    'videos' => 'videos',
  ];

  public function __construct()
  {
    if (!defined('HUB_API_KEY') || !defined('HUB_API_VERSION')) {
      new WP_Error('no_auth', 'Hub API key and/or version not set. Hub API Field cannot function.');
      return;
    }

    // native JS fetch() method may be used on certain domains
    $this->useFetch = defined('HUB_API_PLUGIN_USE_FETCH') && HUB_API_PLUGIN_USE_FETCH === true;

    $this->name = 'hubapi_content_picker';
    $this->label = __('Hub API Content Picker', "acf-{$this->name}");
    $this->category = 'content';

    parent::__construct();
  }

  protected function renderCollections($available, $currentValue, $placeholder)
  {
    if (!empty($available)) {

      echo "<option value=''>- choose - </option>";

      foreach ($available as $type) {
        $selected = $type === $currentValue ? "selected='selected'" : "";
        echo "<option value='{$type}' {$selected}>{$type}</option>";
      }

    }
  }

  public function render_field($field)
  {
    $fields = array_map(function ($part) use ($field) {
      $data = [
        'type' => $part === 'id' ? 'Number' : 'Select',
        'props' => [
          'id' => $part .'-'. $field['id'],
          'name' => $field['name'] .'['. $part .']',
          'label' => $part === 'id' ? 'ID': $part,
          'value' => $field['value'][$part] ?? '',
        ]
      ];

      if (in_array($part, ['collection', 'subcollection'])) {
        $data['props']['options'] = $field[$part .'_content_types'];
      }

      return $data;
    }, $field['endpoint_parts']);

    $fields[] = [
      'type' => 'Hidden',
      'props' => [
        'id' => 'valid-'. $field['id'],
        'name' => $field['name'] .'[valid]',
        'label' => 'valid',
        'value' => $field['value']['valid'] ?? '',
      ]
    ];

    $data = [
      'fields' => $fields,
      'allowPreview' => $field['allow_preview'] ?? false,
      'auth' => [
        'key' => HUB_API_KEY,
        'v' => HUB_API_VERSION,
      ],
      'useFetch' => $this->useFetch,
    ];

    echo '<div class="hub-api-field count-'. count($field['endpoint_parts']) .'">';
    echo '<script type="application/json" id="acfcloneindex">'. wp_json_encode($data) .'</script>';
    echo '</div>';
  }

  public function validate_value($valid, $value, $field, $input): bool
  {
    $collection = in_array('collection', $field['endpoint_parts'], true);
    $id = in_array('id', $field['endpoint_parts'], true);
    $subcollection = in_array('subcollection', $field['endpoint_parts'], true);

    // if not required and none of the fields are filled out, return true
    if (!$field['required'] && empty(array_filter(array_values($value)))) {
      return true;
    }

    if ($collection && $id && $subcollection) {

      // collection is always required
      if (empty($value['collection'])) {
        return 'Please choose a collection.';
      }

      // If ID provided, subcollection is required
      if (!empty($value['id']) && empty($value['subcollection'])) {
        return 'Please choose a subcollection.';
      }

      // If subcollection is provided, id is required
      if (!empty($value['subcollection']) && empty($value['id'])) {
        return 'Please speciffy an ID.';
      }

    } elseif ($collection && $id) {

      // make sure collection AND id have values
      if (empty($value['collection']) || empty($value['id'])) {
        return 'Both collection and ID are required.';
      }

    } elseif ($collection) {

      // make sure collection has a value
      if (empty($value['collection'])) {
        return 'Please choose a collection.';
      }

    }

    if ($value['valid'] === 'false') {
      // fields are all there, but the item was not found in the API
      return 'This item does not exist in the Hub.';
    }

    return true;
  }

  public function update_value($value, $post_id, $field)
  {
    // remove spaces from ID field
    if (isset($value['id'])) {
      $value['id'] = preg_replace('/\s/', '', $value['id']);
    }

    return $value;
  }

  public function load_value($value)
  {
    if (is_array($value)) {
      unset($value['valid']);
    }

    if (isset($value['id'])) {
      $value['id'] = (int) $value['id'];
    }
    
    return $value;
  }

  public function input_admin_enqueue_scripts(): void
  {
    $assets = require dirname(__DIR__, 2) . '/build/index.asset.php';

    if ($this->useFetch) {
      // remove fetch-jsonp if it's not needed
      $key = array_search('fetch-jsonp', $assets['dependencies']);
      if ($key !== false) {
        unset($assets['dependencies'][$key]);
      }
    }

    // add ACF (for cloned field index replacement)
    $assets['dependencies'][] = 'acf';

    $path = plugin_dir_url(dirname(__DIR__)) . 'build';

    wp_register_script('fetch-jsonp', $path . '/fetch-jsonp.js');
    wp_enqueue_script('hub-api-content-picker', $path . '/index.js', $assets['dependencies'], $assets['version']);
    wp_enqueue_style('hub-api-content-picker', $path . '/index.css');
  }

  public function render_field_settings($field)
  {
    acf_render_field_setting($field, ['label' => 'Allow unpublished content',
      'name' => 'allow_preview',
      'type' => 'true_false',
      'ui' => 1,]);

    acf_render_field_setting($field, [
      'label' => 'API endpoint',
      'instructions' => 'Which parts of the API endpoint should be included?',
      'type' =>  'checkbox',
      'name' => 'endpoint_parts',
      'layout' => 'horizontal',
      'choices' => [
        'collection' => 'Collection',
        'id' => 'ID',
        'subcollection' => 'Subcollection'
      ],
    ]);

    acf_render_field_setting($field, [
      'label' => 'Available collection content types',
      'type' =>  'checkbox',
      'name' => 'collection_content_types',
      'layout' => 'horizontal',
      'choices' => $this->contentTypes
    ]);

    acf_render_field_setting($field, [
      'label' => 'Available subcollection content types',
      'type' =>  'checkbox',
      'name' => 'subcollection_content_types',
      'layout' => 'horizontal',
      'choices' => $this->contentTypes
    ]);
  }
}
