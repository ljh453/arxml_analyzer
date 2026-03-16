(function (globalScope) {
  const BSW_GROUPS = {
    services: ["BswM", "ComM", "Det", "Dem", "Dcm", "E2E", "EcuM", "FiM", "StbM", "WdgM", "Crc", "Csm", "SecOC", "Xcp", "Os", "SchM"],
    communication: ["CanIf", "CanTp", "CanNm", "CanSM", "Com", "ComXf", "PduR", "IpduM", "SoAd", "DoIP", "Sd", "TcpIp", "UdpNm", "Nm", "LinIf", "LinTp", "LinSM", "FrIf", "FrTp", "FrNm", "EthIf", "EthSM", "J1939Tp"],
    memory: ["NvM", "MemIf", "Fee", "Ea", "Eep"],
    ecuAbstraction: ["IoHwAb", "CanTrcv", "EthTrcv", "LinTrcv", "FrTrcv", "WdgIf", "MemAcc"],
    mcal: ["Adc", "Can", "Dio", "Eth", "Fls", "Gpt", "Icu", "Lin", "Mcu", "Port", "Pwm", "Spi", "Wdg", "Ocu"],
  };

  const INTERACTION_LANE_LABELS = {
    application: "Application SWCs",
    bswService: "BSW Services",
    complex: "Complex Drivers",
    other: "Other Components",
  };

  function sanitizeIdentifier(value) {
    return String(value || "").replace(/[^A-Za-z0-9]/g, "").trim();
  }

  function classifyBswModule(rawName) {
    const name = sanitizeIdentifier(rawName);
    if (!name) return "";
    for (const [group, modules] of Object.entries(BSW_GROUPS)) {
      if (modules.some((moduleName) => sanitizeIdentifier(moduleName) === name)) return group;
    }
    if (name.includes("Trcv") || name.includes("HwAb")) return "ecuAbstraction";
    if (["Can", "Lin", "Eth", "Spi", "Dio", "Mcu", "Port", "Adc", "Pwm", "Icu", "Gpt", "Wdg"].includes(name)) return "mcal";
    if (name.includes("If") || name.includes("Tp") || name.includes("Nm") || name === "Com" || name === "PduR") return "communication";
    return "";
  }

  function shortNameFromRef(reference) {
    return String(reference || "").split("/").filter(Boolean).at(-1) || "";
  }

  function inferKindFromDest(typeDest, typePath) {
    if (typeDest === "COMPLEX-DEVICE-DRIVER-SW-COMPONENT-TYPE") return "CDD";
    if (typeDest === "SERVICE-SW-COMPONENT-TYPE") return "BSW Service";
    if (typeDest === "APPLICATION-SW-COMPONENT-TYPE") return "SWC";
    if (String(typePath).includes("Cdd") || String(typePath).includes("CDD")) return "CDD";
    if (String(typePath).includes("Service") || String(typePath).includes("Dcm") || String(typePath).includes("Dem") || String(typePath).includes("NvM")) return "BSW Service";
    return "SWC";
  }

  function inferLaneFromKind(kind) {
    if (kind === "CDD") return "complex";
    if (kind === "BSW Service") return "bswService";
    if (kind === "SWC") return "application";
    return "other";
  }

  function buildInteractionNode(instance, type, fallbackOrder) {
    const kind = type?.kind || inferKindFromDest(instance.typeDest, instance.typePath);
    const lane = type?.lane || inferLaneFromKind(kind);
    return {
      id: instance.path || instance.typePath || instance.name,
      path: instance.path || instance.typePath || instance.name,
      name: type?.name || shortNameFromRef(instance.typePath) || instance.name,
      instanceName: instance.name,
      kind,
      lane,
      packagePath: type?.packagePath || instance.packagePath,
      fileName: type?.fileName || instance.fileName,
      typePath: instance.typePath,
      order: Number.isFinite(instance.order) ? instance.order : fallbackOrder,
      portCount: type?.ports.length || 0,
    };
  }

  function resolveConnection(connector, nodeMap, portMap, index) {
    const sourceNode = nodeMap.get(connector.providerComponentRef);
    const targetNode = nodeMap.get(connector.requesterComponentRef);
    if (!sourceNode || !targetNode) return null;
    const providerPort = portMap.get(connector.providerPortRef);
    const requesterPort = portMap.get(connector.requesterPortRef);
    const interfaceName = providerPort?.interfaceName || requesterPort?.interfaceName || shortNameFromRef(providerPort?.interfacePath || requesterPort?.interfacePath);
    return {
      id: [connector.name, sourceNode.id, targetNode.id, connector.providerPortRef, connector.requesterPortRef, index].join("|"),
      name: connector.name,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      sourceName: sourceNode.name,
      targetName: targetNode.name,
      sourceInstance: sourceNode.instanceName,
      targetInstance: targetNode.instanceName,
      interfaceName: interfaceName || "-",
      providerPortName: providerPort?.name || shortNameFromRef(connector.providerPortRef) || "-",
      requesterPortName: requesterPort?.name || shortNameFromRef(connector.requesterPortRef) || "-",
      fileName: connector.fileName,
      compositionPath: connector.compositionPath,
      order: Number.isFinite(connector.order) ? connector.order : index,
    };
  }

  function buildInteractionLanes(nodes) {
    return ["application", "bswService", "complex", "other"]
      .map((laneId) => ({ id: laneId, label: INTERACTION_LANE_LABELS[laneId], nodes: nodes.filter((node) => node.lane === laneId) }))
      .filter((lane) => lane.nodes.length > 0);
  }

  function dedupeBy(items, getKey) {
    const seen = new Set();
    const result = [];
    items.forEach((item) => {
      const key = getKey(item);
      if (seen.has(key)) return;
      seen.add(key);
      result.push(item);
    });
    return result;
  }

  function mergeInteractionData(parsedFiles) {
    const successfulFiles = parsedFiles.filter((entry) => entry.ok);
    const componentTypes = dedupeBy(successfulFiles.flatMap((entry) => entry.interaction.componentTypes), (item) => item.path);
    const componentInstances = dedupeBy(successfulFiles.flatMap((entry) => entry.interaction.componentInstances), (item) => item.path);
    const connectors = dedupeBy(
      successfulFiles.flatMap((entry) => entry.interaction.connectors),
      (item) => [item.name, item.providerComponentRef, item.requesterComponentRef, item.providerPortRef, item.requesterPortRef].join("|")
    );
    const typeMap = new Map(componentTypes.map((item) => [item.path, item]));
    const portMap = new Map();

    componentTypes.forEach((type) => {
      type.ports.forEach((port) => {
        portMap.set(port.path, { ...port, componentPath: type.path, componentName: type.name, componentLane: type.lane });
      });
    });

    let nodes = componentInstances.map((instance, index) => buildInteractionNode(instance, typeMap.get(instance.typePath), index));
    if (!nodes.length) {
      nodes = componentTypes.map((type, index) => ({
        id: type.path,
        path: type.path,
        name: type.name,
        instanceName: type.name,
        kind: type.kind,
        lane: type.lane,
        packagePath: type.packagePath,
        fileName: type.fileName,
        typePath: type.path,
        order: Number.isFinite(type.order) ? type.order : index,
        portCount: type.ports.length,
      }));
    }

    nodes = dedupeBy(nodes, (item) => item.id).slice().sort((left, right) => left.order - right.order || left.name.localeCompare(right.name));
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const allConnections = connectors.map((connector, index) => resolveConnection(connector, nodeMap, portMap, index)).filter(Boolean);
    const connectedServiceNodeIds = new Set();

    allConnections.forEach((connection) => {
      const sourceNode = nodeMap.get(connection.sourceId);
      const targetNode = nodeMap.get(connection.targetId);
      if (sourceNode?.lane === "bswService" && targetNode?.lane === "application") connectedServiceNodeIds.add(sourceNode.id);
      if (targetNode?.lane === "bswService" && sourceNode?.lane === "application") connectedServiceNodeIds.add(targetNode.id);
    });

    const visibleNodes = nodes.filter((node) => node.lane !== "bswService" || connectedServiceNodeIds.has(node.id));
    const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
    const connections = allConnections.filter((connection) => visibleNodeIds.has(connection.sourceId) && visibleNodeIds.has(connection.targetId));
    const inboundCount = new Map();
    const outboundCount = new Map();

    connections.forEach((connection) => {
      outboundCount.set(connection.sourceId, (outboundCount.get(connection.sourceId) || 0) + 1);
      inboundCount.set(connection.targetId, (inboundCount.get(connection.targetId) || 0) + 1);
    });

    const enrichedNodes = visibleNodes.map((node) => ({ ...node, incomingCount: inboundCount.get(node.id) || 0, outgoingCount: outboundCount.get(node.id) || 0 }));
    return { nodes: enrichedNodes, connections, lanes: buildInteractionLanes(enrichedNodes), unresolvedConnectors: connectors.length - allConnections.length };
  }

  const api = {
    BSW_GROUPS,
    INTERACTION_LANE_LABELS,
    sanitizeIdentifier,
    classifyBswModule,
    shortNameFromRef,
    inferKindFromDest,
    inferLaneFromKind,
    buildInteractionNode,
    resolveConnection,
    buildInteractionLanes,
    dedupeBy,
    mergeInteractionData,
  };

  globalScope.ArxmlAnalyzerCore = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
