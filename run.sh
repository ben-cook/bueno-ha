#!/command/with-contenv bashio
set -e

CONFIG_PATH=/data/options.json

export ENTITIES="$(bashio::config 'entities')"
export BUENO_INTEGRATION_ID="$(bashio::config 'bueno_integration_id')"
export BUENO_CREDENTIALS="$(bashio::config 'bueno_credentials')"
export BUENO_API_URL="$(bashio::config 'bueno_api_url')"

npm run start