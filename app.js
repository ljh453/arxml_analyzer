const Core = globalThis.ArxmlAnalyzerCore;

if (!Core) {
  throw new Error("ArxmlAnalyzerCore is not loaded. Ensure core.js is included before app.js.");
}

const APPLICATION_TYPES = new Set([
  "APPLICATION-SW-COMPONENT-TYPE",
  "COMPOSITION-SW-COMPONENT-TYPE",
  "SERVICE-SW-COMPONENT-TYPE",
  "SENSOR-ACTUATOR-SW-COMPONENT-TYPE",
  "NV-BLOCK-SW-COMPONENT-TYPE",
  "CALPRM-SW-COMPONENT-TYPE",
  "PARAMETER-SW-COMPONENT-TYPE",
]);

const COMPLEX_DRIVER_TYPES = new Set([
  "COMPLEX-DEVICE-DRIVER-SW-COMPONENT-TYPE",
]);

const SERVICE_COMPONENT_TYPES = new Set([
  "SERVICE-SW-COMPONENT-TYPE",
]);

const INTERFACE_TYPES = new Set([
  "SENDER-RECEIVER-INTERFACE",
  "CLIENT-SERVER-INTERFACE",
  "MODE-SWITCH-INTERFACE",
  "PARAMETER-INTERFACE",
  "NV-DATA-INTERFACE",
  "TRIGGER-INTERFACE",
]);

const RTE_SUPPORT_TYPES = new Set([
  "P-PORT-PROTOTYPE",
  "R-PORT-PROTOTYPE",
  "ASSEMBLY-SW-CONNECTOR",
  "DELEGATION-SW-CONNECTOR",
  "RUNNABLE-ENTITY",
  "VARIABLE-DATA-PROTOTYPE",
]);

const BSW_GROUPS = Core.BSW_GROUPS;

const BSW_LABELS = {
  services: "Services",
  communication: "Communication Stack",
  memory: "Memory Stack",
  ecuAbstraction: "ECU Abstraction",
  mcal: "MCAL",
};

const INTERACTION_LANE_LABELS = Core.INTERACTION_LANE_LABELS;

const DEFAULT_INTERACTION_LAYOUT = {
  columnGap: 72,
  laneHeight: 188,
};

const REFERENCE_ARCHITECTURE_MAP = {
  systemServices: ["BswM", "ComM", "Det", "Dem", "EcuM", "FiM", "StbM", "WdgM", "Os", "SchM"],
  memoryServices: ["NvM"],
  cryptoServices: ["Csm", "Crc", "E2E", "SecOC"],
  offboardServices: ["Dcm", "Xcp", "DoIP", "Sd"],
  communicationServices: ["Com", "ComXf", "PduR", "CanTp", "CanNm", "CanSM", "Nm", "SoAd", "TcpIp", "UdpNm", "LinTp", "LinSM", "FrTp", "FrNm", "EthSM", "J1939Tp"],
  onboardDeviceAbstraction: ["MemAcc"],
  memoryHardwareAbstraction: ["MemIf"],
  cryptoHardwareAbstraction: [],
  wirelessHardwareAbstraction: [],
  communicationHardwareAbstraction: ["CanIf", "LinIf", "FrIf", "EthIf", "CanTrcv", "LinTrcv", "FrTrcv", "EthTrcv"],
  ioHardwareAbstraction: ["IoHwAb", "WdgIf"],
  microcontrollerDrivers: ["Mcu", "Port", "Ocu", "Wdg"],
  memoryDrivers: ["Fee", "Ea", "Eep", "Fls"],
  cryptoDrivers: [],
  wirelessDrivers: [],
  communicationDrivers: ["Can", "Lin", "Eth"],
  ioDrivers: ["Adc", "Dio", "Gpt", "Icu", "Pwm", "Spi"],
};

const REFERENCE_ARCHITECTURE_FALLBACK = {
  services: "systemServices",
  communication: "communicationServices",
  memory: "memoryServices",
  ecuAbstraction: "onboardDeviceAbstraction",
  mcal: "microcontrollerDrivers",
  unknownBsw: "systemServices",
};

const REFERENCE_AREA_RENDER_CONFIG = [
  ["systemServices", "referenceSystemServices", "System Services 모듈이 없습니다."],
  ["memoryServices", "referenceMemoryServices", "Memory Services 모듈이 없습니다."],
  ["cryptoServices", "referenceCryptoServices", "Crypto Services 모듈이 없습니다."],
  ["offboardServices", "referenceOffboardServices", "Off-board Communication Services 모듈이 없습니다."],
  ["communicationServices", "referenceCommunicationServices", "Communication Services 모듈이 없습니다."],
  ["onboardDeviceAbstraction", "referenceOnboardDeviceAbstraction", "Onboard Device Abstraction 모듈이 없습니다."],
  ["memoryHardwareAbstraction", "referenceMemoryHardwareAbstraction", "Memory Hardware Abstraction 모듈이 없습니다."],
  ["cryptoHardwareAbstraction", "referenceCryptoHardwareAbstraction", "Crypto Hardware Abstraction 모듈이 없습니다."],
  ["wirelessHardwareAbstraction", "referenceWirelessHardwareAbstraction", "Wireless Communication HW Abstraction 모듈이 없습니다."],
  ["communicationHardwareAbstraction", "referenceCommunicationHardwareAbstraction", "Communication Hardware Abstraction 모듈이 없습니다."],
  ["ioHardwareAbstraction", "referenceIoHardwareAbstraction", "I/O Hardware Abstraction 모듈이 없습니다."],
  ["microcontrollerDrivers", "referenceMicrocontrollerDrivers", "Microcontroller Drivers 모듈이 없습니다."],
  ["memoryDrivers", "referenceMemoryDrivers", "Memory Drivers 모듈이 없습니다."],
  ["cryptoDrivers", "referenceCryptoDrivers", "Crypto Drivers 모듈이 없습니다."],
  ["wirelessDrivers", "referenceWirelessDrivers", "Wireless Communication Drivers 모듈이 없습니다."],
  ["communicationDrivers", "referenceCommunicationDrivers", "Communication Drivers 모듈이 없습니다."],
  ["ioDrivers", "referenceIoDrivers", "I/O Drivers 모듈이 없습니다."],
];

const INTERACTION_REFERENCE_AREAS = [
  { key: "systemServices", label: "System Services", toneClass: "service-cell", areaClass: "area-system-services" },
  { key: "memoryServices", label: "Memory Services", toneClass: "service-cell", areaClass: "area-memory-services" },
  { key: "cryptoServices", label: "Crypto Services", toneClass: "service-cell", areaClass: "area-crypto-services" },
  { key: "offboardServices", label: "Off-board Communication Services", toneClass: "service-cell", areaClass: "area-offboard-services" },
  { key: "communicationServices", label: "Communication Services", toneClass: "service-cell", areaClass: "area-communication-services" },
  { key: "ioHardwareAbstraction", label: "I/O Hardware Abstraction", toneClass: "abstraction-cell", areaClass: "area-io-hardware" },
  { key: "complexDrivers", label: "Complex Drivers", toneClass: "complex-cell", areaClass: "area-complex-drivers" },
  { key: "onboardDeviceAbstraction", label: "Onboard Device Abstraction", toneClass: "abstraction-cell", areaClass: "area-onboard-device" },
  { key: "memoryHardwareAbstraction", label: "Memory Hardware Abstraction", toneClass: "abstraction-cell", areaClass: "area-memory-hardware" },
  { key: "cryptoHardwareAbstraction", label: "Crypto Hardware Abstraction", toneClass: "abstraction-cell", areaClass: "area-crypto-hardware" },
  { key: "wirelessHardwareAbstraction", label: "Wireless Communication HW Abstraction", toneClass: "abstraction-cell", areaClass: "area-wireless-hardware" },
  { key: "communicationHardwareAbstraction", label: "Communication Hardware Abstraction", toneClass: "abstraction-cell", areaClass: "area-communication-hardware" },
  { key: "microcontrollerDrivers", label: "Microcontroller Drivers", toneClass: "driver-cell", areaClass: "area-microcontroller-drivers" },
  { key: "memoryDrivers", label: "Memory Drivers", toneClass: "driver-cell", areaClass: "area-memory-drivers" },
  { key: "cryptoDrivers", label: "Crypto Drivers", toneClass: "driver-cell", areaClass: "area-crypto-drivers" },
  { key: "wirelessDrivers", label: "Wireless Communication Drivers", toneClass: "driver-cell", areaClass: "area-wireless-drivers" },
  { key: "communicationDrivers", label: "Communication Drivers", toneClass: "driver-cell", areaClass: "area-communication-drivers" },
  { key: "ioDrivers", label: "I/O Drivers", toneClass: "driver-cell", areaClass: "area-io-drivers" },
];

const INTERACTION_REFERENCE_AREA_LABELS = Object.fromEntries(INTERACTION_REFERENCE_AREAS.map((area) => [area.key, area.label]));

const DEMO_XML = `<?xml version="1.0" encoding="UTF-8"?>
<AUTOSAR xmlns="http://autosar.org/schema/r4.0">
  <AR-PACKAGES>
    <AR-PACKAGE>
      <SHORT-NAME>Interfaces</SHORT-NAME>
      <ELEMENTS>
        <SENDER-RECEIVER-INTERFACE>
          <SHORT-NAME>VehicleState_I</SHORT-NAME>
          <DATA-ELEMENTS>
            <VARIABLE-DATA-PROTOTYPE>
              <SHORT-NAME>VehicleSpeed</SHORT-NAME>
            </VARIABLE-DATA-PROTOTYPE>
          </DATA-ELEMENTS>
        </SENDER-RECEIVER-INTERFACE>
        <CLIENT-SERVER-INTERFACE>
          <SHORT-NAME>DiagnosticEvent_I</SHORT-NAME>
          <OPERATIONS>
            <CLIENT-SERVER-OPERATION>
              <SHORT-NAME>ReportEventStatus</SHORT-NAME>
            </CLIENT-SERVER-OPERATION>
          </OPERATIONS>
        </CLIENT-SERVER-INTERFACE>
      </ELEMENTS>
    </AR-PACKAGE>
    <AR-PACKAGE>
      <SHORT-NAME>ApplicationSwcs</SHORT-NAME>
      <ELEMENTS>
        <APPLICATION-SW-COMPONENT-TYPE>
          <SHORT-NAME>SensorFusionSwc</SHORT-NAME>
          <PORTS>
            <P-PORT-PROTOTYPE>
              <SHORT-NAME>P_VehicleState</SHORT-NAME>
              <PROVIDED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">/Interfaces/VehicleState_I</PROVIDED-INTERFACE-TREF>
            </P-PORT-PROTOTYPE>
          </PORTS>
        </APPLICATION-SW-COMPONENT-TYPE>
        <APPLICATION-SW-COMPONENT-TYPE>
          <SHORT-NAME>VehicleControllerSwc</SHORT-NAME>
          <PORTS>
            <R-PORT-PROTOTYPE>
              <SHORT-NAME>R_VehicleState</SHORT-NAME>
              <REQUIRED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">/Interfaces/VehicleState_I</REQUIRED-INTERFACE-TREF>
            </R-PORT-PROTOTYPE>
            <R-PORT-PROTOTYPE>
              <SHORT-NAME>R_DiagnosticEvent</SHORT-NAME>
              <REQUIRED-INTERFACE-TREF DEST="CLIENT-SERVER-INTERFACE">/Interfaces/DiagnosticEvent_I</REQUIRED-INTERFACE-TREF>
            </R-PORT-PROTOTYPE>
          </PORTS>
        </APPLICATION-SW-COMPONENT-TYPE>
        <SERVICE-SW-COMPONENT-TYPE>
          <SHORT-NAME>DiagnosticServiceSwc</SHORT-NAME>
          <PORTS>
            <P-PORT-PROTOTYPE>
              <SHORT-NAME>P_DiagnosticEvent</SHORT-NAME>
              <PROVIDED-INTERFACE-TREF DEST="CLIENT-SERVER-INTERFACE">/Interfaces/DiagnosticEvent_I</PROVIDED-INTERFACE-TREF>
            </P-PORT-PROTOTYPE>
          </PORTS>
        </SERVICE-SW-COMPONENT-TYPE>
      </ELEMENTS>
    </AR-PACKAGE>
    <AR-PACKAGE>
      <SHORT-NAME>Compositions</SHORT-NAME>
      <ELEMENTS>
        <COMPOSITION-SW-COMPONENT-TYPE>
          <SHORT-NAME>DemoComposition</SHORT-NAME>
          <COMPONENTS>
            <SW-COMPONENT-PROTOTYPE>
              <SHORT-NAME>SensorFusion_Instance</SHORT-NAME>
              <TYPE-TREF DEST="APPLICATION-SW-COMPONENT-TYPE">/ApplicationSwcs/SensorFusionSwc</TYPE-TREF>
            </SW-COMPONENT-PROTOTYPE>
            <SW-COMPONENT-PROTOTYPE>
              <SHORT-NAME>VehicleController_Instance</SHORT-NAME>
              <TYPE-TREF DEST="APPLICATION-SW-COMPONENT-TYPE">/ApplicationSwcs/VehicleControllerSwc</TYPE-TREF>
            </SW-COMPONENT-PROTOTYPE>
            <SW-COMPONENT-PROTOTYPE>
              <SHORT-NAME>DiagnosticService_Instance</SHORT-NAME>
              <TYPE-TREF DEST="SERVICE-SW-COMPONENT-TYPE">/ApplicationSwcs/DiagnosticServiceSwc</TYPE-TREF>
            </SW-COMPONENT-PROTOTYPE>
          </COMPONENTS>
          <CONNECTORS>
            <ASSEMBLY-SW-CONNECTOR>
              <SHORT-NAME>SensorFusion_to_Controller</SHORT-NAME>
              <PROVIDER-IREF>
                <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">/Compositions/DemoComposition/SensorFusion_Instance</CONTEXT-COMPONENT-REF>
                <TARGET-P-PORT-REF DEST="P-PORT-PROTOTYPE">/ApplicationSwcs/SensorFusionSwc/P_VehicleState</TARGET-P-PORT-REF>
              </PROVIDER-IREF>
              <REQUESTER-IREF>
                <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">/Compositions/DemoComposition/VehicleController_Instance</CONTEXT-COMPONENT-REF>
                <TARGET-R-PORT-REF DEST="R-PORT-PROTOTYPE">/ApplicationSwcs/VehicleControllerSwc/R_VehicleState</TARGET-R-PORT-REF>
              </REQUESTER-IREF>
            </ASSEMBLY-SW-CONNECTOR>
            <ASSEMBLY-SW-CONNECTOR>
              <SHORT-NAME>DiagnosticService_to_Controller</SHORT-NAME>
              <PROVIDER-IREF>
                <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">/Compositions/DemoComposition/DiagnosticService_Instance</CONTEXT-COMPONENT-REF>
                <TARGET-P-PORT-REF DEST="P-PORT-PROTOTYPE">/ApplicationSwcs/DiagnosticServiceSwc/P_DiagnosticEvent</TARGET-P-PORT-REF>
              </PROVIDER-IREF>
              <REQUESTER-IREF>
                <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">/Compositions/DemoComposition/VehicleController_Instance</CONTEXT-COMPONENT-REF>
                <TARGET-R-PORT-REF DEST="R-PORT-PROTOTYPE">/ApplicationSwcs/VehicleControllerSwc/R_DiagnosticEvent</TARGET-R-PORT-REF>
              </REQUESTER-IREF>
            </ASSEMBLY-SW-CONNECTOR>
          </CONNECTORS>
        </COMPOSITION-SW-COMPONENT-TYPE>
      </ELEMENTS>
    </AR-PACKAGE>
    <AR-PACKAGE>
      <SHORT-NAME>EcucValues</SHORT-NAME>
      <ELEMENTS>
        <ECUC-MODULE-CONFIGURATION-VALUES>
          <SHORT-NAME>Dem_Config</SHORT-NAME>
          <DEFINITION-REF DEST="ECUC-MODULE-DEF">/AUTOSAR/EcucDefs/Dem/Dem</DEFINITION-REF>
        </ECUC-MODULE-CONFIGURATION-VALUES>
      </ELEMENTS>
    </AR-PACKAGE>
  </AR-PACKAGES>
</AUTOSAR>`;

