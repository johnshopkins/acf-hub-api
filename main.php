<?php
/*
Plugin Name: Hub API Content Picker
Description: Advanced Custom field that enables users to select content from the Hub API
Author: Jen Wachter
Version: 2.11.1
*/

// exit if accessed directly
if (!defined('ABSPATH')) {
  exit;
}

add_action('init', function () {
  if (!function_exists('acf_register_field_type')) {
    return;
  }

  add_action('admin_notices', function () {
    $missing = array_map(function ($constant) {
      return !defined($constant) ? $constant : null;
    }, ['HUB_API_KEY', 'HUB_API_VERSION']);
    $missing = array_filter($missing);

    if (!empty($missing)) {
      $message = '<strong>Hub API ACF field plugin</strong>: Please configure the ';
      $message .= implode(' and ', $missing) . ' ';
      $message .= count($missing) > 1 ? 'constants' : 'constant';
      $message .= ' to use the field.';

      echo '<div class="error notice">';
      echo '<p>'. $message .'</p>';
      echo '</div>';
    }
  });

  require_once __DIR__ . '/src/includes/HubAPIField.php';
  acf_register_field_type('HubAPIField');
});
