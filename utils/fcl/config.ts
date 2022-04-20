import {config} from "@onflow/config"

export function MainnetConfig() {
    config().put("accessNode.api", "https://access-mainnet-beta.onflow.org")
  return null
}

MainnetConfig()