const state = {
  parsedFiles: [],
  architecture: null,
  activeViewTab: "architecture",
  interactionViewMode: "graph",
  selectedInteractionNodeId: "",
  selectedInteractionEdgeId: "",
  interactionLayout: {
    columnGap: DEFAULT_INTERACTION_LAYOUT.columnGap,
    laneHeight: DEFAULT_INTERACTION_LAYOUT.laneHeight,
    manualPositions: {},
  },
  architectureInspector: {
    pinnedItem: null,
    anchorItemKey: "",
    anchorContainerId: "",
  },
};

const elements = {
  fileInput: document.getElementById("fileInput"),
  selectButton: document.getElementById("selectButton"),
  demoButton: document.getElementById("demoButton"),
  dropZone: document.getElementById("dropZone"),
  statusBadge: document.getElementById("statusBadge"),
  fileCount: document.getElementById("fileCount"),
  packageCount: document.getElementById("packageCount"),
  swcCount: document.getElementById("swcCount"),
  bswCount: document.getElementById("bswCount"),
  interfaceCount: document.getElementById("interfaceCount"),
  errorCount: document.getElementById("errorCount"),
  applicationCount: document.getElementById("applicationCount"),
  rteCount: document.getElementById("rteCount"),
  complexCount: document.getElementById("complexCount"),
  bswLayerCount: document.getElementById("bswLayerCount"),
  applicationLayer: document.getElementById("applicationLayer"),
  rteLayer: document.getElementById("rteLayer"),
  complexLayer: document.getElementById("complexLayer"),
  servicesLayer: document.getElementById("servicesLayer"),
  communicationLayer: document.getElementById("communicationLayer"),
  memoryLayer: document.getElementById("memoryLayer"),
  ecuLayer: document.getElementById("ecuLayer"),
  mcalLayer: document.getElementById("mcalLayer"),
  referenceSystemServices: document.getElementById("referenceSystemServices"),
  referenceMemoryServices: document.getElementById("referenceMemoryServices"),
  referenceCryptoServices: document.getElementById("referenceCryptoServices"),
  referenceOffboardServices: document.getElementById("referenceOffboardServices"),
  referenceCommunicationServices: document.getElementById("referenceCommunicationServices"),
  referenceOnboardDeviceAbstraction: document.getElementById("referenceOnboardDeviceAbstraction"),
  referenceMemoryHardwareAbstraction: document.getElementById("referenceMemoryHardwareAbstraction"),
  referenceCryptoHardwareAbstraction: document.getElementById("referenceCryptoHardwareAbstraction"),
  referenceWirelessHardwareAbstraction: document.getElementById("referenceWirelessHardwareAbstraction"),
  referenceCommunicationHardwareAbstraction: document.getElementById("referenceCommunicationHardwareAbstraction"),
  referenceIoHardwareAbstraction: document.getElementById("referenceIoHardwareAbstraction"),
  referenceMicrocontrollerDrivers: document.getElementById("referenceMicrocontrollerDrivers"),
  referenceMemoryDrivers: document.getElementById("referenceMemoryDrivers"),
  referenceCryptoDrivers: document.getElementById("referenceCryptoDrivers"),
  referenceWirelessDrivers: document.getElementById("referenceWirelessDrivers"),
  referenceCommunicationDrivers: document.getElementById("referenceCommunicationDrivers"),
  referenceIoDrivers: document.getElementById("referenceIoDrivers"),
  evidenceBody: document.getElementById("evidenceBody"),
  fileList: document.getElementById("fileList"),
  headlineInsight: document.getElementById("headlineInsight"),
  rteInsight: document.getElementById("rteInsight"),
  chipTemplate: document.getElementById("chipTemplate"),
  viewTabs: Array.from(document.querySelectorAll("[data-tab-target]")),
  viewPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
  architecturePanel: document.getElementById("architecturePanel"),
  interactionControls: document.getElementById("interactionControls"),
  interactionGraphControls: document.getElementById("interactionGraphControls"),
  interactionModeButtons: Array.from(document.querySelectorAll("[data-interaction-mode]")),
  interactionHintInline: document.getElementById("interactionHintInline"),
  connectionSummary: document.getElementById("connectionSummary"),
  interactionCanvas: document.getElementById("interactionCanvas"),
  interactionDetails: document.getElementById("interactionDetails"),
  connectionList: document.getElementById("connectionList"),
  interactionGapControl: document.getElementById("interactionGapControl"),
  interactionGapValue: document.getElementById("interactionGapValue"),
  interactionLaneHeightControl: document.getElementById("interactionLaneHeightControl"),
  interactionLaneHeightValue: document.getElementById("interactionLaneHeightValue"),
  resetInteractionLayoutButton: document.getElementById("resetInteractionLayoutButton"),
};

bindEvents();
renderInitialState();

function bindEvents() {
  elements.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchViewTab(tab.dataset.tabTarget));
  });
  elements.interactionModeButtons.forEach((button) => {
    button.addEventListener("click", () => setInteractionViewMode(button.dataset.interactionMode));
  });

  elements.selectButton.addEventListener("click", () => elements.fileInput.click());
  elements.demoButton.addEventListener("click", loadDemo);
  elements.resetInteractionLayoutButton.addEventListener("click", resetInteractionLayout);
  elements.architecturePanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-inspector-close]")) {
      clearArchitectureInspector();
    }
  });
  elements.architecturePanel.addEventListener("scroll", () => {
    if (state.architectureInspector.pinnedItem) {
      renderArchitectureInspector();
    }
  }, true);
  window.addEventListener("resize", () => {
    if (state.architectureInspector.pinnedItem) {
      renderArchitectureInspector();
    }
  });
  elements.interactionGapControl.addEventListener("input", (event) => {
    state.interactionLayout.columnGap = Number(event.target.value) || DEFAULT_INTERACTION_LAYOUT.columnGap;
    renderInteractionLayoutControls();
    renderInteraction(state.architecture?.interaction || null);
  });
  elements.interactionLaneHeightControl.addEventListener("input", (event) => {
    state.interactionLayout.laneHeight = Number(event.target.value) || DEFAULT_INTERACTION_LAYOUT.laneHeight;
    renderInteractionLayoutControls();
    renderInteraction(state.architecture?.interaction || null);
  });
  elements.fileInput.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }
    await analyzeFiles(files);
    event.target.value = "";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove("drag-active");
    });
  });

  elements.dropZone.addEventListener("drop", async (event) => {
    const files = Array.from(event.dataTransfer?.files || []).filter((file) => /\.(arxml|xml)$/i.test(file.name));
    if (!files.length) {
      setStatus("ARXML 또는 XML 파일만 업로드할 수 있습니다.", "warning");
      return;
    }
    await analyzeFiles(files);
  });
}

async function analyzeFiles(files) {
  setStatus("ARXML 파일을 분석 중입니다.", "idle");
  const parsedFiles = await Promise.all(
    files.map(async (file) => parseArxmlContent(file.name, await file.text()))
  );
  state.parsedFiles = parsedFiles;
  state.selectedInteractionNodeId = "";
  state.selectedInteractionEdgeId = "";
  state.interactionLayout.manualPositions = {};
  state.architectureInspector.pinnedItem = null;
  state.architectureInspector.anchorItemKey = "";
  state.architectureInspector.anchorContainerId = "";
  state.architecture = mergeArchitecture(parsedFiles);
  renderAnalysis();
}

function loadDemo() {
  const parsedDemo = [parseArxmlContent("demo-system.arxml", DEMO_XML)];
  state.parsedFiles = parsedDemo;
  state.selectedInteractionNodeId = "";
  state.selectedInteractionEdgeId = "";
  state.interactionLayout.manualPositions = {};
  state.architectureInspector.pinnedItem = null;
  state.architectureInspector.anchorItemKey = "";
  state.architectureInspector.anchorContainerId = "";
  state.architecture = mergeArchitecture(parsedDemo);
  renderAnalysis();
}

function parseArxmlContent(fileName, content) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(content, "application/xml");
  const parserError = documentNode.querySelector("parsererror");

  if (parserError) {
    return {
      fileName,
      ok: false,
      error: parserError.textContent.trim(),
      stats: zeroStats(),
      evidence: [],
      architecture: createArchitectureBucket(),
      interaction: createInteractionBucket(),
    };
  }

  const architecture = createArchitectureBucket();
  const interaction = createInteractionBucket();
  const evidence = [];
  const seenKeys = new Set();
  const packageCount = countByTag(documentNode, "AR-PACKAGE");
  const swcCount = countByTagSet(documentNode, APPLICATION_TYPES) + countByTagSet(documentNode, COMPLEX_DRIVER_TYPES);
  const interfaceCount = countByTagSet(documentNode, INTERFACE_TYPES);
  const rteSignals = {
    ports: countByTag(documentNode, "P-PORT-PROTOTYPE") + countByTag(documentNode, "R-PORT-PROTOTYPE"),
    connectors: countByTag(documentNode, "ASSEMBLY-SW-CONNECTOR") + countByTag(documentNode, "DELEGATION-SW-CONNECTOR"),
    runnables: countByTag(documentNode, "RUNNABLE-ENTITY"),
    interfaces: interfaceCount,
  };

  for (const node of documentNode.getElementsByTagName("*")) {
    const tag = normalizeTag(node);
    const shortName = childText(node, "SHORT-NAME");

    if (isInstantiableComponentTag(tag) && shortName) {
      const componentPath = getElementPath(node);
      const kind = COMPLEX_DRIVER_TYPES.has(tag)
        ? "CDD"
        : SERVICE_COMPONENT_TYPES.has(tag)
          ? "BSW Service"
          : "SWC";
      interaction.componentTypes.push({
        path: componentPath,
        name: shortName,
        tag,
        kind,
        lane: kind === "CDD" ? "complex" : kind === "BSW Service" ? "bswService" : "application",
        fileName,
        packagePath: getPackagePath(node),
        order: interaction.componentTypes.length,
        ports: extractPorts(node, componentPath),
      });
    }

    if (!shortName && tag !== "ECUC-MODULE-CONFIGURATION-VALUES") {
      continue;
    }

    if (APPLICATION_TYPES.has(tag)) {
      addItem("application", makeItem(shortName, tag, fileName, getPackagePath(node), "SWC"));
      continue;
    }

    if (COMPLEX_DRIVER_TYPES.has(tag)) {
      addItem("complex", makeItem(shortName, tag, fileName, getPackagePath(node), "CDD"));
      continue;
    }

    if (INTERFACE_TYPES.has(tag)) {
      addItem("interfaces", makeItem(shortName, tag, fileName, getPackagePath(node), "Interface"));
      continue;
    }

    if (RTE_SUPPORT_TYPES.has(tag)) {
      addItem("rteSource", makeItem(shortName, tag, fileName, getPackagePath(node), "RTE Source"));
    }

    if (tag === "SW-COMPONENT-PROTOTYPE") {
      const typeRefNode = getDirectChild(node, "TYPE-TREF");
      interaction.componentInstances.push({
        path: getElementPath(node),
        name: shortName,
        typePath: typeRefNode ? typeRefNode.textContent.trim() : "",
        typeDest: typeRefNode ? typeRefNode.getAttribute("DEST") || "" : "",
        fileName,
        packagePath: getPackagePath(node),
        order: interaction.componentInstances.length,
      });
      continue;
    }

    if (tag === "ASSEMBLY-SW-CONNECTOR") {
      const providerIref = getDirectChild(node, "PROVIDER-IREF");
      const requesterIref = getDirectChild(node, "REQUESTER-IREF");
      if (providerIref && requesterIref) {
        interaction.connectors.push({
          id: [fileName, shortName, childText(providerIref, "CONTEXT-COMPONENT-REF"), childText(requesterIref, "CONTEXT-COMPONENT-REF")].join("|"),
          name: shortName,
          fileName,
          compositionPath: getAncestorElementPath(node, "COMPOSITION-SW-COMPONENT-TYPE"),
          providerComponentRef: childText(providerIref, "CONTEXT-COMPONENT-REF"),
          providerPortRef: childText(providerIref, "TARGET-P-PORT-REF"),
          requesterComponentRef: childText(requesterIref, "CONTEXT-COMPONENT-REF"),
          requesterPortRef: childText(requesterIref, "TARGET-R-PORT-REF"),
          order: interaction.connectors.length,
        });
      }
      continue;
    }

    if (tag === "ECUC-MODULE-CONFIGURATION-VALUES") {
      const moduleName = extractModuleName(node);
      const configName = shortName || moduleName || "UnnamedModuleConfig";
      const bucket = classifyBswModule(moduleName || configName) || "unknownBsw";
      addItem(bucket, makeItem(configName, moduleName || tag, fileName, getPackagePath(node), "BSW"));
      continue;
    }

    if (tag === "AR-PACKAGE") {
      const bucket = classifyBswModule(shortName);
      if (bucket) {
        addItem(bucket, makeItem(shortName, "AR-PACKAGE", fileName, getPackagePath(node), "Package"));
      }
    }
  }

  if (rteSignals.ports || rteSignals.connectors || rteSignals.runnables || rteSignals.interfaces) {
    [["Ports", rteSignals.ports, "P/R Port prototype count"], ["Connectors", rteSignals.connectors, "Assembly or delegation connectors"], ["Runnables", rteSignals.runnables, "Runnable entity count"], ["Interfaces", rteSignals.interfaces, "RTE-facing interface count"]]
      .filter(([, count]) => count > 0)
      .forEach(([label, count, detail]) => {
        architecture.rte.push({ name: `${label} ${count}`, tag: "RTE", fileName, packagePath: "-", kind: "Derived", detail });
      });
  }

  return {
    fileName,
    ok: true,
    error: "",
    stats: {
      packageCount,
      swcCount,
      interfaceCount,
      bswCount: architecture.services.length + architecture.communication.length + architecture.memory.length + architecture.ecuAbstraction.length + architecture.mcal.length + architecture.unknownBsw.length,
    },
    architecture,
    evidence,
    interaction,
  };

  function addItem(group, item) {
    const key = [group, item.name, item.kind, item.fileName, item.packagePath].join("|");
    if (seenKeys.has(key)) {
      return;
    }
    seenKeys.add(key);
    architecture[group].push(item);
    evidence.push({ classification: evidenceLabel(group), name: item.name, source: item.kind === "BSW" ? `${item.kind} / ${item.tag}` : item.tag, packagePath: item.packagePath, fileName: item.fileName });
  }
}
function mergeArchitecture(parsedFiles) {
  const merged = createArchitectureBucket();
  const summary = { packageCount: 0, swcCount: 0, interfaceCount: 0, bswCount: 0, errors: 0 };
  const files = [];
  const evidence = [];

  parsedFiles.forEach((entry) => {
    files.push({ fileName: entry.fileName, ok: entry.ok, error: entry.error, stats: entry.stats });
    if (!entry.ok) {
      summary.errors += 1;
      return;
    }
    summary.packageCount += entry.stats.packageCount;
    summary.swcCount += entry.stats.swcCount;
    summary.interfaceCount += entry.stats.interfaceCount;
    summary.bswCount += entry.stats.bswCount;
    Object.keys(merged).forEach((key) => merged[key].push(...entry.architecture[key]));
    evidence.push(...entry.evidence);
  });

  if (merged.rteSource.length) {
    merged.rte.push({ name: `RTE Source Nodes ${merged.rteSource.length}`, tag: "RTE Support", kind: "Derived", detail: "Ports, connectors, runnables, variables", fileName: "multiple", packagePath: "-" });
  }

  return { merged, summary, files, evidence, interaction: mergeInteractionData(parsedFiles) };
}

