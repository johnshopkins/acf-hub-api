let env = 'production';

const sub = window.location.hostname.split('.').shift();

if (sub === 'staging') {
  env = 'staging';
} else if (sub === 'local') {
  env = 'local';
} else if (sub === 'qa') {
  env = 'qa';
}

module.exports = env;
