import { useAccount, useConnectors } from "@starknet-react/core";

export default function Wallet() {
  const { isConnected, address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  if (isConnected) {
    return (
      <div>
        <p>{address}</p>
        <button type="button" onClick={disconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          type="button"
          key={connector.id()}
          onClick={() => {
            connect(connector);
            connector.disconnect;
          }}
        >
          {connector.id()}
        </button>
      ))}
    </div>
  );
}