function mergeInteractionData(parsedFiles) {
  return Core.mergeInteractionData(parsedFiles);
}

function renderInitialState() {
  updateSummary({ fileCount: 0, packageCount: 0, swcCount: 0, bswCount: 0, interfaceCount: 0, errorCount: 0 });
  setStatus("대기 중", "idle");
  renderViewTabs();
  renderInteractionModeControls();
  renderInteractionLayoutControls();
  renderArchitectureInspector();
  renderInteraction(null);
}

function renderInteractionLayoutControls() {
  elements.interactionGapControl.value = String(state.interactionLayout.columnGap);
  elements.interactionGapValue.textContent = `${state.interactionLayout.columnGap}px`;
  elements.interactionLaneHeightControl.value = String(state.interactionLayout.laneHeight);
  elements.interactionLaneHeightValue.textContent = `${state.interactionLayout.laneHeight}px`;
}

function renderInteractionModeControls() {
  const isGraph = state.interactionViewMode === "graph";
  elements.interactionModeButtons.forEach((button) => {
    const isActive = button.dataset.interactionMode === state.interactionViewMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (elements.interactionControls) {
    elements.interactionControls.dataset.mode = state.interactionViewMode;
  }
  if (elements.interactionGraphControls) {
    elements.interactionGraphControls.hidden = !isGraph;
  }
  if (elements.interactionHintInline) {
    elements.interactionHintInline.textContent = isGraph
      ? "노드는 lane 안에서 드래그해 위치를 조정할 수 있습니다."
      : "AUTOSAR reference layout 기준으로 Application, RTE, BSW 영역 위에 연결 구조를 정렬합니다.";
  }
}

function setInteractionViewMode(mode) {
  const nextMode = mode === "reference" ? "reference" : "graph";
  if (state.interactionViewMode === nextMode) {
    return;
  }
  state.interactionViewMode = nextMode;
  renderInteractionModeControls();
  renderInteraction(state.architecture?.interaction || null);
}

function resetInteractionLayout() {
  state.interactionLayout.manualPositions = {};
  renderInteractionLayoutControls();
  renderInteraction(state.architecture?.interaction || null);
}

function pruneInteractionManualPositions(interaction) {
  if (!interaction?.nodes?.length) {
    state.interactionLayout.manualPositions = {};
    return;
  }

  const validIds = new Set(interaction.nodes.map((node) => node.id));
  state.interactionLayout.manualPositions = Object.fromEntries(
    Object.entries(state.interactionLayout.manualPositions).filter(([nodeId]) => validIds.has(nodeId))
  );
}

function startInteractionNodeDrag(event, node, layout) {
  if (event.button !== 0) return;
  const canvas = elements.interactionCanvas;
  const currentPosition = layout.positions.get(node.id);
  if (!canvas || !currentPosition) return;

  event.preventDefault();
  state.selectedInteractionNodeId = node.id;
  state.selectedInteractionEdgeId = "";
  document.body.classList.add("interaction-dragging");

  const getPointerPosition = (pointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: pointerEvent.clientX - rect.left + canvas.scrollLeft,
      y: pointerEvent.clientY - rect.top + canvas.scrollTop,
    };
  };

  const startPointer = getPointerPosition(event);
  const offsetX = startPointer.x - currentPosition.x;
  const offsetY = startPointer.y - currentPosition.y;
  let pendingPosition = currentPosition;
  let frameHandle = 0;

  const commit = () => {
    frameHandle = 0;
    state.interactionLayout.manualPositions[node.id] = pendingPosition;
    renderInteraction(state.architecture?.interaction || null);
  };

  const handleMove = (moveEvent) => {
    const pointer = getPointerPosition(moveEvent);
    pendingPosition = clampInteractionNodePosition(
      node,
      { x: pointer.x - offsetX, y: pointer.y - offsetY },
      layout
    );
    if (!frameHandle) {
      frameHandle = window.requestAnimationFrame(commit);
    }
  };

  const stop = () => {
    if (frameHandle) {
      window.cancelAnimationFrame(frameHandle);
      commit();
    } else {
      state.interactionLayout.manualPositions[node.id] = pendingPosition;
      renderInteraction(state.architecture?.interaction || null);
    }
    document.body.classList.remove("interaction-dragging");
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", stop);
    window.removeEventListener("pointercancel", stop);
  };

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", stop);
  window.addEventListener("pointercancel", stop);
}

function clampInteractionNodePosition(node, position, layout) {
  const laneRect = layout.laneRects?.get(node.lane);
  const laneTop = layout.laneTop.get(node.lane) || 20;
  const minX = laneRect ? laneRect.x + 18 : 18;
  const maxX = laneRect
    ? Math.max(minX, laneRect.x + laneRect.width - layout.nodeWidth - 18)
    : Math.max(minX, layout.width - layout.nodeWidth - 18);
  const minY = (laneRect ? laneRect.y : laneTop) + 24;
  const maxY = laneRect
    ? Math.max(minY, laneRect.y + laneRect.height - layout.nodeHeight - 24)
    : Math.max(minY, laneTop + layout.laneHeight - layout.nodeHeight - 24);
  return {
    x: clamp(Number(position.x) || 0, minX, maxX),
    y: clamp(Number(position.y) || 0, minY, maxY),
  };
}

function renderAnalysis() {
  const result = state.architecture;
  if (!result) {
    renderInitialState();
    return;
  }

  updateSummary({ fileCount: state.parsedFiles.length, packageCount: result.summary.packageCount, swcCount: result.summary.swcCount, bswCount: result.summary.bswCount, interfaceCount: result.summary.interfaceCount, errorCount: result.summary.errors });

  if (result.summary.errors && !result.summary.packageCount && !result.summary.swcCount) {
    setStatus("파싱 실패", "error");
  } else if (result.summary.errors) {
    setStatus("일부 파일 파싱 실패", "warning");
  } else {
    setStatus("분석 완료", "success");
  }

  const { merged } = result;
  const referenceArchitecture = renderReferenceArchitecture(merged);

  elements.applicationCount.textContent = dedupeItems(merged.application).length.toString();
  elements.rteCount.textContent = dedupeItems(merged.rte).length.toString();
  elements.complexCount.textContent = referenceArchitecture.complexDrivers.length.toString();
  elements.bswLayerCount.textContent = countReferenceArchitectureModules(referenceArchitecture).toString();

  renderEvidence(result.evidence);
  renderFiles(result.files);
  renderInsights(result);
  renderViewTabs();
  renderInteractionModeControls();
  renderInteractionLayoutControls();
  renderArchitectureInspector();
  renderInteraction(result.interaction);
}

function renderLayer(container, items, emptyText) {
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.classList.add("empty-state");
    container.textContent = emptyText;
    return;
  }
  container.classList.remove("empty-state");
  const isReferenceLayer = container.classList.contains("reference-chip-grid");
  const isCompactReferenceLayer = isReferenceLayer && Boolean(container.closest(".reference-cell"));
  items.forEach((item) => {
    const chip = elements.chipTemplate.content.firstElementChild.cloneNode(true);
    const compactLabel = isCompactReferenceLayer ? getCompactArchitectureChipLabel(item) : item.name;
    chip.querySelector(".chip-title").textContent = compactLabel;
    chip.querySelector(".chip-meta").textContent = (isReferenceLayer
      ? [item.kind, item.tag]
      : [item.kind, item.tag, item.packagePath && item.packagePath !== "-" ? item.packagePath : null]
    ).filter(Boolean).join(" / ");
    if (isReferenceLayer && !isCompactReferenceLayer) {
      chip.title = [compactLabel, item.name !== compactLabel ? item.name : null, item.kind, item.tag, item.packagePath && item.packagePath !== "-" ? item.packagePath : null, item.fileName].filter(Boolean).join("\n");
    }
    if (isCompactReferenceLayer) {
      const itemKey = getArchitectureInspectorKey(item);
      chip.classList.add("compact-chip");
      chip.dataset.architectureKey = itemKey;
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      if (state.architectureInspector.pinnedItem && state.architectureInspector.anchorItemKey === itemKey && state.architectureInspector.anchorContainerId === container.id) {
        chip.classList.add("is-selected");
      }
      chip.addEventListener("click", (event) => {
        event.preventDefault();
        pinArchitectureInspector(item, chip, container);
      });
      chip.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pinArchitectureInspector(item, chip, container);
        }
      });
    }
    container.appendChild(chip);
  });
}

function pinArchitectureInspector(item, chip, container) {
  const itemKey = chip?.dataset.architectureKey || getArchitectureInspectorKey(item);
  if (state.architectureInspector.anchorItemKey === itemKey && state.architectureInspector.anchorContainerId === container?.id) {
    clearArchitectureInspector();
    return;
  }

  state.architectureInspector.pinnedItem = item;
  state.architectureInspector.anchorItemKey = itemKey;
  state.architectureInspector.anchorContainerId = container?.id || "";
  renderArchitectureInspector();
}

function clearArchitectureInspector() {
  state.architectureInspector.pinnedItem = null;
  state.architectureInspector.anchorItemKey = "";
  state.architectureInspector.anchorContainerId = "";
  renderArchitectureInspector();
}

function getCompactArchitectureChipLabel(item) {
  return resolveReferenceModuleName(item)
    || String(item.name || "")
      .replace(/_Config(Set)?$/i, "")
      .replace(/_Instance$/i, "")
      .trim();
}

function getArchitectureInspectorKey(item) {
  return [item?.fileName, item?.packagePath, item?.kind, item?.tag, item?.name].filter(Boolean).join("|");
}

function clearArchitecturePopoverArtifacts() {
  document.querySelectorAll(".architecture-popover").forEach((node) => node.remove());
  document.querySelectorAll(".reference-cell.has-popover").forEach((cell) => cell.classList.remove("has-popover"));
  document.querySelectorAll(".reference-cell .compact-chip.is-selected").forEach((chip) => chip.classList.remove("is-selected"));
}

function positionArchitecturePopover(popover, chip, cell) {
  const panelRect = elements.architecturePanel.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();
  const popoverWidth = popover.offsetWidth;
  const popoverHeight = popover.offsetHeight;
  const spaceRight = panelRect.right - chipRect.right;
  const spaceLeft = chipRect.left - panelRect.left;
  const placeRight = spaceRight >= popoverWidth + 20 || spaceRight >= spaceLeft;
  const left = placeRight
    ? chipRect.right - cellRect.left + 12
    : chipRect.left - cellRect.left - popoverWidth - 12;
  const top = clamp(chipRect.top - cellRect.top - 10, 8, Math.max(8, cell.clientHeight - popoverHeight - 8));
  const arrowOffset = clamp((chipRect.top - cellRect.top) + (chipRect.height / 2) - top - 10, 20, Math.max(20, popoverHeight - 20));

  popover.classList.add(placeRight ? "is-right" : "is-left");
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.style.setProperty("--popover-arrow-top", `${arrowOffset}px`);
}

