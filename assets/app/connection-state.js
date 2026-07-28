(function (root) {
  var storageKey = 'gwdbg.activeConnection';
  var memoryState = null;

  function read() {
    if (memoryState) return Object.assign({}, memoryState);
    try {
      var raw = root.sessionStorage && root.sessionStorage.getItem(storageKey);
      memoryState = raw ? JSON.parse(raw) : null;
    } catch (error) {
      memoryState = null;
    }
    return memoryState ? Object.assign({}, memoryState) : null;
  }

  function write(next) {
    memoryState = next ? Object.assign({}, next) : null;
    try {
      if (!root.sessionStorage) return memoryState;
      if (memoryState) root.sessionStorage.setItem(storageKey, JSON.stringify(memoryState));
      else root.sessionStorage.removeItem(storageKey);
    } catch (error) {}
    return memoryState ? Object.assign({}, memoryState) : null;
  }

  function connect(input) {
    return write({
      model: input.model,
      device: input.device,
      transport: input.transport === '4g' ? '4g' : 'bt',
      connectedAt: Date.now()
    });
  }

  function disconnectBluetooth() {
    var current = read();
    if (current && current.transport === 'bt') write(null);
    return null;
  }

  function switchTransport(transport, input) {
    var current = read() || {};
    if (transport === '4g' && current.transport === 'bt') disconnectBluetooth();
    return connect({
      model: (input && input.model) || current.model || 'E50',
      device: (input && input.device) || current.device || 'E50',
      transport: transport
    });
  }

  root.GWDBG_CONNECTION = {
    get: read,
    connect: connect,
    disconnect: function () { return write(null); },
    disconnectBluetooth: disconnectBluetooth,
    switchTransport: switchTransport
  };
})(typeof window !== 'undefined' ? window : globalThis);
