const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');

test('classifyBswModule maps representative module names', () => {
  assert.equal(core.classifyBswModule('Dem'), 'services');
  assert.equal(core.classifyBswModule('CanIf'), 'communication');
  assert.equal(core.classifyBswModule('IoHwAb_Config'), 'ecuAbstraction');
  assert.equal(core.classifyBswModule('Mcu'), 'mcal');
  assert.equal(core.classifyBswModule('UnknownThing'), '');
});

test('resolveConnection links nodes and derives interface/port names', () => {
  const nodeMap = new Map([
    ['/Comp/A', { id: '/Comp/A', name: 'SensorFusionSwc', instanceName: 'SensorFusion_Instance' }],
    ['/Comp/B', { id: '/Comp/B', name: 'VehicleControllerSwc', instanceName: 'VehicleController_Instance' }],
  ]);
  const portMap = new Map([
    ['/Type/A/P_VehicleState', { name: 'P_VehicleState', interfaceName: 'VehicleState_I', interfacePath: '/Interfaces/VehicleState_I' }],
    ['/Type/B/R_VehicleState', { name: 'R_VehicleState', interfaceName: 'VehicleState_I', interfacePath: '/Interfaces/VehicleState_I' }],
  ]);

  const connection = core.resolveConnection({
    name: 'SensorFusion_to_Controller',
    providerComponentRef: '/Comp/A',
    requesterComponentRef: '/Comp/B',
    providerPortRef: '/Type/A/P_VehicleState',
    requesterPortRef: '/Type/B/R_VehicleState',
    fileName: '04-composition.arxml',
    compositionPath: '/Compositions/VehicleControlComposition',
    order: 0,
  }, nodeMap, portMap, 0);

  assert.equal(connection.interfaceName, 'VehicleState_I');
  assert.equal(connection.providerPortName, 'P_VehicleState');
  assert.equal(connection.requesterPortName, 'R_VehicleState');
  assert.equal(connection.sourceName, 'SensorFusionSwc');
  assert.equal(connection.targetName, 'VehicleControllerSwc');
});

test('mergeInteractionData keeps connected service nodes and removes unresolved connectors', () => {
  const parsedFiles = [
    {
      ok: true,
      interaction: {
        componentTypes: [
          {
            path: '/ApplicationSwcs/VehicleControllerSwc',
            name: 'VehicleControllerSwc',
            kind: 'SWC',
            lane: 'application',
            packagePath: '/ApplicationSwcs',
            fileName: '02-application-swcs.arxml',
            order: 0,
            ports: [
              { path: '/ApplicationSwcs/VehicleControllerSwc/R_DiagnosticEvent', name: 'R_DiagnosticEvent', interfacePath: '/Interfaces/DiagnosticEvent_I', interfaceName: 'DiagnosticEvent_I' },
            ],
          },
          {
            path: '/ApplicationSwcs/DiagnosticServiceSwc',
            name: 'DiagnosticServiceSwc',
            kind: 'BSW Service',
            lane: 'bswService',
            packagePath: '/ApplicationSwcs',
            fileName: '02-application-swcs.arxml',
            order: 1,
            ports: [
              { path: '/ApplicationSwcs/DiagnosticServiceSwc/P_DiagnosticEvent', name: 'P_DiagnosticEvent', interfacePath: '/Interfaces/DiagnosticEvent_I', interfaceName: 'DiagnosticEvent_I' },
            ],
          },
          {
            path: '/ApplicationSwcs/UnusedServiceSwc',
            name: 'UnusedServiceSwc',
            kind: 'BSW Service',
            lane: 'bswService',
            packagePath: '/ApplicationSwcs',
            fileName: '02-application-swcs.arxml',
            order: 2,
            ports: [],
          },
        ],
        componentInstances: [
          {
            path: '/Compositions/VehicleControlComposition/VehicleController_Instance',
            name: 'VehicleController_Instance',
            typePath: '/ApplicationSwcs/VehicleControllerSwc',
            typeDest: 'APPLICATION-SW-COMPONENT-TYPE',
            fileName: '04-composition.arxml',
            packagePath: '/Compositions',
            order: 0,
          },
          {
            path: '/Compositions/VehicleControlComposition/DiagnosticService_Instance',
            name: 'DiagnosticService_Instance',
            typePath: '/ApplicationSwcs/DiagnosticServiceSwc',
            typeDest: 'SERVICE-SW-COMPONENT-TYPE',
            fileName: '04-composition.arxml',
            packagePath: '/Compositions',
            order: 1,
          },
          {
            path: '/Compositions/VehicleControlComposition/UnusedService_Instance',
            name: 'UnusedService_Instance',
            typePath: '/ApplicationSwcs/UnusedServiceSwc',
            typeDest: 'SERVICE-SW-COMPONENT-TYPE',
            fileName: '04-composition.arxml',
            packagePath: '/Compositions',
            order: 2,
          },
        ],
        connectors: [
          {
            name: 'DiagnosticService_to_Controller',
            providerComponentRef: '/Compositions/VehicleControlComposition/DiagnosticService_Instance',
            requesterComponentRef: '/Compositions/VehicleControlComposition/VehicleController_Instance',
            providerPortRef: '/ApplicationSwcs/DiagnosticServiceSwc/P_DiagnosticEvent',
            requesterPortRef: '/ApplicationSwcs/VehicleControllerSwc/R_DiagnosticEvent',
            fileName: '04-composition.arxml',
            compositionPath: '/Compositions/VehicleControlComposition',
            order: 0,
          },
          {
            name: 'BrokenConnector',
            providerComponentRef: '/Compositions/VehicleControlComposition/MissingProvider',
            requesterComponentRef: '/Compositions/VehicleControlComposition/VehicleController_Instance',
            providerPortRef: '/Missing/P_Port',
            requesterPortRef: '/ApplicationSwcs/VehicleControllerSwc/R_DiagnosticEvent',
            fileName: '04-composition.arxml',
            compositionPath: '/Compositions/VehicleControlComposition',
            order: 1,
          },
        ],
      },
    },
  ];

  const result = core.mergeInteractionData(parsedFiles);

  assert.equal(result.nodes.length, 2);
  assert.deepEqual(result.nodes.map((node) => node.name), ['VehicleControllerSwc', 'DiagnosticServiceSwc']);
  assert.equal(result.connections.length, 1);
  assert.equal(result.unresolvedConnectors, 1);
  assert.equal(result.connections[0].interfaceName, 'DiagnosticEvent_I');
  assert.deepEqual(result.lanes.map((lane) => lane.id), ['application', 'bswService']);
});