function renderArchitectureInspector() {
  clearArchitecturePopoverArtifacts();
  const item = state.architectureInspector.pinnedItem;
  if (!item || !state.architectureInspector.anchorContainerId || !state.architectureInspector.anchorItemKey) {
    return;
  }

  const container = document.getElementById(state.architectureInspector.anchorContainerId);
  const chip = Array.from(container?.querySelectorAll(".compact-chip") || []).find((node) => node.dataset.architectureKey === state.architectureInspector.anchorItemKey);
  const cell = container?.closest(".reference-cell");
  if (!container || !chip || !cell) {
    state.architectureInspector.pinnedItem = null;
    state.architectureInspector.anchorItemKey = "";
    state.architectureInspector.anchorContainerId = "";
    return;
  }

  chip.classList.add("is-selected");
  cell.classList.add("has-popover");

  const compactLabel = getCompactArchitectureChipLabel(item);
  const sourceLabel = item.name !== compactLabel ? item.name : "-";
  const popover = document.createElement("div");
  popover.className = "architecture-popover";
  popover.innerHTML = `<div class="architecture-popover-head"><div><div class="architecture-popover-title">${escapeHtml(compactLabel)}</div><div class="architecture-popover-meta">${escapeHtml([item.kind, item.tag].filter(Boolean).join(" / "))}</div></div><button type="button" class="architecture-popover-close" data-inspector-close="true" aria-label="닫기">X</button></div><div class="architecture-popover-row"><span>Source</span><strong>${escapeHtml(sourceLabel)}</strong></div><div class="architecture-popover-row"><span>Package</span><strong>${escapeHtml(item.packagePath && item.packagePath !== "-" ? item.packagePath : "-")}</strong></div><div class="architecture-popover-row"><span>File</span><strong>${escapeHtml(item.fileName || "-")}</strong></div>`;
  popover.style.visibility = "hidden";
  cell.appendChild(popover);
  positionArchitecturePopover(popover, chip, cell);
  popover.style.visibility = "visible";
}

function renderReferenceArchitecture(merged) {
  const reference = buildReferenceArchitecture(merged);
  renderLayer(elements.applicationLayer, dedupeItems(merged.application), "Application Layer 항목이 없습니다.");
  renderLayer(elements.rteLayer, dedupeItems(merged.rte), "RTE 관련 신호가 없습니다.");
  renderLayer(elements.complexLayer, reference.complexDrivers, "Complex Driver 항목이 없습니다.");
  REFERENCE_AREA_RENDER_CONFIG.forEach(([areaKey, elementKey, emptyText]) => {
    renderLayer(elements[elementKey], reference[areaKey], emptyText);
  });
  return reference;
}

function buildReferenceArchitecture(merged) {
  const reference = {
    systemServices: [],
    memoryServices: [],
    cryptoServices: [],
    offboardServices: [],
    communicationServices: [],
    onboardDeviceAbstraction: [],
    memoryHardwareAbstraction: [],
    cryptoHardwareAbstraction: [],
    wirelessHardwareAbstraction: [],
    communicationHardwareAbstraction: [],
    ioHardwareAbstraction: [],
    microcontrollerDrivers: [],
    memoryDrivers: [],
    cryptoDrivers: [],
    wirelessDrivers: [],
    communicationDrivers: [],
    ioDrivers: [],
    complexDrivers: dedupeBy(dedupeItems(merged.complex), (item) => resolveReferenceModuleName(item) || [item.name, item.packagePath].join("|")),
  };

  [["services", dedupeItems(merged.services)], ["communication", dedupeItems(merged.communication)], ["memory", dedupeItems(merged.memory)], ["ecuAbstraction", dedupeItems(merged.ecuAbstraction)], ["mcal", dedupeItems(merged.mcal)], ["unknownBsw", dedupeItems(merged.unknownBsw)]]
    .forEach(([sourceGroup, items]) => {
      items.forEach((item) => {
        const areaKey = classifyReferenceArea(item, sourceGroup);
        reference[areaKey].push(item);
      });
    });

  Object.keys(reference).forEach((areaKey) => {
    reference[areaKey] = dedupeBy(reference[areaKey], (item) => resolveReferenceModuleName(item) || [item.name, item.tag, item.packagePath].join("|"));
  });

  return reference;
}

function classifyReferenceArea(item, sourceGroup) {
  const moduleName = resolveReferenceModuleName(item);
  if (moduleName) {
    for (const [areaKey, modules] of Object.entries(REFERENCE_ARCHITECTURE_MAP)) {
      if (modules.some((module) => sanitizeIdentifier(module) === sanitizeIdentifier(moduleName))) {
        return areaKey;
      }
    }
  }
  return REFERENCE_ARCHITECTURE_FALLBACK[sourceGroup] || "systemServices";
}

function resolveReferenceModuleName(item) {
  const knownModules = Object.values(BSW_GROUPS).flat();
  const candidates = [item?.tag, item?.name].map((value) => sanitizeIdentifier(value)).filter(Boolean);
  for (const candidate of candidates) {
    for (const moduleName of knownModules) {
      const normalizedModule = sanitizeIdentifier(moduleName);
      if (candidate === normalizedModule || candidate.startsWith(normalizedModule)) {
        return moduleName;
      }
    }
  }
  return "";
}

function countReferenceArchitectureModules(reference) {
  return REFERENCE_AREA_RENDER_CONFIG.reduce((sum, [areaKey]) => sum + (reference[areaKey]?.length || 0), 0);
}

function renderEvidence(evidence) {
  const rows = dedupeEvidence(evidence);
  elements.evidenceBody.innerHTML = "";
  if (!rows.length) {
    elements.evidenceBody.innerHTML = '<tr><td colspan="5" class="empty-row">업로드 후 분석 근거가 표시됩니다.</td></tr>';
    return;
  }
  rows.slice().sort((left, right) => left.classification.localeCompare(right.classification)).forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${escapeHtml(entry.classification)}</td><td>${escapeHtml(entry.name)}</td><td>${escapeHtml(entry.source)}</td><td>${escapeHtml(entry.packagePath || "-")}</td><td>${escapeHtml(entry.fileName)}</td>`;
    elements.evidenceBody.appendChild(row);
  });
}

function renderFiles(files) {
  elements.fileList.innerHTML = "";
  if (!files.length) {
    elements.fileList.classList.add("empty-state");
    elements.fileList.textContent = "업로드된 파일이 없습니다.";
    return;
  }
  elements.fileList.classList.remove("empty-state");
  files.forEach((file) => {
    const item = document.createElement("article");
    item.className = "file-entry";
    item.innerHTML = `<div><div class="file-name">${escapeHtml(file.fileName)}</div><div class="file-meta">AR-PACKAGE ${file.stats.packageCount} / SWC ${file.stats.swcCount} / Interface ${file.stats.interfaceCount} / BSW ${file.stats.bswCount}</div></div><span class="file-status ${file.ok ? "ok" : "fail"}">${file.ok ? "OK" : "FAIL"}</span>`;
    if (!file.ok) {
      item.querySelector(".file-meta").textContent = file.error;
    }
    elements.fileList.appendChild(item);
  });
}

function renderInsights(result) {
  const { merged, summary, interaction } = result;
  const dominantBsw = [["Services", dedupeItems(merged.services).length], ["Communication Stack", dedupeItems(merged.communication).length], ["Memory Stack", dedupeItems(merged.memory).length], ["ECU Abstraction", dedupeItems(merged.ecuAbstraction).length], ["MCAL", dedupeItems(merged.mcal).length]].sort((left, right) => right[1] - left[1])[0];

  if (!summary.packageCount && !summary.swcCount && !summary.bswCount) {
    elements.headlineInsight.textContent = "분석 가능한 AUTOSAR 메타모델 항목이 아직 없습니다.";
    elements.rteInsight.textContent = "SWC, 포트, 인터페이스, Runnable이 감지되면 RTE를 추정합니다.";
    return;
  }

  elements.headlineInsight.textContent = `${summary.swcCount}개의 SWC/Composition, ${summary.bswCount}개의 BSW 모듈, ${summary.interfaceCount}개의 인터페이스를 바탕으로 계층 보드를 구성했습니다. ${dominantBsw && dominantBsw[1] > 0 ? `가장 많이 감지된 BSW 영역은 ${dominantBsw[0]}입니다.` : "BSW 모듈은 아직 명확히 감지되지 않았습니다."}`;
  const derivedSignals = dedupeItems(merged.rte).map((item) => item.name).join(", ");
  const connectionText = interaction.connections.length ? ` Composition connector ${interaction.connections.length}개를 기준으로 SWC 연결 그래프도 구성했습니다.` : "";
  elements.rteInsight.textContent = dedupeItems(merged.rte).length ? `RTE는 직접 정의보다 생성 산출물에 가까우므로, 현재는 ${derivedSignals} 신호를 기반으로 추정했습니다.${connectionText}` : `RTE 추정을 위한 포트/러너블/인터페이스 신호가 충분하지 않습니다.${connectionText}`;
}

function renderInteraction(interaction) {
  const emptySummary = state.interactionViewMode === "reference"
    ? "Composition connector가 감지되면 AUTOSAR reference layout 위에 연결 구조를 표시합니다."
    : "Composition connector가 감지되면 노드 그래프로 표시됩니다.";
  const emptyCanvas = state.interactionViewMode === "reference"
    ? "Composition connector가 감지되면 AUTOSAR reference layout 위에 SWC/CDD 연결 구조를 표시합니다."
    : "Composition connector가 감지되면 SWC/CDD 간 연결 구조를 여기에 표시합니다.";

  if (!interaction) {
    elements.connectionSummary.textContent = emptySummary;
    elements.interactionCanvas.classList.add("empty-state");
    elements.interactionCanvas.innerHTML = emptyCanvas;
    elements.interactionDetails.classList.add("empty-state");
    elements.interactionDetails.innerHTML = "노드 또는 연결을 선택하면 In/Out 관계와 포트 매핑을 보여줍니다.";
    elements.connectionList.classList.add("empty-state");
    elements.connectionList.innerHTML = "분석된 연결 구조가 아직 없습니다.";
    return;
  }

  pruneInteractionManualPositions(interaction);
  const selection = getInteractionSelection(interaction);
  elements.connectionSummary.textContent = interaction.connections.length
    ? `${interaction.nodes.length} nodes / ${interaction.connections.length} connectors / unresolved ${interaction.unresolvedConnectors} / ${state.interactionViewMode === "reference" ? "reference layout" : "graph layout"}`
    : emptySummary;
  if (state.interactionViewMode === "reference") {
    renderInteractionReferenceLayout(interaction, selection);
  } else {
    renderInteractionGraph(interaction, selection);
  }
  renderInteractionDetails(interaction, selection);
  renderConnectionList(interaction, selection);
}

function renderInteractionGraph(interaction, selection) {
  if (!interaction.nodes.length || !interaction.connections.length) {
    elements.interactionCanvas.classList.add("empty-state");
    elements.interactionCanvas.innerHTML = "Composition connector가 감지되면 SWC/CDD 간 연결 구조를 여기에 표시합니다.";
    return;
  }

  elements.interactionCanvas.classList.remove("empty-state");
  elements.interactionCanvas.innerHTML = "";
  const layout = computeInteractionLayout(interaction.nodes, interaction.lanes, interaction.connections, state.interactionLayout);
  const edgeOffsets = buildInteractionEdgeOffsets(interaction.connections);
  const nodeMap = new Map(interaction.nodes.map((node) => [node.id, node]));
  const routing = buildInteractionGraphRouting(interaction.nodes, interaction.connections, layout);
  const board = document.createElement("div");
  board.className = "interaction-board";
  board.style.width = `${layout.width}px`;
  board.style.height = `${layout.height}px`;

  interaction.lanes.forEach((lane) => {
    const laneRect = layout.laneRects.get(lane.id);
    if (!laneRect) {
      return;
    }
    const laneBand = document.createElement("div");
    laneBand.className = `interaction-lane-band ${lane.id}`;
    laneBand.style.left = `${laneRect.x}px`;
    laneBand.style.top = `${laneRect.y}px`;
    laneBand.style.right = "auto";
    laneBand.style.width = `${laneRect.width}px`;
    laneBand.style.height = `${laneRect.height}px`;
    const label = document.createElement("span");
    label.className = "interaction-lane-label";
    label.textContent = lane.label;
    const count = document.createElement("span");
    count.className = "interaction-lane-count";
    count.textContent = `${lane.nodes.length} nodes`;
    laneBand.append(label, count);
    board.appendChild(laneBand);
  });

  const svg = createSvgElement("svg");
  svg.classList.add("interaction-svg");
  svg.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  const defs = createSvgElement("defs");
  defs.innerHTML = '<marker id="interaction-arrow" markerWidth="7" markerHeight="7" refX="6" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 6 2.5 L 0 5 z" fill="#61d0ff"></path></marker><marker id="interaction-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 6 2.5 L 0 5 z" fill="#ffc857"></path></marker>';
  svg.appendChild(defs);

  interaction.connections.forEach((connection) => {
    const sourcePosition = layout.positions.get(connection.sourceId);
    const targetPosition = layout.positions.get(connection.targetId);
    if (!sourcePosition || !targetPosition) {
      return;
    }
    const pathData = buildEdgePath(
      connection,
      nodeMap.get(connection.sourceId),
      nodeMap.get(connection.targetId),
      sourcePosition,
      targetPosition,
      layout,
      routing,
      edgeOffsets.get(connection.id) || 0
    );
    const isActive = selection.activeEdgeIds.has(connection.id);
    const isMuted = selection.hasSelection && !selection.activeEdgeIds.has(connection.id);
    const visiblePath = createSvgElement("path");
    visiblePath.setAttribute("d", pathData);
    visiblePath.setAttribute("marker-end", isActive ? "url(#interaction-arrow-active)" : "url(#interaction-arrow)");
    visiblePath.classList.add("interaction-edge");
    if (isActive) visiblePath.classList.add("active");
    if (isMuted) visiblePath.classList.add("muted");
    const clickPath = createSvgElement("path");
    clickPath.setAttribute("d", pathData);
    clickPath.classList.add("interaction-edge-hit");
    clickPath.addEventListener("click", () => selectInteractionEdge(connection.id));
    svg.append(visiblePath, clickPath);
    const labelPlacement = getEdgeLabelPlacement(visiblePath, sourcePosition, targetPosition, layout.nodeWidth, layout.nodeHeight);
    appendInteractionLabel(svg, connection.interfaceName, labelPlacement, isActive, isMuted);
  });

  board.appendChild(svg);

  interaction.nodes.forEach((node) => {
    const position = layout.positions.get(node.id);
    const nodeButton = document.createElement("button");
    nodeButton.type = "button";
    nodeButton.className = `interaction-node ${node.lane}`;
    nodeButton.style.left = `${position.x}px`;
    nodeButton.style.top = `${position.y}px`;
    nodeButton.setAttribute("title", "드래그해서 위치 조정");
    if (selection.activeNodeIds.has(node.id)) nodeButton.classList.add("active");
    if (selection.hasSelection && !selection.activeNodeIds.has(node.id)) nodeButton.classList.add("muted");
    if (state.interactionLayout.manualPositions[node.id]) nodeButton.classList.add("is-manual");
    nodeButton.innerHTML = `<span class="interaction-node-title">${escapeHtml(node.name)}</span><span class="interaction-node-meta">${escapeHtml(node.instanceName)}<br />${escapeHtml(node.kind)} / In ${node.incomingCount} / Out ${node.outgoingCount}</span>`;
    nodeButton.addEventListener("pointerdown", (event) => startInteractionNodeDrag(event, node, layout));
    nodeButton.addEventListener("click", () => selectInteractionNode(node.id));
    board.appendChild(nodeButton);
  });

  elements.interactionCanvas.appendChild(board);
}

function renderInteractionReferenceLayout(interaction, selection) {
  if (!interaction.nodes.length || !interaction.connections.length) {
    elements.interactionCanvas.classList.add("empty-state");
    elements.interactionCanvas.innerHTML = "Composition connector가 감지되면 AUTOSAR reference layout 위에 SWC/CDD 연결 구조를 표시합니다.";
    return;
  }

  elements.interactionCanvas.classList.remove("empty-state");
  elements.interactionCanvas.innerHTML = "";

  const annotatedNodes = interaction.nodes.map((node) => ({
    ...node,
    referenceArea: resolveInteractionReferenceArea(node, interaction),
  }));
  const nodeGroups = groupInteractionNodesByReferenceArea(annotatedNodes);
  const board = document.createElement("div");
  board.className = "interaction-reference-board";
  board.style.width = `${Math.max(1360, nodeGroups.application.length * 186 + 220)}px`;
  board.innerHTML = buildInteractionReferenceBoardMarkup(nodeGroups);
  elements.interactionCanvas.appendChild(board);

  const referenceAreas = measureInteractionReferenceAreas(board);
  const layout = computeInteractionReferencePositions(annotatedNodes, referenceAreas);
  const routing = buildInteractionReferenceRouting(annotatedNodes, interaction.connections, layout.positions, referenceAreas);
  const edgeOffsets = buildInteractionEdgeOffsets(interaction.connections);
  const svg = createSvgElement("svg");
  svg.classList.add("interaction-svg", "interaction-reference-svg");
  svg.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  const defs = createSvgElement("defs");
  defs.innerHTML = '<marker id="interaction-arrow" markerWidth="7" markerHeight="7" refX="6" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 6 2.5 L 0 5 z" fill="#61d0ff"></path></marker><marker id="interaction-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 6 2.5 L 0 5 z" fill="#ffc857"></path></marker>';
  svg.appendChild(defs);

  interaction.connections.forEach((connection) => {
    const sourcePosition = layout.positions.get(connection.sourceId);
    const targetPosition = layout.positions.get(connection.targetId);
    if (!sourcePosition || !targetPosition) {
      return;
    }
    const route = buildInteractionReferenceEdgePath(connection, sourcePosition, targetPosition, routing, edgeOffsets.get(connection.id) || 0);
    const isActive = selection.activeEdgeIds.has(connection.id);
    const isMuted = selection.hasSelection && !selection.activeEdgeIds.has(connection.id);
    const visiblePath = createSvgElement("path");
    visiblePath.setAttribute("d", route.pathData);
    visiblePath.setAttribute("marker-end", isActive ? "url(#interaction-arrow-active)" : "url(#interaction-arrow)");
    visiblePath.classList.add("interaction-edge", "interaction-reference-edge");
    if (isActive) visiblePath.classList.add("active");
    if (isMuted) visiblePath.classList.add("muted");
    const clickPath = createSvgElement("path");
    clickPath.setAttribute("d", route.pathData);
    clickPath.classList.add("interaction-edge-hit");
    clickPath.addEventListener("click", () => selectInteractionEdge(connection.id));
    svg.append(visiblePath, clickPath);
    const labelPlacement = route.labelPosition || getEdgeLabelPlacement(visiblePath, sourcePosition, targetPosition, sourcePosition.width, sourcePosition.height);
    appendInteractionLabel(svg, connection.interfaceName, labelPlacement, isActive, isMuted);
  });

  board.appendChild(svg);

  annotatedNodes.forEach((node) => {
    const position = layout.positions.get(node.id);
    if (!position) {
      return;
    }
    const nodeButton = document.createElement("button");
    nodeButton.type = "button";
    nodeButton.className = `interaction-node interaction-reference-node ${node.lane}`;
    nodeButton.style.left = `${position.x}px`;
    nodeButton.style.top = `${position.y}px`;
    nodeButton.style.width = `${position.width}px`;
    nodeButton.style.minHeight = `${position.height}px`;
    nodeButton.setAttribute("title", "클릭해서 연결 상세 보기");
    if (selection.activeNodeIds.has(node.id)) nodeButton.classList.add("active");
    if (selection.hasSelection && !selection.activeNodeIds.has(node.id)) nodeButton.classList.add("muted");
    nodeButton.innerHTML = `<span class="interaction-node-title">${escapeHtml(node.name)}</span><span class="interaction-node-meta">${escapeHtml(node.instanceName)}<br />${escapeHtml(node.kind)} / In ${node.incomingCount} / Out ${node.outgoingCount}</span>`;
    nodeButton.addEventListener("click", () => selectInteractionNode(node.id));
    board.appendChild(nodeButton);
  });
}

function buildInteractionReferenceBoardMarkup(nodeGroups) {
  const cellsMarkup = INTERACTION_REFERENCE_AREAS.map((area) => `
    <article class="reference-cell ${area.toneClass} ${area.areaClass} interaction-reference-cell" data-ref-area="${area.key}">
      <div class="reference-cell-header interaction-reference-cell-header">
        <h4>${area.label}</h4>
        <span class="interaction-reference-count">${nodeGroups[area.key]?.length || 0}</span>
      </div>
    </article>
  `).join("");

  return `
    <section class="reference-band reference-application interaction-reference-application" data-ref-area="application">
      <div class="layer-header">
        <h3>Application Layer</h3>
        <span class="layer-count">${nodeGroups.application?.length || 0}</span>
      </div>
    </section>
    <section class="reference-band reference-rte-band interaction-reference-rte" data-ref-area="rte">
      <div class="layer-header interaction-reference-rte-header">
        <h3>Runtime Environment</h3>
      </div>
    </section>
    <div class="interaction-reference-route-gap" data-ref-area="routeGap" aria-hidden="true"></div>
    <section class="reference-bsw-panel interaction-reference-bsw-panel">
      <div class="interaction-reference-bsw-grid">
        ${cellsMarkup}
      </div>
    </section>
    <section class="reference-band reference-microcontroller interaction-reference-micro">
      <div class="reference-static-copy">
        <h3>Microcontroller</h3>
        <p>MCU core, peripheral, memory hardware boundary</p>
      </div>
    </section>
  `;
}

function groupInteractionNodesByReferenceArea(nodes) {
  const groups = { application: [] };
  INTERACTION_REFERENCE_AREAS.forEach((area) => {
    groups[area.key] = [];
  });
  nodes.forEach((node) => {
    const areaKey = node.referenceArea || "application";
    if (!groups[areaKey]) {
      groups[areaKey] = [];
    }
    groups[areaKey].push(node);
  });
  return groups;
}

function resolveInteractionReferenceArea(node, interaction) {
  if (node.lane === "application" || node.kind === "SWC") {
    return "application";
  }
  if (node.lane === "complex" || node.kind === "CDD") {
    return "complexDrivers";
  }

  const interfaceNames = interaction.connections
    .filter((connection) => connection.sourceId === node.id || connection.targetId === node.id)
    .map((connection) => connection.interfaceName)
    .join(" ");
  const candidates = [node.name, node.instanceName, node.typePath, interfaceNames].filter(Boolean);
  const moduleName = resolveReferenceModuleName({ name: candidates.join(" "), tag: shortNameFromRef(node.typePath) || node.name });
  if (moduleName) {
    return classifyReferenceArea({ name: moduleName, tag: moduleName }, "services");
  }

  const hintText = candidates.join(" ").toLowerCase();
  if (/(diagnostic|diag|dcm|xcp|doip|sd)/.test(hintText)) return "offboardServices";
  if (/(nvm|memory|memif|nvblock|nvram)/.test(hintText)) return "memoryServices";
  if (/(crypto|csm|secoc|crc|e2e)/.test(hintText)) return "cryptoServices";
  if (/(iohwab|wdgif|iohw|watchdog)/.test(hintText)) return "ioHardwareAbstraction";
  if (/(canif|cantp|cannm|cansm|can\b|linif|lintp|linsm|lin\b|frif|frtp|frnm|ethif|ethsm|eth\b|pdur|comxf|\bcom\b|soad|tcpip|udpnm|nm\b|communication|j1939)/.test(hintText)) return "communicationServices";
  return "systemServices";
}

function getInteractionReferenceAreaLabel(areaKey) {
  return areaKey === "application" ? "Application Layer" : INTERACTION_REFERENCE_AREA_LABELS[areaKey] || areaKey;
}

function measureInteractionReferenceAreas(board) {
  const boardRect = board.getBoundingClientRect();
  const areas = new Map();
  board.querySelectorAll("[data-ref-area]").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const header = element.querySelector(".layer-header, .reference-cell-header, .reference-static-copy");
    const headerRect = header?.getBoundingClientRect();
    const top = rect.top - boardRect.top;
    const left = rect.left - boardRect.left;
    const areaKey = element.dataset.refArea;
    const isRouteGap = areaKey === "routeGap";
    const contentTop = isRouteGap
      ? top
      : (headerRect ? headerRect.bottom - boardRect.top : top) + (areaKey === "application" ? 16 : 10);
    areas.set(areaKey, {
      left,
      top,
      width: rect.width,
      height: rect.height,
      contentLeft: left + 10,
      contentTop,
      contentWidth: Math.max(96, rect.width - 20),
      contentHeight: isRouteGap ? rect.height : Math.max(54, rect.height - (contentTop - top) - 16),
    });
  });
  const routeGap = areas.get("routeGap");
  return {
    width: Math.ceil(board.clientWidth),
    height: Math.ceil(board.clientHeight),
    rteBusY: routeGap ? routeGap.top + routeGap.height / 2 : 176,
    areas,
  };
}

function computeInteractionReferencePositions(nodes, referenceAreas) {
  const positions = new Map();
  const nodeGroups = groupInteractionNodesByReferenceArea(nodes);
  const gapX = 12;
  const gapY = 10;

  Object.entries(nodeGroups).forEach(([areaKey, areaNodes]) => {
    const area = referenceAreas.areas.get(areaKey);
    if (!area || !areaNodes.length) {
      return;
    }
    const isApplication = areaKey === "application";
    const preferredWidth = isApplication ? 184 : areaKey === "complexDrivers" ? 168 : 154;
    const nodeHeight = isApplication ? 76 : 68;
    const maxRows = Math.max(1, Math.floor((area.contentHeight + gapY) / (nodeHeight + gapY)));
    let nodeWidth = Math.max(110, Math.min(preferredWidth, area.contentWidth - 12));
    let columns = Math.max(1, Math.floor((area.contentWidth + gapX) / (nodeWidth + gapX)));

    while (Math.ceil(areaNodes.length / columns) > maxRows && nodeWidth > 110) {
      nodeWidth -= 12;
      columns = Math.max(1, Math.floor((area.contentWidth + gapX) / (nodeWidth + gapX)));
    }

    areaNodes
      .slice()
      .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
      .forEach((node, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const rowStart = row * columns;
        const itemsInRow = Math.min(columns, areaNodes.length - rowStart);
        const rowWidth = itemsInRow * nodeWidth + Math.max(0, itemsInRow - 1) * gapX;
        const startX = area.contentLeft + Math.max(0, (area.contentWidth - rowWidth) / 2);
        positions.set(node.id, {
          x: startX + col * (nodeWidth + gapX),
          y: area.contentTop + row * (nodeHeight + gapY),
          width: nodeWidth,
          height: nodeHeight,
          areaKey,
        });
      });
  });

  return {
    width: referenceAreas.width,
    height: referenceAreas.height,
    rteBusY: referenceAreas.rteBusY,
    positions,
  };
}

function buildInteractionReferenceRouting(nodes, connections, positions, referenceAreas) {
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  const incoming = new Map(nodes.map((node) => [node.id, []]));

  connections.forEach((connection) => {
    if (outgoing.has(connection.sourceId)) {
      outgoing.get(connection.sourceId).push(connection);
    }
    if (incoming.has(connection.targetId)) {
      incoming.get(connection.targetId).push(connection);
    }
  });

  const sourceSlots = new Map();
  const targetSlots = new Map();
  const compareByPeerX = (left, right, side) => {
    const leftPeerId = side === "source" ? left.targetId : left.sourceId;
    const rightPeerId = side === "source" ? right.targetId : right.sourceId;
    const leftPeer = positions.get(leftPeerId);
    const rightPeer = positions.get(rightPeerId);
    const leftX = leftPeer ? leftPeer.x + leftPeer.width / 2 : 0;
    const rightX = rightPeer ? rightPeer.x + rightPeer.width / 2 : 0;
    return leftX - rightX || left.order - right.order;
  };

  outgoing.forEach((edges, nodeId) => {
    const position = positions.get(nodeId);
    if (!position || !edges.length) {
      return;
    }
    const hasIncoming = (incoming.get(nodeId)?.length || 0) > 0;
    edges
      .slice()
      .sort((left, right) => compareByPeerX(left, right, "source"))
      .forEach((edge, index, list) => {
        sourceSlots.set(edge.id, distributeInteractionReferencePortX(position, index, list.length, "source", hasIncoming));
      });
  });

  incoming.forEach((edges, nodeId) => {
    const position = positions.get(nodeId);
    if (!position || !edges.length) {
      return;
    }
    const hasOutgoing = (outgoing.get(nodeId)?.length || 0) > 0;
    edges
      .slice()
      .sort((left, right) => compareByPeerX(left, right, "target"))
      .forEach((edge, index, list) => {
        targetSlots.set(edge.id, distributeInteractionReferencePortX(position, index, list.length, "target", hasOutgoing));
      });
  });

  const routeGap = referenceAreas.areas.get("routeGap");
  const topChannelBase = routeGap ? routeGap.top + 22 : referenceAreas.rteBusY - 22;
  const bottomChannelBase = routeGap ? routeGap.top + routeGap.height - 22 : referenceAreas.rteBusY + 22;
  const channelY = new Map();

  const appToApp = connections
    .filter((connection) => positions.get(connection.sourceId)?.areaKey === "application" && positions.get(connection.targetId)?.areaKey === "application")
    .slice()
    .sort((left, right) => left.order - right.order);
  appToApp.forEach((connection, index) => {
    channelY.set(connection.id, topChannelBase + getInteractionSpreadOffset(index) * 14);
  });

  const appToOther = connections
    .filter((connection) => {
      const sourceArea = positions.get(connection.sourceId)?.areaKey;
      const targetArea = positions.get(connection.targetId)?.areaKey;
      return sourceArea === "application" || targetArea === "application";
    })
    .filter((connection) => !channelY.has(connection.id))
    .slice()
    .sort((left, right) => left.order - right.order);
  appToOther.forEach((connection, index) => {
    channelY.set(connection.id, bottomChannelBase + getInteractionSpreadOffset(index) * 14);
  });

  return {
    sourceSlots,
    targetSlots,
    channelY,
    routeMidY: referenceAreas.rteBusY,
  };
}

function distributeInteractionReferencePortX(position, index, count, side = "source", splitFlow = false) {
  const safeCount = Math.max(1, count);
  const lanePadding = Math.max(14, position.width * 0.08);
  const availableWidth = Math.max(24, position.width - lanePadding * 2);
  const ratio = (index + 1) / (safeCount + 1);

  if (!splitFlow) {
    return position.x + lanePadding + ratio * availableWidth;
  }

  const splitGap = Math.max(10, position.width * 0.07);
  const halfWidth = Math.max(18, (availableWidth - splitGap) / 2);
  const isSource = side === "source";
  const startX = position.x + lanePadding + (isSource ? 0 : halfWidth + splitGap);
  return startX + ratio * halfWidth;
}

function getInteractionSpreadOffset(index) {
  if (index === 0) {
    return 0;
  }
  const step = Math.ceil(index / 2);
  return index % 2 === 1 ? -step : step;
}

function buildInteractionReferenceEdgePath(connection, sourcePosition, targetPosition, routing, parallelOffset = 0) {
  const sourceArea = sourcePosition.areaKey;
  const targetArea = targetPosition.areaKey;
  const startX = routing.sourceSlots.get(connection.id) ?? (sourcePosition.x + sourcePosition.width / 2);
  const endX = routing.targetSlots.get(connection.id) ?? (targetPosition.x + targetPosition.width / 2);
  const touchesApplication = sourceArea === "application" || targetArea === "application";

  if (touchesApplication) {
    const startY = sourceArea === "application"
      ? sourcePosition.y + sourcePosition.height + 6
      : sourcePosition.y - 6;
    const endY = targetArea === "application"
      ? targetPosition.y + targetPosition.height + 6
      : targetPosition.y - 6;
    const channelY = (routing.channelY.get(connection.id) ?? routing.routeMidY) + parallelOffset * 3;
    const labelX = Math.abs(endX - startX) > 44 ? (startX + endX) / 2 : endX + 42;

    return {
      pathData: `M ${startX} ${startY} L ${startX} ${channelY} L ${endX} ${channelY} L ${endX} ${endY}`,
      labelPosition: {
        x: labelX,
        y: channelY - 12,
      },
    };
  }

  const sourceCenterY = sourcePosition.y + sourcePosition.height / 2;
  const targetCenterY = targetPosition.y + targetPosition.height / 2;
  const sourceOnLeft = endX >= startX;
  const startY = sourceCenterY + parallelOffset * 4;
  const endY = targetCenterY + parallelOffset * 4;
  const bendX = ((startX + endX) / 2) + parallelOffset * 20;
  const anchorStartX = sourceOnLeft ? sourcePosition.x + sourcePosition.width : sourcePosition.x;
  const anchorEndX = sourceOnLeft ? targetPosition.x : targetPosition.x + targetPosition.width;
  const midX = sourceOnLeft ? Math.max(bendX, anchorStartX + 20) : Math.min(bendX, anchorStartX - 20);

  return {
    pathData: `M ${anchorStartX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${anchorEndX} ${endY}`,
    labelPosition: {
      x: midX,
      y: ((startY + endY) / 2) - 12,
    },
  };
}

function renderInteractionDetails(interaction, selection) {
  elements.interactionDetails.classList.remove("empty-state");
  if (selection.selectedEdge) {
    const edge = selection.selectedEdge;
    elements.interactionDetails.innerHTML = `<div class="detail-stack"><div class="detail-row"><span class="detail-label">Connector</span><div class="detail-value">${escapeHtml(edge.name)}</div></div><div class="detail-row"><span class="detail-label">Flow</span><div class="detail-value">${escapeHtml(edge.sourceName)} -> ${escapeHtml(edge.targetName)}</div></div><div class="detail-row"><span class="detail-label">Interface</span><div class="detail-value">${escapeHtml(edge.interfaceName)}</div></div><div class="detail-row"><span class="detail-label">Port Mapping</span><div class="detail-value">${escapeHtml(edge.providerPortName)} -> ${escapeHtml(edge.requesterPortName)}</div></div><div class="detail-row"><span class="detail-label">Source</span><div class="detail-value">${escapeHtml(edge.fileName)} / ${escapeHtml(edge.compositionPath || "-")}</div></div></div>`;
    return;
  }
  if (selection.selectedNode) {
    const node = selection.selectedNode;
    const incoming = interaction.connections.filter((connection) => connection.targetId === node.id);
    const outgoing = interaction.connections.filter((connection) => connection.sourceId === node.id);
    const referenceArea = state.interactionViewMode === "reference"
      ? getInteractionReferenceAreaLabel(resolveInteractionReferenceArea(node, interaction))
      : "";
    elements.interactionDetails.innerHTML = `<div class="detail-stack"><div class="detail-row"><span class="detail-label">Component</span><div class="detail-value">${escapeHtml(node.name)}</div></div><div class="detail-row"><span class="detail-label">Instance</span><div class="detail-value">${escapeHtml(node.instanceName)}</div></div><div class="detail-row"><span class="detail-label">Lane</span><div class="detail-value">${escapeHtml(INTERACTION_LANE_LABELS[node.lane] || node.lane)}</div></div>${referenceArea ? `<div class="detail-row"><span class="detail-label">Reference Area</span><div class="detail-value">${escapeHtml(referenceArea)}</div></div>` : ""}<div class="detail-row"><span class="detail-label">Incoming</span><div class="detail-chips">${renderDetailPills(incoming.map((connection) => `${connection.sourceName} / ${connection.interfaceName}`), "없음")}</div></div><div class="detail-row"><span class="detail-label">Outgoing</span><div class="detail-chips">${renderDetailPills(outgoing.map((connection) => `${connection.targetName} / ${connection.interfaceName}`), "없음")}</div></div></div>`;
    return;
  }
  const laneSummary = interaction.lanes.map((lane) => `${lane.label} ${lane.nodes.length}`).join(" / ");
  const usageText = state.interactionViewMode === "reference"
    ? "Reference Layout 모드에서는 AUTOSAR 레이어 위치 기준으로 연결 구조와 인터페이스를 표시합니다."
    : "노드 또는 연결 목록을 클릭하면 In/Out 관계와 인터페이스 매핑이 강조됩니다.";
  const summaryText = state.interactionViewMode === "reference"
    ? `${interaction.nodes.length}개 노드와 ${interaction.connections.length}개 connector를 AUTOSAR reference layout 위에 배치했습니다.`
    : `${interaction.nodes.length}개 노드와 ${interaction.connections.length}개 connector를 그래프로 표시했습니다.`;
  elements.interactionDetails.innerHTML = `<div class="detail-stack"><div class="detail-row"><span class="detail-label">Summary</span><div class="detail-value">${summaryText}</div></div><div class="detail-row"><span class="detail-label">Lane</span><div class="detail-value">${escapeHtml(laneSummary || "없음")}</div></div><div class="detail-row"><span class="detail-label">Usage</span><div class="detail-value">${usageText}</div></div></div>`;
}

function renderConnectionList(interaction, selection) {
  elements.connectionList.innerHTML = "";
  if (!interaction.connections.length) {
    elements.connectionList.classList.add("empty-state");
    elements.connectionList.innerHTML = "분석된 연결 구조가 아직 없습니다.";
    return;
  }
  elements.connectionList.classList.remove("empty-state");
  interaction.connections.forEach((connection) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "connection-item";
    if (selection.activeEdgeIds.has(connection.id)) item.classList.add("active");
    if (selection.hasSelection && !selection.activeEdgeIds.has(connection.id)) item.classList.add("muted");
    item.innerHTML = `<div class="connection-title">${escapeHtml(connection.sourceName)} -> ${escapeHtml(connection.targetName)}</div><div class="connection-meta">${escapeHtml(connection.interfaceName)} / ${escapeHtml(connection.providerPortName)} -> ${escapeHtml(connection.requesterPortName)}</div>`;
    item.addEventListener("click", () => selectInteractionEdge(connection.id));
    elements.connectionList.appendChild(item);
  });
}

function selectInteractionNode(nodeId) {
  state.selectedInteractionNodeId = state.selectedInteractionNodeId === nodeId ? "" : nodeId;
  state.selectedInteractionEdgeId = "";
  renderInteraction(state.architecture?.interaction || null);
}

function selectInteractionEdge(edgeId) {
  state.selectedInteractionEdgeId = state.selectedInteractionEdgeId === edgeId ? "" : edgeId;
  state.selectedInteractionNodeId = "";
  renderInteraction(state.architecture?.interaction || null);
}

function getInteractionSelection(interaction) {
  const selectedNode = interaction.nodes.find((node) => node.id === state.selectedInteractionNodeId) || null;
  const selectedEdge = interaction.connections.find((edge) => edge.id === state.selectedInteractionEdgeId) || null;
  const activeNodeIds = new Set();
  const activeEdgeIds = new Set();

  if (selectedEdge) {
    activeEdgeIds.add(selectedEdge.id);
    activeNodeIds.add(selectedEdge.sourceId);
    activeNodeIds.add(selectedEdge.targetId);
  } else if (selectedNode) {
    activeNodeIds.add(selectedNode.id);
    interaction.connections.forEach((connection) => {
      if (connection.sourceId === selectedNode.id || connection.targetId === selectedNode.id) {
        activeEdgeIds.add(connection.id);
        activeNodeIds.add(connection.sourceId);
        activeNodeIds.add(connection.targetId);
      }
    });
  }

  return { selectedNode, selectedEdge, activeNodeIds, activeEdgeIds, hasSelection: Boolean(selectedNode || selectedEdge) };
}

function computeInteractionLayout(nodes, lanes, connections, layoutOptions) {
  const nodeWidth = 196;
  const nodeHeight = 94;
  const leftPadding = 32;
  const rightPadding = 64;
  const topPadding = 84;
  const bottomPadding = 28;
  const sectionGapX = 18;
  const sectionGapY = 20;
  const laneHeight = clamp(Number(layoutOptions?.laneHeight) || DEFAULT_INTERACTION_LAYOUT.laneHeight, 162, 280);
  const bandHeight = laneHeight - 18;
  const columnGap = clamp(Number(layoutOptions?.columnGap) || DEFAULT_INTERACTION_LAYOUT.columnGap, 24, 220);
  const positions = new Map();
  const laneTop = new Map();
  const laneBottom = new Map();
  const laneRects = new Map();
  const columns = computeInteractionColumns(nodes, connections);
  const actualColumns = new Map();
  const laneNodeMap = new Map(lanes.map((lane) => [lane.id, lane.nodes.slice()]));

  lanes.forEach((lane) => {
    const laneNodes = nodes
      .filter((node) => node.lane === lane.id)
      .sort((left, right) => (columns.get(left.id) ?? left.order) - (columns.get(right.id) ?? right.order) || left.order - right.order);
    let lastColumn = Number.NEGATIVE_INFINITY;
    laneNodes.forEach((node, laneIndex) => {
      const desired = columns.get(node.id) ?? laneIndex;
      const resolved = Number.isFinite(lastColumn) ? Math.max(desired, lastColumn + 0.96) : desired;
      actualColumns.set(node.id, resolved);
      lastColumn = resolved;
    });
    laneNodeMap.set(lane.id, laneNodes);
  });

  const minColumn = Math.min(0, ...Array.from(actualColumns.values(), (value) => Number.isFinite(value) ? value : 0));
  if (minColumn < 0) {
    actualColumns.forEach((value, key) => {
      actualColumns.set(key, value - minColumn);
    });
  }

  const compactGap = clamp(columnGap * 0.68, 24, 84);
  const requiredLaneWidth = (laneNodes, ratio = 1) => {
    if (!laneNodes?.length) {
      return 0;
    }
    const baseWidth = laneNodes.length === 1
      ? nodeWidth + 40
      : laneNodes.length * nodeWidth + (laneNodes.length - 1) * compactGap + 40;
    return baseWidth / Math.max(0.1, ratio);
  };

  const applicationNodes = laneNodeMap.get("application") || [];
  const bswNodes = laneNodeMap.get("bswService") || [];
  const complexNodes = laneNodeMap.get("complex") || [];
  const otherNodes = laneNodeMap.get("other") || [];
  const hasApplication = applicationNodes.length > 0;
  const hasBsw = bswNodes.length > 0;
  const hasComplex = complexNodes.length > 0;
  const hasOther = otherNodes.length > 0;

  const splitWidth = hasBsw && hasComplex
    ? Math.max(requiredLaneWidth(bswNodes, 0.75), requiredLaneWidth(complexNodes, 0.25))
    : Math.max(requiredLaneWidth(bswNodes), requiredLaneWidth(complexNodes));
  const innerWidth = Math.max(780, Math.ceil(Math.max(requiredLaneWidth(applicationNodes), splitWidth, requiredLaneWidth(otherNodes))));
  const width = Math.max(920, Math.ceil(leftPadding + rightPadding + innerWidth));
  const contentWidth = width - leftPadding - rightPadding;

  const setLaneRect = (laneId, rect) => {
    laneRects.set(laneId, rect);
    laneTop.set(laneId, rect.y);
    laneBottom.set(laneId, rect.y + rect.height);
  };

  let currentY = topPadding;
  if (hasApplication) {
    setLaneRect("application", {
      x: leftPadding,
      y: currentY,
      width: contentWidth,
      height: bandHeight,
    });
    currentY += bandHeight + sectionGapY;
  }

  if (hasBsw && hasComplex) {
    const complexWidth = Math.round((contentWidth - sectionGapX) * 0.25);
    const bswWidth = contentWidth - sectionGapX - complexWidth;
    setLaneRect("bswService", {
      x: leftPadding,
      y: currentY,
      width: bswWidth,
      height: bandHeight,
    });
    setLaneRect("complex", {
      x: leftPadding + bswWidth + sectionGapX,
      y: currentY,
      width: complexWidth,
      height: bandHeight,
    });
    currentY += bandHeight + sectionGapY;
  } else if (hasBsw) {
    setLaneRect("bswService", {
      x: leftPadding,
      y: currentY,
      width: contentWidth,
      height: bandHeight,
    });
    currentY += bandHeight + sectionGapY;
  } else if (hasComplex) {
    setLaneRect("complex", {
      x: leftPadding,
      y: currentY,
      width: contentWidth,
      height: bandHeight,
    });
    currentY += bandHeight + sectionGapY;
  }

  if (hasOther) {
    setLaneRect("other", {
      x: leftPadding,
      y: currentY,
      width: contentWidth,
      height: bandHeight,
    });
    currentY += bandHeight + sectionGapY;
  }

  const height = Math.max(320, Math.ceil(currentY + bottomPadding));

  const resolveLaneX = (node) => {
    const laneRect = laneRects.get(node.lane);
    const laneNodes = laneNodeMap.get(node.lane) || [node];
    if (!laneRect) {
      return leftPadding + 18;
    }
    if (laneNodes.length <= 1) {
      return laneRect.x + Math.max(18, (laneRect.width - nodeWidth) / 2);
    }

    const laneValues = laneNodes.map((laneNode) => actualColumns.get(laneNode.id) ?? laneNode.order ?? 0);
    const laneMin = Math.min(...laneValues);
    const laneMax = Math.max(...laneValues);
    const span = Math.max(1, laneMax - laneMin);
    const normalized = ((actualColumns.get(node.id) ?? node.order ?? 0) - laneMin) / span;
    const preferredClusterWidth = laneNodes.length * nodeWidth + (laneNodes.length - 1) * compactGap;
    const clusterWidth = Math.min(Math.max(nodeWidth, preferredClusterWidth), Math.max(nodeWidth, laneRect.width - 40));
    const clusterStartX = laneRect.x + Math.max(20, (laneRect.width - clusterWidth) / 2);
    const availableWidth = Math.max(0, clusterWidth - nodeWidth);
    return clusterStartX + normalized * availableWidth;
  };

  nodes.forEach((node) => {
    const laneRect = laneRects.get(node.lane) || {
      x: leftPadding,
      y: topPadding,
      width: contentWidth,
      height: bandHeight,
    };
    const defaultPosition = {
      x: resolveLaneX(node),
      y: laneRect.y + Math.max(24, (laneRect.height - nodeHeight) / 2),
    };
    const manualPosition = layoutOptions?.manualPositions?.[node.id];
    positions.set(
      node.id,
      clampInteractionNodePosition(node, manualPosition || defaultPosition, { width, height, nodeWidth, nodeHeight, laneHeight, laneTop, laneRects })
    );
  });

  return { width, height, nodeWidth, nodeHeight, laneHeight, columnGap, positions, laneTop, laneBottom, laneRects };
}

function computeInteractionColumns(nodes, connections) {
  if (!nodes.length) {
    return new Map();
  }

  const ordering = buildInteractionOrdering(nodes, connections);
  const baseRanks = computeInteractionForwardRanks(nodes, connections, ordering);
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  const columns = new Map(nodes.map((node) => [node.id, baseRanks.get(node.id) || 0]));
  const orderedNodes = nodes
    .slice()
    .sort((left, right) => (ordering.get(left.id) ?? left.order) - (ordering.get(right.id) ?? right.order) || left.order - right.order);

  connections.forEach((connection) => {
    if (outgoing.has(connection.sourceId)) outgoing.get(connection.sourceId).push(connection.targetId);
    if (incoming.has(connection.targetId)) incoming.get(connection.targetId).push(connection.sourceId);
  });

  for (let iteration = 0; iteration < 4; iteration += 1) {
    orderedNodes.forEach((node) => {
      const desired = computeInteractionDesiredColumn(node.id, incoming, outgoing, columns, ordering, baseRanks);
      if (Number.isFinite(desired)) {
        columns.set(node.id, desired);
      }
    });
    orderedNodes.slice().reverse().forEach((node) => {
      const desired = computeInteractionDesiredColumn(node.id, incoming, outgoing, columns, ordering, baseRanks);
      if (Number.isFinite(desired)) {
        columns.set(node.id, desired);
      }
    });
  }

  return columns;
}

function buildInteractionOrdering(nodes, connections) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const remaining = new Set(nodes.map((node) => node.id));
  const incoming = new Map(nodes.map((node) => [node.id, new Set()]));
  const outgoing = new Map(nodes.map((node) => [node.id, new Set()]));
  const left = [];
  const right = [];

  connections.forEach((connection) => {
    if (!incoming.has(connection.targetId) || !outgoing.has(connection.sourceId)) {
      return;
    }
    outgoing.get(connection.sourceId).add(connection.targetId);
    incoming.get(connection.targetId).add(connection.sourceId);
  });

  const compareIds = (leftId, rightId) => compareInteractionNodes(nodeMap.get(leftId), nodeMap.get(rightId));
  const removeNode = (nodeId) => {
    if (!remaining.has(nodeId)) {
      return;
    }
    remaining.delete(nodeId);
    outgoing.get(nodeId)?.forEach((targetId) => incoming.get(targetId)?.delete(nodeId));
    incoming.get(nodeId)?.forEach((sourceId) => outgoing.get(sourceId)?.delete(nodeId));
  };

  while (remaining.size) {
    let progressed = false;
    let sources = Array.from(remaining).filter((nodeId) => (incoming.get(nodeId)?.size || 0) === 0).sort(compareIds);
    while (sources.length) {
      progressed = true;
      sources.forEach((nodeId) => {
        left.push(nodeId);
        removeNode(nodeId);
      });
      sources = Array.from(remaining).filter((nodeId) => (incoming.get(nodeId)?.size || 0) === 0).sort(compareIds);
    }

    let sinks = Array.from(remaining).filter((nodeId) => (outgoing.get(nodeId)?.size || 0) === 0).sort(compareIds);
    while (sinks.length) {
      progressed = true;
      sinks.forEach((nodeId) => {
        right.push(nodeId);
        removeNode(nodeId);
      });
      sinks = Array.from(remaining).filter((nodeId) => (outgoing.get(nodeId)?.size || 0) === 0).sort(compareIds);
    }

    if (progressed) {
      continue;
    }

    const pivotId = Array.from(remaining)
      .sort((leftId, rightId) => {
        const leftDelta = (outgoing.get(leftId)?.size || 0) - (incoming.get(leftId)?.size || 0);
        const rightDelta = (outgoing.get(rightId)?.size || 0) - (incoming.get(rightId)?.size || 0);
        return rightDelta - leftDelta || compareIds(leftId, rightId);
      })[0];
    left.push(pivotId);
    removeNode(pivotId);
  }

  return new Map(left.concat(right.reverse()).map((nodeId, index) => [nodeId, index]));
}

function computeInteractionForwardRanks(nodes, connections, ordering) {
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const ranks = new Map(nodes.map((node) => [node.id, 0]));
  const orderedNodes = nodes
    .slice()
    .sort((left, right) => (ordering.get(left.id) ?? left.order) - (ordering.get(right.id) ?? right.order) || left.order - right.order);

  connections.forEach((connection) => {
    if ((ordering.get(connection.sourceId) ?? 0) < (ordering.get(connection.targetId) ?? 0) && incoming.has(connection.targetId)) {
      incoming.get(connection.targetId).push(connection.sourceId);
    }
  });

  orderedNodes.forEach((node) => {
    const predecessorRanks = (incoming.get(node.id) || [])
      .map((nodeId) => (ranks.get(nodeId) ?? 0) + 1)
      .filter((value) => Number.isFinite(value));
    if (predecessorRanks.length) {
      ranks.set(node.id, Math.max(...predecessorRanks));
    }
  });

  return ranks;
}

function computeInteractionDesiredColumn(nodeId, incoming, outgoing, columns, ordering, baseRanks) {
  const nodeOrder = ordering.get(nodeId) ?? 0;
  const values = [];

  (incoming.get(nodeId) || []).forEach((sourceId) => {
    if ((ordering.get(sourceId) ?? -1) < nodeOrder) {
      values.push((columns.get(sourceId) ?? baseRanks.get(sourceId) ?? 0) + 1);
    }
  });

  (outgoing.get(nodeId) || []).forEach((targetId) => {
    if (nodeOrder < (ordering.get(targetId) ?? Number.POSITIVE_INFINITY)) {
      values.push((columns.get(targetId) ?? baseRanks.get(targetId) ?? 0) - 1);
    }
  });

  if (!values.length) {
    return baseRanks.get(nodeId) ?? 0;
  }

  const base = baseRanks.get(nodeId) ?? 0;
  const desired = values.reduce((sum, value) => sum + value, 0) / values.length;
  return desired * 0.78 + base * 0.22;
}

function compareInteractionNodes(left, right) {
  const lanePriority = { application: 0, bswService: 1, complex: 2, other: 3 };
  return (lanePriority[left?.lane] ?? 99) - (lanePriority[right?.lane] ?? 99)
    || (left?.order ?? 0) - (right?.order ?? 0)
    || String(left?.name || "").localeCompare(String(right?.name || ""));
}

function buildInteractionEdgeOffsets(connections) {
  const groups = new Map();
  const offsets = new Map();

  connections.forEach((connection) => {
    const key = [connection.sourceId, connection.targetId].sort().join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(connection);
  });

  groups.forEach((items) => {
    const midpoint = (items.length - 1) / 2;
    items
      .slice()
      .sort((left, right) => left.order - right.order)
      .forEach((connection, index) => offsets.set(connection.id, index - midpoint));
  });

  return offsets;
}

function buildInteractionGraphRouting(nodes, connections, layout) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const sourcePortY = new Map();
  const targetPortY = new Map();
  const sourceSide = new Map();
  const targetSide = new Map();
  const crossLaneChannelY = new Map();
  const feedbackChannelY = new Map();
  const outgoingGroups = new Map();
  const incomingGroups = new Map();
  const crossLaneGroups = new Map();
  const feedbackGroups = new Map();
  const pushToGroup = (map, key, value) => {
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(value);
  };
  const getPosition = (nodeId) => layout.positions.get(nodeId);

  connections.forEach((connection) => {
    const sourcePosition = getPosition(connection.sourceId);
    const targetPosition = getPosition(connection.targetId);
    if (!sourcePosition || !targetPosition) {
      return;
    }

    const sourceCenterX = sourcePosition.x + layout.nodeWidth / 2;
    const targetCenterX = targetPosition.x + layout.nodeWidth / 2;
    const exitsRight = targetCenterX >= sourceCenterX;
    const resolvedSourceSide = exitsRight ? "right" : "left";
    const resolvedTargetSide = exitsRight ? "left" : "right";
    sourceSide.set(connection.id, resolvedSourceSide);
    targetSide.set(connection.id, resolvedTargetSide);
    pushToGroup(outgoingGroups, `${connection.sourceId}:${resolvedSourceSide}`, connection);
    pushToGroup(incomingGroups, `${connection.targetId}:${resolvedTargetSide}`, connection);

    const sourceNode = nodeMap.get(connection.sourceId);
    const targetNode = nodeMap.get(connection.targetId);
    if (!sourceNode || !targetNode) {
      return;
    }

    if (sourceNode.lane !== targetNode.lane) {
      const sourceTop = layout.laneTop.get(sourceNode.lane) || 0;
      const targetTop = layout.laneTop.get(targetNode.lane) || 0;
      const upperLaneId = sourceTop <= targetTop ? sourceNode.lane : targetNode.lane;
      const lowerLaneId = sourceTop <= targetTop ? targetNode.lane : sourceNode.lane;
      pushToGroup(crossLaneGroups, `${upperLaneId}|${lowerLaneId}`, connection);
    } else if (!exitsRight) {
      pushToGroup(feedbackGroups, sourceNode.lane, connection);
    }
  });

  const compareByPeerPosition = (left, right, side) => {
    const leftPeerId = side === "source" ? left.targetId : left.sourceId;
    const rightPeerId = side === "source" ? right.targetId : right.sourceId;
    const leftPeer = getPosition(leftPeerId);
    const rightPeer = getPosition(rightPeerId);
    const leftY = leftPeer ? leftPeer.y + layout.nodeHeight / 2 : 0;
    const rightY = rightPeer ? rightPeer.y + layout.nodeHeight / 2 : 0;
    const leftX = leftPeer ? leftPeer.x + layout.nodeWidth / 2 : 0;
    const rightX = rightPeer ? rightPeer.x + layout.nodeWidth / 2 : 0;
    return leftY - rightY || leftX - rightX || left.order - right.order;
  };

  outgoingGroups.forEach((edges, groupKey) => {
    const nodeId = groupKey.split(":")[0];
    const position = getPosition(nodeId);
    if (!position || !edges.length) {
      return;
    }
    edges
      .slice()
      .sort((left, right) => compareByPeerPosition(left, right, "source"))
      .forEach((connection, index, list) => {
        sourcePortY.set(connection.id, distributeInteractionGraphPortY(position, index, list.length, layout.nodeHeight));
      });
  });

  incomingGroups.forEach((edges, groupKey) => {
    const nodeId = groupKey.split(":")[0];
    const position = getPosition(nodeId);
    if (!position || !edges.length) {
      return;
    }
    edges
      .slice()
      .sort((left, right) => compareByPeerPosition(left, right, "target"))
      .forEach((connection, index, list) => {
        targetPortY.set(connection.id, distributeInteractionGraphPortY(position, index, list.length, layout.nodeHeight));
      });
  });

  crossLaneGroups.forEach((edges, groupKey) => {
    const [upperLaneId, lowerLaneId] = groupKey.split("|");
    const upperBottom = layout.laneBottom.get(upperLaneId) ?? ((layout.laneTop.get(upperLaneId) || 0) + layout.laneHeight - 18);
    const lowerTop = layout.laneTop.get(lowerLaneId) || upperBottom + 48;
    const baseChannelY = (upperBottom + lowerTop) / 2;
    edges
      .slice()
      .sort((left, right) => {
        const leftSource = getPosition(left.sourceId);
        const leftTarget = getPosition(left.targetId);
        const rightSource = getPosition(right.sourceId);
        const rightTarget = getPosition(right.targetId);
        const leftMidX = ((leftSource?.x || 0) + (leftTarget?.x || 0) + layout.nodeWidth) / 2;
        const rightMidX = ((rightSource?.x || 0) + (rightTarget?.x || 0) + layout.nodeWidth) / 2;
        return leftMidX - rightMidX || left.order - right.order;
      })
      .forEach((connection, index) => {
        crossLaneChannelY.set(connection.id, baseChannelY + getInteractionSpreadOffset(index) * 18);
      });
  });

  feedbackGroups.forEach((edges, laneId) => {
    const laneTop = layout.laneTop.get(laneId) || 72;
    edges
      .slice()
      .sort((left, right) => {
        const leftSource = getPosition(left.sourceId);
        const rightSource = getPosition(right.sourceId);
        return (leftSource?.x || 0) - (rightSource?.x || 0) || left.order - right.order;
      })
      .forEach((connection, index) => {
        feedbackChannelY.set(connection.id, Math.max(24, laneTop - 30 - index * 18));
      });
  });

  return {
    sourcePortY,
    targetPortY,
    sourceSide,
    targetSide,
    crossLaneChannelY,
    feedbackChannelY,
  };
}

function distributeInteractionGraphPortY(position, index, count, nodeHeight) {
  const safeCount = Math.max(1, count);
  const padding = 16;
  const usableHeight = Math.max(24, nodeHeight - padding * 2);
  return position.y + padding + ((index + 1) / (safeCount + 1)) * usableHeight;
}

function buildEdgePath(connection, sourceNode, targetNode, sourcePosition, targetPosition, layout, routing, parallelOffset = 0) {
  if (!sourceNode || !targetNode) {
    return `M ${sourcePosition.x + layout.nodeWidth} ${sourcePosition.y + layout.nodeHeight / 2} L ${targetPosition.x} ${targetPosition.y + layout.nodeHeight / 2}`;
  }

  const sameLane = sourceNode.lane === targetNode.lane;
  const resolvedSourceSide = routing.sourceSide.get(connection.id) || (targetPosition.x >= sourcePosition.x ? "right" : "left");
  const resolvedTargetSide = routing.targetSide.get(connection.id) || (resolvedSourceSide === "right" ? "left" : "right");
  const startX = sourcePosition.x + (resolvedSourceSide === "right" ? layout.nodeWidth : 0);
  const endX = targetPosition.x + (resolvedTargetSide === "right" ? layout.nodeWidth : 0);
  const startY = routing.sourcePortY.get(connection.id) ?? (sourcePosition.y + layout.nodeHeight / 2);
  const endY = routing.targetPortY.get(connection.id) ?? (targetPosition.y + layout.nodeHeight / 2);
  const minX = 18;
  const maxX = layout.width - 18;

  if (!sameLane) {
    const channelY = routing.crossLaneChannelY.get(connection.id)
      ?? (((layout.laneBottom.get(sourceNode.lane) || startY) + (layout.laneTop.get(targetNode.lane) || endY)) / 2);
    const outX = clamp(startX + (resolvedSourceSide === "right" ? 1 : -1) * (28 + Math.abs(parallelOffset) * 8), minX, maxX);
    const inX = clamp(endX + (resolvedTargetSide === "right" ? 1 : -1) * (28 + Math.abs(parallelOffset) * 8), minX, maxX);
    return `M ${startX} ${startY} L ${outX} ${startY} L ${outX} ${channelY} L ${inX} ${channelY} L ${inX} ${endY} L ${endX} ${endY}`;
  }

  const forward = resolvedSourceSide === "right";
  if (forward) {
    const curve = Math.max(72, (endX - startX) * 0.4);
    const curveShift = (endY - startY) * 0.18 + parallelOffset * 18;
    return `M ${startX} ${startY} C ${startX + curve} ${startY + curveShift}, ${endX - curve} ${endY - curveShift}, ${endX} ${endY}`;
  }

  const laneTop = layout.laneTop.get(sourceNode.lane) || 72;
  const channelY = routing.feedbackChannelY.get(connection.id) ?? Math.max(24, laneTop - 30);
  const outX = clamp(startX - (30 + Math.abs(parallelOffset) * 10), minX, maxX);
  const inX = clamp(endX + (30 + Math.abs(parallelOffset) * 10), minX, maxX);
  return `M ${startX} ${startY} L ${outX} ${startY} L ${outX} ${channelY} L ${inX} ${channelY} L ${inX} ${endY} L ${endX} ${endY}`;
}

function getEdgeLabelPlacement(pathElement, sourcePosition, targetPosition, nodeWidth, nodeHeight) {
  const fallback = {
    x: (sourcePosition.x + targetPosition.x + nodeWidth) / 2,
    y: ((sourcePosition.y + nodeHeight / 2) + (targetPosition.y + nodeHeight / 2)) / 2,
  };
  if (!pathElement || typeof pathElement.getTotalLength !== "function") return fallback;

  try {
    const totalLength = pathElement.getTotalLength();
    if (!Number.isFinite(totalLength) || totalLength <= 1) return fallback;
    const anchorLength = Math.max(12, Math.min(totalLength - 12, totalLength * 0.56));
    const anchor = pathElement.getPointAtLength(anchorLength);
    const before = pathElement.getPointAtLength(Math.max(0, anchorLength - 10));
    const after = pathElement.getPointAtLength(Math.min(totalLength, anchorLength + 10));
    const tangentX = after.x - before.x;
    const tangentY = after.y - before.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = tangentY / tangentLength;
    const normalY = -tangentX / tangentLength;
    return {
      x: anchor.x + normalX * 16,
      y: anchor.y + normalY * 16,
    };
  } catch {
    return fallback;
  }
}

function appendInteractionLabel(svg, textValue, position, isActive, isMuted) {
  const group = createSvgElement("g");
  group.classList.add("interaction-label-group");
  if (isActive) group.classList.add("active");
  if (isMuted) group.classList.add("muted");

  const text = createSvgElement("text");
  text.textContent = textValue;
  text.setAttribute("x", String(position.x));
  text.setAttribute("y", String(position.y));
  text.setAttribute("dominant-baseline", "middle");
  text.classList.add("interaction-label");
  group.appendChild(text);
  svg.appendChild(group);

  try {
    const box = text.getBBox();
    const background = createSvgElement("rect");
    background.setAttribute("x", String(box.x - 8));
    background.setAttribute("y", String(box.y - 4));
    background.setAttribute("width", String(box.width + 16));
    background.setAttribute("height", String(box.height + 8));
    background.setAttribute("rx", "9");
    background.setAttribute("ry", "9");
    background.classList.add("interaction-label-bg");
    group.insertBefore(background, text);
  } catch {
    // Skip label background when SVG text metrics are unavailable.
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createSvgElement(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function updateSummary({ fileCount, packageCount, swcCount, bswCount, interfaceCount, errorCount }) {
  elements.fileCount.textContent = fileCount.toString();
  elements.packageCount.textContent = packageCount.toString();
  elements.swcCount.textContent = swcCount.toString();
  elements.bswCount.textContent = bswCount.toString();
  elements.interfaceCount.textContent = interfaceCount.toString();
  elements.errorCount.textContent = errorCount.toString();
}

function setStatus(text, tone) {
  elements.statusBadge.textContent = text;
  elements.statusBadge.className = `status-badge ${tone}`;
}

function switchViewTab(tabId) {
  state.activeViewTab = tabId === "interaction" ? "interaction" : "architecture";
  renderViewTabs();
}

function renderViewTabs() {
  elements.viewTabs.forEach((tab) => {
    const isActive = tab.dataset.tabTarget === state.activeViewTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  elements.viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== state.activeViewTab;
  });
}
function createArchitectureBucket() {
  return { application: [], complex: [], rte: [], rteSource: [], interfaces: [], services: [], communication: [], memory: [], ecuAbstraction: [], mcal: [], unknownBsw: [] };
}

function createInteractionBucket() {
  return { componentTypes: [], componentInstances: [], connectors: [] };
}

function makeItem(name, tag, fileName, packagePath, kind) {
  return { name, tag, fileName, packagePath, kind };
}

function zeroStats() {
  return { packageCount: 0, swcCount: 0, interfaceCount: 0, bswCount: 0 };
}

function normalizeTag(node) {
  return (node.localName || node.tagName || "").toUpperCase();
}

function childText(node, tagName) {
  if (!node) return "";
  for (const child of node.children) {
    if (normalizeTag(child) === tagName.toUpperCase()) return child.textContent.trim();
  }
  return "";
}

function getDirectChild(node, tagName) {
  if (!node) return null;
  for (const child of node.children) {
    if (normalizeTag(child) === tagName.toUpperCase()) return child;
  }
  return null;
}

function countByTag(documentNode, tagName) {
  let count = 0;
  for (const node of documentNode.getElementsByTagName("*")) {
    if (normalizeTag(node) === tagName.toUpperCase()) count += 1;
  }
  return count;
}

function countByTagSet(documentNode, tagNames) {
  let count = 0;
  for (const node of documentNode.getElementsByTagName("*")) {
    if (tagNames.has(normalizeTag(node))) count += 1;
  }
  return count;
}

function extractModuleName(node) {
  const definitionRef = childText(node, "DEFINITION-REF");
  if (!definitionRef) return "";
  return definitionRef.split("/").filter(Boolean).at(-1) || "";
}

function classifyBswModule(rawName) {
  return Core.classifyBswModule(rawName);
}

function sanitizeIdentifier(value) {
  return Core.sanitizeIdentifier(value);
}

function getPackagePath(node) {
  const names = [];
  let current = node;
  while (current) {
    if (normalizeTag(current) === "AR-PACKAGE") {
      const name = childText(current, "SHORT-NAME");
      if (name) names.unshift(name);
    }
    current = current.parentElement;
  }
  return names.length ? `/${names.join("/")}` : "-";
}

function getElementPath(node) {
  const names = [];
  let current = node;
  while (current) {
    const name = childText(current, "SHORT-NAME");
    if (name) names.unshift(name);
    current = current.parentElement;
  }
  return names.length ? `/${names.join("/")}` : "-";
}

function getAncestorElementPath(node, tagName) {
  let current = node.parentElement;
  while (current) {
    if (normalizeTag(current) === tagName.toUpperCase()) return getElementPath(current);
    current = current.parentElement;
  }
  return "-";
}

function isInstantiableComponentTag(tag) {
  return tag !== "COMPOSITION-SW-COMPONENT-TYPE" && (APPLICATION_TYPES.has(tag) || COMPLEX_DRIVER_TYPES.has(tag));
}

function extractPorts(componentNode, componentPath) {
  const portsNode = getDirectChild(componentNode, "PORTS");
  if (!portsNode) return [];
  return Array.from(portsNode.children).map((portNode) => {
    const portTag = normalizeTag(portNode);
    if (portTag !== "P-PORT-PROTOTYPE" && portTag !== "R-PORT-PROTOTYPE") return null;
    const name = childText(portNode, "SHORT-NAME");
    if (!name) return null;
    const interfaceNode = getDirectChild(portNode, portTag === "P-PORT-PROTOTYPE" ? "PROVIDED-INTERFACE-TREF" : "REQUIRED-INTERFACE-TREF");
    const interfacePath = interfaceNode ? interfaceNode.textContent.trim() : "";
    return { path: `${componentPath}/${name}`, name, portTag, direction: portTag === "P-PORT-PROTOTYPE" ? "Provided" : "Required", interfacePath, interfaceName: shortNameFromRef(interfacePath) || "-" };
  }).filter(Boolean);
}

function shortNameFromRef(reference) {
  return Core.shortNameFromRef(reference);
}

function buildInteractionNode(instance, type, fallbackOrder) {
  return Core.buildInteractionNode(instance, type, fallbackOrder);
}

function inferKindFromDest(typeDest, typePath) {
  return Core.inferKindFromDest(typeDest, typePath);
}

function inferLaneFromKind(kind) {
  return Core.inferLaneFromKind(kind);
}

function resolveConnection(connector, nodeMap, portMap, index) {
  return Core.resolveConnection(connector, nodeMap, portMap, index);
}

function buildInteractionLanes(nodes) {
  return Core.buildInteractionLanes(nodes);
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = [item.name, item.tag, item.kind, item.packagePath].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeEvidence(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const key = [entry.classification, entry.name, entry.source, entry.packagePath, entry.fileName].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeBy(items, getKey) {
  return Core.dedupeBy(items, getKey);
}

function evidenceLabel(group) {
  if (group === "application") return "Application Layer";
  if (group === "complex") return "Complex Drivers";
  if (group === "interfaces") return "Interfaces";
  if (group === "rteSource") return "RTE Signals";
  if (group === "unknownBsw") return "Unclassified BSW";
  return BSW_LABELS[group] || group;
}

function renderDetailPills(values, emptyLabel) {
  if (!values.length) return `<span class="detail-pill">${escapeHtml(emptyLabel)}</span>`;
  return values.map((value) => `<span class="detail-pill">${escapeHtml(value)}</span>`).join("");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}




